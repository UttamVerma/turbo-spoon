import styles from '../styles/CustomFooter.module.css';
import logo from '../assets/White_Wolf_Logo.png';
import threads from '../assets/threadsIcon.png';
import facebook from '../assets/facebookIcon.png';
import instagram from '../assets/instagramIcon.png';
import {Link} from '@remix-run/react';

export default function CustomFooter() {
  return (
    <div className={styles.footer_block}>
      <div className={styles.subscription_block}>
        <div className={styles.offer_block}>
          <h3>Get Exclusive Offers</h3>
          <p>Sign up for our newsletter to recieve updates and promotions</p>
        </div>
        <div className={styles.input_block}>
          <div className={styles.nested_input_block}>
            <input placeholder="Placeholder" />
            <button>Button</button>
          </div>
          <p>
            By subscribing, you agree to our Privacy Policy{' '}
            <Link href="/">Privacy Policy</Link>
          </p>
        </div>
      </div>
      <div className={styles.links_grid_block}>
        <div className={styles.links_block}>
          <Link to="/">
            <img
              src={logo}
              loading="eager"
              alt="White Wolf Logo"
              className="logo_image"
            />
          </Link>
        </div>
        <div className={styles.links_block}>
          <h3>About Us</h3>
          <Link href="/">Contact</Link>
          <Link href="/">FAQ</Link>
          <Link href="/">Returns</Link>
          <Link href="/">Shipping</Link>
          <Link href="/">Block</Link>
        </div>
        <div className={styles.links_block}>
          <h3>Customer</h3>
          <Link href="/">Track</Link>
          <Link href="/">Order</Link>
          <Link href="/">Account</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Terms</Link>
        </div>
        <div className={styles.links_block}>
          <h3>Cookies</h3>
          <Link href="/">Sitemap</Link>
          <Link href="/">Career</Link>
          <Link href="/">Press</Link>
          <Link href="/">Affiliate</Link>
          <Link href="/">Wholesale</Link>
        </div>
        <div className={styles.links_block}>
          <h3>Returns</h3>
          <Link href="/">Shipping</Link>
          <Link href="/">Contact</Link>
          <Link href="/">FAQ</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Terms</Link>
        </div>
        <div className={styles.links_block}>
          <h3>Cookies</h3>
          <Link href="/">Sitemap</Link>
          <Link href="/">Career</Link>
          <Link href="/">Press</Link>
          <Link href="/">Affiliate</Link>
          <Link href="/">Wholesale</Link>
        </div>
      </div>
      <div className={styles.hr_block}></div>
      <div className={styles.info_block}>
        <div className={styles.policy_block}>
          <p>@2023 White Wolf. All rights reserved</p>
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Terms of Service</Link>
          <Link href="/">Cookies Settings</Link>
        </div>
        <div className={styles.social_media_block}>
          <a href="/" target="_blank">
            <img src={facebook} loading="eager" />
          </a>
          <a href="/" target="_blank">
            <img src={instagram} loading="eager" />
          </a>
          <a href="/" target="_blank">
            <img src={threads} loading="eager" />
          </a>
        </div>
      </div>
    </div>
  );
}
