import "../App.css";
import "../components/css/footer.css";
import logo from "../assets/logo.svg";
import facebook from "../assets/icon-facebook.svg";
import twitter from "../assets/icon-twitter.svg";
import pinterest from "../assets/icon-pinterest.svg";
import instagram from "../assets/icon-instagram.svg";

const Footer = () => {
  return (
    <footer className="footer" data-aos="fade-bottom">
      <div className="footer__container container">
        <div className="footer__inner d-flex justify-content-between align-items-center">
          <a className="footer__logo-wrapper" href="#">
            <img className="d-block" src={logo} alt="" />
          </a>

          <ul className="footer__socials d-flex align-items-center list-unstyled p-0 m-0">
            <li className="footer__socials-item">
              <img src={facebook} alt="" />
            </li>
            <li className="footer__socials-item">
              <img src={twitter} alt="" />
            </li>
            <li className="footer__socials-item">
              <img src={pinterest} alt="" />
            </li>
            <li className="footer__socials-item">
              <img src={instagram} alt="" />
            </li>
          </ul>
        </div>

        <div className="footer__inner row g-5 g-md-0">
          <div className="footer__list d-flex flex-column justify-content-start align-items-center justify-content-md-start align-items-md-start col-12 col-sm-6 col-md-3">
            <h5 className="footer__item-tile">OUR COMPANY</h5>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                HOW WE WORK
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                WHY INSURE?
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                VIEW PLANS
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                REVIEWS
              </a>
            </div>
          </div>

          <div className="footer__list d-flex flex-column justify-content-start align-items-center justify-content-md-start align-items-md-start col-12 col-sm-6 col-md-3">
            <h5 className="footer__item-tile">HELP ME</h5>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                FAQ
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                TERMS OF USE
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                PRIVACY POLICY
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                COOKIES
              </a>
            </div>
          </div>

          <div className="footer__list d-flex flex-column justify-content-start align-items-center justify-content-md-start align-items-md-start col-12 col-sm-6 col-md-3">
            <h5 className="footer__item-tile">CONTACT</h5>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                SALES
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                SUPPORT
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                SUPPORT
              </a>
            </div>
          </div>

          <div className="footer__list d-flex flex-column justify-content-start align-items-center justify-content-md-start align-items-md-start col-12 col-sm-6 col-md-3">
            <h5 className="footer__item-tile">OTHERS</h5>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                CAREERS
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                PRESS
              </a>
            </div>
            <div className="footer__item">
              <a
                className="footer__link text-decoration-none text-nowrap"
                href="#">
                LICENSES
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
