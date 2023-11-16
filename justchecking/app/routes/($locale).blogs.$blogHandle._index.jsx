import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import Navbar from '../components/Navbar';
import CustomFooter from '../components/CustomFooter';
import styles from '../styles/IndividualBlog.module.css';
import {useEffect, useState} from 'react';

export let meta = () => {
  return [{title: `Blogs`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export let loader = async ({params, request, context: {storefront}}) => {
  try {
    let paginationVariables = getPaginationVariables(request, {
      pageBy: 10,
    });

    let {metaobjects} = await storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    });

    return json({metaobjects, params});
  } catch (error) {
    console.error('Loader error:', error);
    throw new Error('Internal Server Error');
  }
};

export default function Blog() {
  let [filteredBlog, setFilteredBlog] = useState({});
  let [showData,setShowData]=useState(false);

  /** @type {LoaderReturnData} */
  let {metaobjects, params} = useLoaderData();
  useEffect(() => {
    let filteredObject = metaobjects.edges.filter((item) => {
      return item.node.handle == params.blogHandle;
    });
    setTimeout(() => {
      setFilteredBlog(filteredObject[0]);
      setShowData(true);
      console.log(filteredObject[0]);
    }, 2000);
  }, [metaobjects, params.blogHandle]);

  return (
    <>
      <Navbar />
      {(filteredBlog && showData) ? (
        <div className={styles.blogParentBlock}>
          <div className={styles.blogImageBlock}>
            {showData && (
              <img src={filteredBlog.node.image.reference.previewImage.url} />
            )}
          </div>
          <div className={styles.blogDetailsBlock}>
            <h1>{filteredBlog.node.title.value}</h1>
            <h5>Uploaded on {filteredBlog.node.posted_date.value}</h5>
            <p className={styles.descriptionPara}>{filteredBlog.node.description.value}</p>
            <div className={styles.personDetailsBlock}>
              <img src={filteredBlog.node.person_image.reference.previewImage.url}/>
              <p>{filteredBlog.node.person_name.value}</p>
            </div>
          </div>
        </div>
      ) : <p className={styles.loadingPara}>Loading...</p>}
      <CustomFooter />
    </>
  );
}

let BLOGS_QUERY = `#graphql
  query MetaObjectForBlog{
    metaobjects(type: "custom_blogs", first: 100) {
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
/** @typedef {import('storefrontapi.generated').ArticleItemFragment} ArticleItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
