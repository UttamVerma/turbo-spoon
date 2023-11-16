import {Suspense, useState, useEffect, useRef} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, useNavigate} from '@remix-run/react';
import styles from '../styles/IndividualProduct.module.css';
import background from '../assets/productDetailsBackground.png';
import bestSellingBackground from '../assets/productDetailsBestSelling.png';
import product1 from '../assets/productImg1.png';
import product2 from '../assets/productImg2.png';
import product3 from '../assets/productImg3.png';

import {
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/utils';
import Navbar from '~/components/Navbar';
import CustomFooter from '~/components/CustomFooter';

/**
 * @type {MetaFunction<typeof loader>}
 */
export let meta = ({data}) => {
  return [{title: `${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  let {handle} = params;
  let {storefront} = context;

  let selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  let {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  let firstVariant = product.variants.nodes[0];
  let firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }
  let variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  let allProductsPromise = storefront.query(ALL_PRODUCTS_QUERY);
  let allProducts = await allProductsPromise;

  return defer({product, variants, allProducts});
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  let url = new URL(request.url);
  let firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  /** @type {LoaderReturnData} */
  let {product, variants, allProducts} = useLoaderData();
  let {selectedVariant} = product;
  let [selectedImage, setSelectedImage] = useState(selectedVariant.image.url);

  let handleVariantChange = (variant) => {
    setSelectedImage(variant.image.url);
  };
  return (
    <>
      <Navbar />
      <div className={styles.product_parent_block}>
        <div
          className={
            product.variants.nodes[0].title == 'Default Title'
              ? styles.product_images_grid_block
              : styles.product_images_single_block
          }
        >
          {product.variants.nodes[0].title == 'Default Title'
            ? product.images.edges.map((item) => {
                return <img key={item.node.id} src={item.node.url} />;
              })
            : selectedImage && (
                <img src={selectedImage} alt="Selected Variant" />
              )}
        </div>
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          onVariantChange={(variant) => {
            onVariantChange(variant);
            handleVariantChange(variant);
          }}
        />
      </div>
      <PremiumBlock />
      <ProductQuestionsBlock />
      <BestSellingProducts />
      <FeaturedCollection
        products={allProducts.products}
        removeProduct={product.title}
      />
      <FAQ />
      <CustomFooter />
    </>
  );
}

/**
 * @param {{image: ProductVariantFragment['image']}}
 */

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({selectedVariant, product, variants}) {
  let {title, descriptionHtml} = product;
  let [isFixed, setIsFixed] = useState(false);
  let productMainRef = useRef(null);
  let shouldApplyFixedStyles =
    product.selectedVariant.selectedOptions[0].value == 'Default Title';
  useEffect(() => {
    let scrollThreshold =
      document.body.scrollHeight * (window.innerWidth < 920 ? 0.1 : 0.2);
    let handleScroll = () => {
      let scrollPosition = window.scrollY;

      if (productMainRef.current) {
        let productMainOffset = productMainRef.current.offsetTop;
        if (window.innerWidth >= 700) {
          setIsFixed(
            scrollPosition > productMainOffset - 100 &&
              window.innerWidth >= 700,
          );
        }

        if (scrollPosition >= scrollThreshold && window.innerWidth >= 700) {
          productMainRef.current.style.transform = `translateY(${
            scrollThreshold - scrollPosition
          }px)`;
        } else {
          productMainRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div
      id="product-main"
      ref={productMainRef}
      className={`${styles.product_details_block} ${
        shouldApplyFixedStyles ? (isFixed ? styles.fixed : '') : ''
      }`}
    >
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <br />
      <p className={styles.detailsPara}>Details</p>
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
    </div>
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({selectedVariant}) {
  return (
    <div className={styles.product_price_block}>
      <div>
        <p>
          {selectedVariant.price.currencyCode} {selectedVariant.price.amount}
        </p>
        {Math.floor(selectedVariant.compareAtPrice.amount) >
        Math.floor(selectedVariant.price.amount) ? (
          <p>
            {selectedVariant.compareAtPrice.currencyCode}{' '}
            {selectedVariant.compareAtPrice.amount}
          </p>
        ) : (
          <p>null</p>
        )}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({product, selectedVariant, variants}) {
  let [showAddedToCartText, setShowAddedToCartText] = useState(false);
  return (
    <div className={styles.product_form}>
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      {showAddedToCartText ? (
        <p className={styles.addedCartText}>
          Product Added To Cart {'->'} <Link to="/cart">Move To Cart</Link>
        </p>
      ) : null}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          setShowAddedToCartText(true);
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h2 className={styles.optionName}>{option.name}</h2>
      <div className={styles.optionsGridBlock}>
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                textDecoration: isActive ? 'underline' : 'none',
                opacity: isAvailable ? 1 : 0.3,
              }}
              onClick={()=> setTimeout(() => {
                window.location.reload();
              }, 300)}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            className={styles.addCartBtn}
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function PremiumBlock() {
  return (
    <div
      className={styles.premium_parent_block}
      style={{backgroundImage: `url(${background})`}}
    >
      <div className={styles.premium_heading_block}>
        <h4>Premium</h4>
        <h1>Experience the Ultimate Grooming Solution for Men</h1>
        <p>
          Our Men Grooming products are designed to provide exceptional results,
          leaving you looking and feeling your best. With high-quality
          ingredients and innovative formulations, our products deliver superior
          performance and unmatched satisfaction.
        </p>
        <ul>
          <li>Revitalize your skin with our nourishing face wash.</li>
          <li>
            Achieve a smooth and comfortable shave with our shaving cream.
          </li>
          <li>Style your hair effortlessly with our versatile hair gel.</li>
        </ul>
        <div className={styles.premium_btn_block}>
          <button>Buy Now</button>
          <button>Learn More</button>
        </div>
      </div>
    </div>
  );
}

function ProductQuestionsBlock() {
  return (
    <div className={styles.productQuestionsBlock}>
      <div>
        <h1>Discover How Our Product Works</h1>
        <p>
          Our product is designed to simplify your grooming routine and enhance
          your overall appearance.
        </p>
        <div className={styles.productQuestionBtnBlock}>
          <button>Learn More</button>
          <button>Sign Up</button>
        </div>
      </div>
      <div>
        <h1>Experience the Benefits of Our Product</h1>
        <p>
          Our product is formulated with high-quality ingredients to deliver
          exceptional results.
        </p>
        <div className={styles.productQuestionBtnBlock}>
          <button>Learn More</button>
          <button>Sign Up</button>
        </div>
      </div>
      <div>
        <h1>Achieve Your Grooming Goals with Our Product</h1>
        <p>
          Our product is designed to help you look and feel your best every day.
        </p>
        <div className={styles.productQuestionBtnBlock}>
          <button>Learn More</button>
          <button>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

function BestSellingProducts() {
  return (
    <div
      className={styles.bestSellingParentBlock}
      style={{backgroundImage: `url(${bestSellingBackground})`}}
    >
      <div className={styles.bestSellingHeadingBlock}>
        <h1>Discover Our Best Selling Product</h1>
        <p>
          Experience the ultimate grooming solution for men with our
          high-quality products.
        </p>
        <div>
          <button>Buy</button>
          <button>Learn More</button>
        </div>
      </div>
    </div>
  );
}

function FeaturedCollection({products, removeProduct}) {
  let navigate = useNavigate();
  let featuredCollection = [];
  for (let i = 0; i < products.edges.length; i++) {
    if (removeProduct !== products.edges[i].node.title) {
      featuredCollection.push(products.edges[i].node);
    }
  }
  let firstEightProducts = featuredCollection.slice(0, 8);
  return (
    <div className={styles.featuredCollectionBlock}>
      <div className={styles.featuredCollectionHeadingBlock}>
        <h4>Discover</h4>
        <h1>Featured Products</h1>
        <p>Explore our wide range of high-quality grooming products for men.</p>
      </div>
      <div className={styles.featuredCollectionGridBlock}>
        {firstEightProducts?.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/products/${item.handle}`)}
            >
              <img src={item.images.edges[0].node.src} />
              <div>
                <h3>{item.title}</h3>
                <h3>
                  {item.variants.edges[0].node.priceV2.currencyCode}{' '}
                  {Math.floor(item.variants.edges[0].node.priceV2.amount)}
                </h3>
              </div>
              <button>Buy Now</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div className={styles.faq_parent_block}>
      <img src={product1} className={styles.product1} />
      <img src={product2} className={styles.product2} />
      <img src={product3} className={styles.product3} />
      <div className={styles.faq_heading_block}>
        <h1>FAQs</h1>
        <p>Find answers to commonly asked questions about the product.</p>
      </div>
      <div className={styles.faq_questions_answers_block}>
        <div>
          <h4>What are the ingredients?</h4>
          <p>
            Our product contains natural ingredients that are carefully selected
            to provide the best results for mens grooming needs.
          </p>
        </div>
        <div>
          <h4>Is it suitable for all skin types?</h4>
          <p>
            Yes, our product is suitable for all skin types, including sensitive
            skin.
          </p>
        </div>
        <div>
          <h4>How often should I use it?</h4>
          <p>
            For best results, use our product daily as part of your grooming
            routine.
          </p>
        </div>
        <div>
          <h4>Is it cruelty free?</h4>
          <p>
            Yes, we are proud to say that our product is cruelty free and not
            tested on animals.
          </p>
        </div>
        <div>
          <h4>Can women use it too?</h4>
          <p>
            While our product is designed for men, women can also use it if they
            find it suitable for their needs.
          </p>
        </div>
      </div>
      <div className={styles.stillBlock}>
        <h1>Still have questions?</h1>
        <p>Feel free to reach out to us.</p>
        <button>Contact Us</button>
      </div>
    </div>
  );
}

let PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

let PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images (first: 5) {
      edges {
        node {
          id
          url
        }
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

let PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

let PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

let VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

let ALL_PRODUCTS_QUERY = `#graphql
query GetAllProducts {
  products(first: 10) {
    edges {
      node {
        id
        title
        description
        handle
        images(first: 1) {
          edges {
            node {
              id
              src
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
