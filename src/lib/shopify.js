import { createStorefrontApiClient } from '@shopify/storefront-api-client';

function mapearCategoria(tipoProducto) {
  const texto = (tipoProducto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (texto.includes("club")) return "club";
  if (texto.includes("retro")) return "retro";
  return "seleccion";
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
                            productType
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