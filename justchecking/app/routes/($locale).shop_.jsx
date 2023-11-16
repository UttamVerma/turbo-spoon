import CustomFooter from '~/components/CustomFooter';
import Navbar from '~/components/Navbar';
import styles from '../styles/Shop.module.css';
import {Link} from '@remix-run/react';
import videoDummy from '../assets/videoDummy.mp4';
import star from '../assets/star.png';
import {useEffect, useState} from 'react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {useNavigate} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */

export async function loader({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(
    SHOP_PAGE_COLLECTIONS_QUERY,
    {
      variables: paginationVariables,
    },
  );

  return json({collections});
}

export let meta = () => {
  return [{title: 'Shop'}];
};

export default function Shop() {
  let navigate = useNavigate();
  /** @type {LoaderReturnData} */
  let [productsData, setProductsData] = useState([]);
  let {collections} = useLoaderData();
  useEffect(() => {
    let filteredCollection = collections.nodes.filter((item) => {
      return item.title == 'Shop_Page';
    });
    setProductsData(filteredCollection[0].products.edges);
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.discoverBlock}>
        <div className={styles.discoverHeadingBlock}>
          <h3>Discover</h3>
          <h1>Upgrade Your Grooming</h1>
          <p>
            Explore our wide range of high-quality men's grooming products and
            elevate your grooming routine.
          </p>
          <div className={styles.discoverButtonBlock}>
            <Link to="/products">
              <button>Shop Now</button>
            </Link>
            <Link to="/">
              <button>Learn More</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.productsBlock}>
        <div className={styles.productsHeadingBlock}>
          <h3>Discover</h3>
          <h1>Men's Grooming</h1>
          <p>Explore our wide range of high-quality grooming products.</p>
        </div>
        <div className={styles.productsGridBlock}>
          {productsData.map((item) => {
            return (
              <div
                key={item.node.handle}
                onClick={() => navigate(`/products/${item.node.handle}`)}
              >
                {item.node.variants.edges[0].node.image.url !==
                item.node.images.edges[0].node.url ? (
                  <img src={item.node.variants.edges[0].node.image.url} />
                ) : (
                  <img src={item.node.images.edges[0].node.url} />
                )}
                <h2>{item.node.title}</h2>
                {item.node.variants.edges[0].node.title === 'Default Title' ? (
                  <p>Single Variant Only</p>
                ) : (
                  <p>{item.node.variants.edges[0].node.title}</p>
                )}
                <div className={styles.product_price_block}>
                  <p>
                    {item.node.variants.edges[0].node.priceV2.currencyCode}{' '}
                    {Math.floor(
                      item.node.variants.edges[0].node.priceV2.amount,
                    )}
                  </p>
                  {Math.floor(item.node.variants.edges[0].node.priceV2.amount) <
                  Math.floor(item.node.variants.edges[0].node.compareAtPriceV2.amount) ? (
                    <p>
                      {
                        item.node.variants.edges[0].node.compareAtPriceV2
                          .currencyCode
                      }{' '}
                      {Math.floor(
                        item.node.variants.edges[0].node.compareAtPriceV2
                          .amount,
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <button className={styles.seeAllBtn}>See all</button>
      </div>

      <div className={styles.videoParentBlock}>
        <div className={styles.videoBlock}>
          <video src={videoDummy} />
        </div>
        <div className={styles.videoHeadingBlock}>
          <div className={styles.starsBlock}>
            <img src={star} />
            <img src={star} />
            <img src={star} />
            <img src={star} />
            <img src={star} />
          </div>
          <div className={styles.videoParaBlock}>
            <h2>
              The products from White Wolf have completely transformed my
              grooming routine. I can't recommend them enough.
            </h2>
            <div className={styles.videoPersonDetailsBlock}>
              <div className={styles.videoPersonBlock}>
                <h3>John Doe</h3>
                <p>Marketing Manager, ABC Company</p>
              </div>
              <div>
                <p>WEBFLOW</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.discoverPremiumBlock}>
        <div className={styles.discoverPremiumHeadingBlock}>
          <h1>Discover Our Premium Grooming Products</h1>
          <p>Explore our wide range of high-quality grooming products</p>
        </div>
        <div className={styles.discoverButtonBlock}>
          <Link to="/products">
            <button>Shop</button>
          </Link>
          <Link to="/">
            <button>Learn More</button>
          </Link>
        </div>
      </div>
      <CustomFooter />
    </>
  );
}

let SHOP_PAGE_COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          images(first:1){
            edges{
              node{
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                image {
                  url
                }
                title
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                currencySymbol: metafield(namespace: "global", key: "currency_symbol") {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
