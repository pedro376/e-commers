import { createStorefrontApiClient } from '@shopify/storefront-api-client';

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function mapearCategoria(tipoProducto) {
  const texto = (tipoProducto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (texto.includes("club")) return "club";
  if (texto.includes("retro")) return "retro";
  return "seleccion";
}

// Lee el ajuste del producto desde sus tags: ajuste-suelto, ajuste-normal,
// ajuste-ajustado. Si no se etiquetó ninguno, se asume "normal" por defecto.
function extraerAjuste(tags) {
  if (!tags) return "normal";
  if (tags.includes("ajuste-suelto")) return "suelto";
  if (tags.includes("ajuste-ajustado")) return "ajustado";
  return "normal";
}

export const shopifyClient = createStorefrontApiClient({
    storeDomain: import.meta.env.VITE_SHOPIFY_DOMAIN,
    apiVersion: '2025-10',
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
                        productType
                        tags
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

    return data.products.edges.map(({ node }) => ({
        id: node.id,
        nombre: node.title,
        categoria: mapearCategoria(node.productType),
        descripcion: node.description,
        enPromo3x2: node.tags?.includes("promo3x2") || false,
        ajuste: extraerAjuste(node.tags),
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

/**
 * Crea un carrito "espejo" en Shopify con los items actuales y regresa
 * el total YA con descuentos automáticos aplicados (como el 3x2),
 * más el detalle de cuánto se descontó por cada línea (variante).
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
                attributes { key value }
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
    attributes: item.ajuste
      ? [{ key: "Ajuste", value: capitalizar(item.ajuste) }]
      : [],
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
    attributes: item.ajuste
      ? [{ key: "Ajuste", value: capitalizar(item.ajuste) }]
      : [],
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

// Registra el correo como cliente/lead en Shopify (usado por el popup de bienvenida)
export async function suscribirCorreo(email) {
  const mutation = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email }
        customerUserErrors { field message }
      }
    }
  `;

  const passwordTemporal =
    Math.random().toString(36).slice(-10) + "Aa1!";

  const { data } = await shopifyClient.request(mutation, {
    variables: {
      input: {
        email,
        password: passwordTemporal,
        acceptsMarketing: true,
      },
    },
  });

  const errores = data?.customerCreate?.customerUserErrors;
  if (errores?.length > 0) {
    const mensaje = errores[0].message.toLowerCase();
    const yaExiste = mensaje.includes("taken");
    const necesitaVerificar = mensaje.includes("verify your email");
    if (!yaExiste && !necesitaVerificar) {
      throw new Error(errores[0].message);
    }
  }

  return true;
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
                            productType
                            tags
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
        categoria: mapearCategoria(node.productType),
        descripcion: node.description,
        enPromo3x2: node.tags?.includes("promo3x2") || false,
        ajuste: extraerAjuste(node.tags),
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