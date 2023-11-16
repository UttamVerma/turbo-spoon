import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import Navbar from '~/components/Navbar';
import styles from '../styles/homepage.module.css';
import CustomFooter from '~/components/CustomFooter';

/**
 * @type {MetaFunction}
 */
export let meta = () => {
  return [{title: 'White Wolf'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  let {storefront} = context;
  // let {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // let featuredCollection = collections.nodes[0];
  // let recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return 'hello';
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  let data = useLoaderData();
  return (
    <div className="home">
      <Navbar />
      <div className={styles.discoverBlock}>
        <div className={styles.discoverHeadingBlock}>
          <h1>Discover the Best Mens Grooming Products</h1>
          <p>
            Experience the ultimate grooming solutions for men, crafted with
            precision and care.
          </p>
        </div>
      </div>
      <div className={styles.revolutionaryBlock}>
        <div className={styles.revolutionaryHeadingBlock}>
          <h5>Revolutionary</h5>
          <h1>Discover the Power of Our Grooming Products</h1>
          <p>
            Experience the ultimate grooming experience with our high-quality
            products. Our carefully crafted formulas will leave you feeling
            confident and refreshed.
          </p>
        </div>
        <div className={styles.revolutionaryListBlock}>
          <p>Enhance your appearance with our premium grooming essentials.</p>
          <p>Achieve a polished look with our top-rated grooming products.</p>
          <p>
            Take your grooming routine to the next level with our innovative
            products.
          </p>
        </div>
      </div>
      <CustomFooter />
      {/* <img src={blue_bird} /> */}
      {/* <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

// /**
//  * @param {{
//  *   collection: FeaturedCollectionFragment;
//  * }}
//  */
// function FeaturedCollection({collection}) {
//   if (!collection) return null;
//   let image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

// /**
//  * @param {{
//  *   products: Promise<RecommendedProductsQuery>;
//  * }}
//  */
// function RecommendedProducts({products}) {
//   return (
//     <div className="recommended-products">
//       <h2>Recommended Products</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {({products}) => (
//             <div className="recommended-products-grid">
//               {products.nodes.map((product) => (
//                 <Link
//                   key={product.id}
//                   className="recommended-product"
//                   to={`/products/${product.handle}`}
//                 >
//                   <Image
//                     data={product.images.nodes[0]}
//                     aspectRatio="1/1"
//                     sizes="(min-width: 45em) 20vw, 50vw"
//                   />
//                   <h4>{product.title}</h4>
//                   <small>
//                     <Money data={product.priceRange.minVariantPrice} />
//                   </small>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

let FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

let RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
// /** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
// /** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
