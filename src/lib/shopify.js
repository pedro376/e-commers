import { createStorefrontApiClient } from '@shopify/storefront-api-client';
function extraerCategoria(tituloOriginal) {
  const match = tituloOriginal.match(/^-\s*(retro|club)\s*/i);

  if (match) {
    const categoria = match[1].toLowerCase(); // "retro" o "club"
    const nombre = tituloOriginal.slice(match[0].length).trim();
    return { categoria, nombre };
  }

  // Sin prefijo = camiseta normal
  return { categoria: "seleccion", nombre: tituloOriginal.trim() };
}
export const shopifyClient = createStorefrontApiClient({
    storeDomain: import.meta.env.VITE_SHOPIFY_DOMAIN,
    apiVersion: '2024-10',
    publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

// Trae TODOS los productos de la tienda (usamos esta, ya que no manejan colecciones)
export async function obtenerTodosLosProductos() {
    const query = `
        query GetAllProducts {
            products(first: 100) {
                edges {
                    node {
                        id
                        title
                        description
                        featuredImage { url altText }
                        images(first: 10) {
                            edges { node { url altText } }
                        }
                        priceRange {
                            minVariantPrice { amount currencyCode }
                        }
                        variants(first: 20) {
                            edges { node { id title availableForSale } }
                        }
                    }
                }
            }
        }
    `;

    const { data } = await shopifyClient.request(query);

    if (!data?.products) return [];

return data.products.edges.map(({ node }) => {
  const { categoria, nombre } = extraerCategoria(node.title);

        return {
            id: node.id,
            nombre,
            categoria,
            descripcion: node.description,
            precio: parseFloat(node.priceRange.minVariantPrice.amount),
            img: node.featuredImage?.url || "",
            imagenes: node.images.edges.map(({ node }) => ({ url: node.url, alt: node.altText })),
            tallas: node.variants.edges.map(({ node }) => ({
            variantId: node.id,
            talla: node.title,
            disponible: node.availableForSale,
            })),
        };
        });
}


/**
 * Crea un carrito "espejo" en Shopify con los items actuales y regresa
 * el total YA con descuentos automáticos aplicados (como el 3x2),
 * más el detalle de cuánto se descontó por cada línea (variante).
 *
 * Se usa para reflejar el precio real en el CartDrawer, sin esperar
 * a que el cliente llegue al checkout.
 */
export async function sincronizarCarrito(items) {
  const mutation = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount { amount }
          }
          lines(first: 50) {
            edges {
              node {
                quantity
                merchandise {
                  ... on ProductVariant { id }
                }
                discountAllocations {
                  discountedAmount { amount }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const lines = items.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.cantidad,
  }));

  const { data } = await shopifyClient.request(mutation, {
    variables: { input: { lines } },
  });

  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = data?.cartCreate?.cart;
  if (!cart) throw new Error("No se pudo sincronizar el carrito");

  const total = parseFloat(cart.cost.totalAmount.amount);

  const subtotalSinDescuento = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );
  const ahorro = Math.max(0, subtotalSinDescuento - total);

  // Cuánto se descontó por cada variante específica (para mostrar el
  // badge "3X2 (-$700.00)" o "GRATIS" en la línea correcta del carrito)
  const descuentosPorLinea = {};
  cart.lines.edges.forEach(({ node }) => {
    const variantId = node.merchandise?.id;
    const descuentoLinea = node.discountAllocations.reduce(
      (suma, d) => suma + parseFloat(d.discountedAmount.amount),
      0
    );
    if (variantId && descuentoLinea > 0) {
      descuentosPorLinea[variantId] = descuentoLinea;
    }
  });

  return {
    total,
    ahorro,
    checkoutUrl: cart.checkoutUrl,
    descuentosPorLinea,
  };
}

export async function crearCheckoutUrl(items) {
  const mutation = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lines = items.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.cantidad,
  }));

  const { data } = await shopifyClient.request(mutation, {
    variables: { input: { lines } },
  });

  if (data?.cartCreate?.userErrors?.length > 0) {
    console.error("Errores del carrito:", data.cartCreate.userErrors);
    throw new Error("No se pudo crear el checkout");
  }

  return data?.cartCreate?.cart?.checkoutUrl;
}
// Trae productos de una colección específica (la dejamos por si la usan después)
export async function obtenerProductosPorColeccion(handle) {
    const query = `
        query GetCollectionProducts($handle: String!) {
            collection(handle: $handle) {
                title
                products(first: 50) {
                    edges {
                        node {
                            id
                            title
                            description
                            featuredImage { url altText }
                            images(first: 10) {
                                edges { node { url altText } }
                            }
                            priceRange {
                                minVariantPrice { amount currencyCode }
                            }
                            variants(first: 20) {
                                edges { node { id title availableForSale } }
                            }
                        }
                    }
                }
            }
        }
    `;

    const { data } = await shopifyClient.request(query, {
        variables: { handle },
    });

    if (!data?.collection) return [];

    return data.collection.products.edges.map(({ node }) => ({
        id: node.id,
        nombre: node.title,
        descripcion: node.description,
        precio: parseFloat(node.priceRange.minVariantPrice.amount),
        img: node.featuredImage?.url || "",
        imagenes: node.images.edges.map(({ node }) => ({ url: node.url, alt: node.altText })),
        tallas: node.variants.edges.map(({ node }) => ({
            variantId: node.id,
            talla: node.title,
            disponible: node.availableForSale,
        })),
    }));
}