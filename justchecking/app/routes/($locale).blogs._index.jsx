import {json} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import styles from '../styles/Blogs.module.css';
import Navbar from '~/components/Navbar';
import CustomFooter from '~/components/CustomFooter';
import {useState, useEffect} from 'react';

/**
 * @type {MetaFunction}
 */
export let meta = () => {
  return [{title: Blogs}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export let loader = async ({request, context: {storefront}}) => {
  let paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  let {metaobjects} = await storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return json({metaobjects});
};

export default function Blogs() {
  let navigate = useNavigate();
  /** @type {LoaderReturnData} */
  let {metaobjects} = useLoaderData();
  let [showMetaObjectsData, setShowMetaObjectsData] = useState(false);
  useEffect(() => {
    if (metaobjects) {
      setShowMetaObjectsData(true);
    }
  }, [metaobjects]);
  let [showAnswer1, setShowAnswer1] = useState(false);
  let [showAnswer2, setShowAnswer2] = useState(false);
  let [showAnswer3, setShowAnswer3] = useState(false);
  let [showAnswer4, setShowAnswer4] = useState(false);
  let [showAnswer5, setShowAnswer5] = useState(false);

  return (
    <>
      <Navbar />
      <div className={styles.blogsParentBlock}>
        <div className={styles.blogHeadingBlock}>
          <h2>Latest</h2>
          <h1>Discover the Best Grooming Tips</h1>
          <p>Stay updated with our latest blog posts.</p>
        </div>
        <div className={styles.blogs_grid_block}>
          {showMetaObjectsData &&
            metaobjects.edges.map((item) => {
              return (
                <div
                  key={item.node.id}
                  onClick={() => navigate(`/blogs/${item.node.handle}`)}
                >
                  {item.node.image && (
                    <img
                      src={item.node.image.reference.previewImage.url}
                      className={styles.blogImage}
                    />
                  )}
                  <h4>{item.node.category.value}</h4>
                  <h2>{item.node.title.value}</h2>
                  <p>{item.node.description.value}</p>
                  <div className={styles.person_details_block}>
                    {item.node.person_image && (
                      <img
                        src={item.node.person_image.reference.previewImage.url}
                        className={styles.personImage}
                      />
                    )}
                    <div>
                      <h3>{item.node.person_name.value}</h3>
                      <p>{item.node.posted_date.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.blogHeadingBlock}>
          <h2>Latest</h2>
          <h1>Discover New Blog Posts</h1>
          <p>Stay updated with our latest blog posts.</p>
        </div>
        <div className={styles.blogs_grid_block}>
          {showMetaObjectsData &&
            metaobjects.edges.map((item) => {
              return (
                <div
                  key={item.node.id}
                  onClick={() => navigate(`/blogs/${item.node.handle}`)}
                >
                  {item.node.image && (
                    <img
                      src={item.node.image.reference.previewImage.url}
                      className={styles.blogImage}
                    />
                  )}
                  <h4>{item.node.category.value}</h4>
                  <h2>{item.node.title.value}</h2>
                  <p>{item.node.description.value}</p>
                  <div className={styles.person_details_block}>
                    {item.node.person_image && (
                      <img
                        src={item.node.person_image.reference.previewImage.url}
                        className={styles.personImage}
                      />
                    )}
                    <div>
                      <h3>{item.node.person_name.value}</h3>
                      <p>{item.node.posted_date.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.newsLetterBlock}>
          <div className={styles.newLetterHeadingBlock}>
            <h1>Stay Updated with Our Newsletter</h1>
          </div>
          <div className={styles.newsLetterInputBlock}>
            <p>Get the latest updates and exclusive offers.</p>
            <div>
              <input placeholder="Enter your email" />
              <button>Submit</button>
            </div>
            <p>By subscribing, you agree to our Terms and Conditions.</p>
          </div>
        </div>
        <div className={styles.faq_parent_block}>
          <h1>FAQs</h1>
          <p>
            Find answers to commonly asked questions about our products and
            services.
          </p>
          <div className={styles.faq_question_parent_block}>
            <div className={styles.faq_question_block}>
              <div onClick={() => setShowAnswer1(!showAnswer1)}>
                <p>Question 1</p>
                <p>+</p>
              </div>
              {showAnswer1 ? (
                <p className={styles.answer_Para}>Answer 1</p>
              ) : null}
            </div>
            <div className={styles.faq_question_block}>
              <div onClick={() => setShowAnswer2(!showAnswer2)}>
                <p>Question 2</p>
                <p>+</p>
              </div>
              {showAnswer2 ? (
                <p className={styles.answer_Para}>Answer 2</p>
              ) : null}
            </div>
            <div className={styles.faq_question_block}>
              <div onClick={() => setShowAnswer3(!showAnswer3)}>
                <p>Question 3</p>
                <p>+</p>
              </div>
              {showAnswer3 ? (
                <p className={styles.answer_Para}>Answer 3</p>
              ) : null}
            </div>
            <div className={styles.faq_question_block}>
              <div onClick={() => setShowAnswer4(!showAnswer4)}>
                <p>Question 4</p>
                <p>+</p>
              </div>
              {showAnswer4 ? (
                <p className={styles.answer_Para}>Answer 4</p>
              ) : null}
            </div>
            <div className={styles.faq_question_block}>
              <div onClick={() => setShowAnswer5(!showAnswer5)}>
                <p>Question 5</p>
                <p>+</p>
              </div>
              {showAnswer5 ? (
                <p className={styles.answer_Para}>Answer 5</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.stillBlock}>
          <h1>Still have Questions ?</h1>
          <p>Contact our customer support team for assistance.</p>
          <button>Send</button>
        </div>
      </div>
      <CustomFooter />
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog

let BLOGS_QUERY = `#graphql
  query MetaObject{
    metaobjects(type: "custom_blogs", first: 10) {
      edges {
        node {
          id
          type
          handle
          title: field(key: "Title") {
            value
          }
          category: field(key: "Category") {
            value
          }
          description: field(key: "Description") {
            value
          }
          image: field(key: "Image") {
            reference {
              ... on MediaImage {
                previewImage {
                  url
                }
              }
            }
          }
          person_image: field(key: "Person_Image") {
            reference {
              ... on MediaImage {
                previewImage {
                  url
                }
              }
            }
          }
          person_name: field(key: "Person_Name") {
            value
          }
          posted_date: field(key: "Posted_Date") {
            value
          }
        }
      }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */