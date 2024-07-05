import { useState } from "react";
import "../App.css";
import "../components/css/Header.css";
import logo from "../assets/logo.svg";
import hamburger from "../assets/icon-hamburger.svg";
import close from "../assets/icon-close.svg";
import "bootstrap/dist/css/bootstrap.css";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="header" data-aos="fade-top">
        <div className="header-container container pt-4 pb-5">
          <a className="logo-link" href="index.html">
            <img
              className="header-logo logo d-block"
              src={logo}
              width="128"
              height="47"
              alt="logo"
            />
          </a>

          <nav className="header-nav site-nav">
            <ul className="header-nav__list site-nav__list">
              <li className="header-nav__item site-nav__item">
                <a className="header-nav__link site-nav__link" href="#">
                  HOW WE WORK
                </a>
              </li>
              <li className="header-nav__item site-nav__item">
                <a className="header-nav__link site-nav__link" href="#">
                  BLOG
                </a>
              </li>
              <li className="header-nav__item site-nav__item">
                <a className="header-nav__link site-nav__link" href="#">
                  ACCOUNT
                </a>
              </li>
            </ul>
          </nav>

          <a className="button d-none d-lg-block" href="#">
            VIEW PLANS
          </a>

          <button
            className="header__menu-toggler"
            type="button"
            onClick={toggleMobileMenu}>
            <img
              className="burger-icon"
              src={hamburger}
              width="37"
              height="27"
              alt="toggle menu"
            />
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <button className="mobile-menu__close-btn" onClick={toggleMobileMenu}>
          <img
            className="close-btn-icon"
            src={close}
            width="11"
            height="11"
            alt="x"
          />
        </button>

        <div className="mobile-menu__body">
          <nav className="mobile-menu-nav">
            <ul className="mobile-menu__list mt-5 mb-5">
              <li className="mobile-menu__item">
                <a className="mobile-menu__link" href="#">
                  HOW WE WORK
                </a>
              </li>
              <li className="mobile-menu__item">
                <a className="mobile-menu__link" href="#">
                  BLOG
                </a>
              </li>
              <li className="mobile-menu__item">
                <a className="mobile-menu__link" href="#">
                  ACCOUNT
                </a>
              </li>
            </ul>

            <a className="button button-white" href="#">
              VIEW PLANS
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
