import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_DOMAIN,
  apiVersion: '2024-10',
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

// Trae productos de una colección específica (ej: "seleccion-mexicana")
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
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                  }
                }
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
    precio: parseFloat(node.priceRange.minVariantPrice.amount),
    img: node.featuredImage?.url || '',
    tallas: node.variants.edges.map((v) => ({
      variantId: v.node.id,
      talla: v.node.title,
      disponible: v.node.availableForSale,
    })),
  }));
}