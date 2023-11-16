import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/White_Wolf_Logo.png';
import {Link, NavLink} from '@remix-run/react';
import expand from '../assets/expandIcon.svg';
import search from '../assets/searchIcon.svg';
import account from '../assets/accountIcon.svg';
import cart from '../assets/cartIcon.svg';
import hamburger from '../assets/hamburgerIcon.svg';
import close from '../assets/closeIcon.svg';

export default function Navbar() {
  let [isSidebarOpen, setSidebarOpen] = useState(false);
  let [hasScrolled, setHasScrolled] = useState(false);
  let navbarRef = useRef(null);
  let sidebarRef = useRef(null);

  let toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  let closeSidebar = () => {
    setSidebarOpen(false);
  };

  let handleScroll = () => {
    if (window.scrollY > 0) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  let handleHamburgerClick = (event) => {
    event.stopPropagation();
    toggleSidebar();
  };

  return (
    <div
      ref={navbarRef}
      className={`${styles.navbar_parent_block} ${
        hasScrolled ? styles.navbarScrolled : ''
      }`}
    >
      <div className={styles.logo_block}>
        <Link to="/">
          <img src={logo} />
        </Link>
      </div>
      <div className={styles.optionsBlock}>
        <NavLink
          to="/shop"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {
                  fontWeight: '400',
                  textDecoration: 'none',
                  border: 'none',
                  ':not': {
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                    '.optionsBlock a::after': {
                      content: '',
                      position: 'absolute',
                      left: 0,
                      bottom: '0px',
                      width: 0,
                      height: '0px',
                      backgroundColor: 'yellow',
                      transition: 'width 1s ease',
                    },
                    '&:focus': {
                      textDecoration: 'underline',
                    },
                  },
                }
          }
        >
          Shop Now
        </NavLink>
        <NavLink
          to="/about"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {fontWeight: '400', textDecoration: 'none', border: 'none'}
          }
        >
          About Us
        </NavLink>
        <NavLink
          to="/blogs"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {fontWeight: '400', textDecoration: 'none', border: 'none'}
          }
        >
          Blogs
        </NavLink>
        <div className={styles.productsLinkBlock}>
          <NavLink
            to="/"
            style={({isActive}) =>
              isActive
                ? {
                    fontWeight: '800',
                    borderBottom: '3px solid yellow',
                  }
                : {fontWeight: '400', textDecoration: 'none', border: 'none'}
            }
          >
            Products
          </NavLink>
          <img src={expand} className={styles.expandIcon} />
        </div>
        <NavLink
          to="/"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {fontWeight: '400', textDecoration: 'none', border: 'none'}
          }
        >
          <img src={search} className={styles.optionIcons} />
        </NavLink>
        <NavLink
          to="/account"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {fontWeight: '400', textDecoration: 'none', border: 'none'}
          }
        >
          <img src={account} className={styles.optionIcons} />
        </NavLink>
        <NavLink
          to="/cart"
          style={({isActive}) =>
            isActive
              ? {
                  fontWeight: '800',
                  borderBottom: '3px solid yellow',
                }
              : {fontWeight: '400', textDecoration: 'none', border: 'none'}
          }
        >
          <img src={cart} className={styles.optionIcons} />
        </NavLink>
        <img
          src={hamburger}
          className={styles.hamburgerIcon}
          onClick={handleHamburgerClick}
        />
      </div>
      <div
        ref={sidebarRef}
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.sidebarTopSection}>
          <h2>Menu</h2>
          <img
            onClick={closeSidebar}
            src={close}
            className={styles.closeIcon}
          />
        </div>
        <div className={styles.sidebarOptionsBlock}>
          <NavLink to="/shop">Shop Now</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/blogs">Blogs</NavLink>
          <NavLink to="/">Products</NavLink>
        </div>
      </div>
    </div>
  );
}
