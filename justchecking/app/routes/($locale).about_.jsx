import CustomFooter from '~/components/CustomFooter';
import Navbar from '~/components/Navbar';
import styles from '../styles/About.module.css';
import premiumBackground from '../assets/aboutUsPagePremium.png';
import sustainableBackground from '../assets/aboutUsPageSustainable.png';
import discoverBackground from '../assets/aboutUsPageDiscover.png';

export let meta = () => {
  return [{title: 'About Us'}];
};

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div
        className={styles.premium_block}
        style={{backgroundImage: `url(${premiumBackground})`}}
      >
        <div className={styles.premium_heading_block}>
          <h5>Premium</h5>
          <h1>Discover the Difference</h1>
          <p>
            White Wolf is dedicated to providing high-quality grooming products
            for men.
          </p>
          <div>
            <button>Shop</button>
            <button>Learn More</button>
          </div>
        </div>
      </div>
      <div className={styles.careers_block}>
        <h2>Explore Careers</h2>
        <p>Discover open positions and start your journey with us.</p>
        <button>Button</button>
      </div>
      <div className={styles.recognition_block}>
        <div className={styles.recognition_heading_block}>
          <h2>Recognitions and Achievements</h2>
          <p>
            We are proud to have received numerous awards and recognition for
            our exceptional products and services.
          </p>
          <div>
            <button>Learn More</button>
            <button>Sign Up</button>
          </div>
        </div>
        <div className={styles.recognition_grid_block}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={styles.sustainable_block}>
        <div className={styles.sustainable_heading_block}>
          <h5>Sustainable</h5>
          <h1>Our Commitment to Social Responsibility</h1>
          <p>
            At White Wolf, we believe in making a positive impact on the world.
            That's why we are committed to social responsibility and
            sustainability initiatives.
          </p>
          <div className={styles.sustainable_grid_block}>
            <div className={styles.sustainable_grid_card}>
              <h3>Social Impact</h3>
              <p>
                We strive to create products that are ethically sourced and
                environmentally friendly.
              </p>
            </div>
            <div className={styles.sustainable_grid_card}>
              <h3>Sustainable Practices</h3>
              <p>
                From packaging to production, we prioritize sustainability every
                step of the way.
              </p>
            </div>
          </div>
          <div className={styles.sustainable_btn_block}>
            <button>Learn More</button>
            <button>Sign Up</button>
          </div>
        </div>
        <div className={styles.sustainable_image_block}>
          <img src={sustainableBackground} />
        </div>
      </div>
      <div
        className={styles.discover_block}
        style={{backgroundImage: `url(${discoverBackground})`}}
      >
        <div className={styles.premium_heading_block}>
          <h1>Discover Our Company's Story</h1>
          <p>
            We are a company passionate about providing high-quality men
            grooming products.
          </p>
          <div>
            <button>Learn More</button>
            <button>Sign Up</button>
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
}
