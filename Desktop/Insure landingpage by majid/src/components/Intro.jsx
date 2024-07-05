import "../App.css";
import "../components/css/Intro.css";
import imageIntro from "../assets/image-intro-desktop.jpg";

export default function Intro() {
  return (
    <section className="intro">
      <div className="intro__container container row d-flex justify-content-between flex-lg-row">
        <div
          className="intro__inner intro__about col-12 col-lg-6"
          data-aos="fade-left">
          <h1 className="intro__heading">Humanizing your insurance.</h1>
          <p className="intro__info">
            Get your life insurance coverage easier and faster. We blend our
            expertise andtechnology to help you find the plan that is right for
            you. Ensure you and your loved ones are protected.
          </p>
          <a className="button button-white" href="#">
            VIEW PLANS
          </a>
        </div>

        <div
          className="intro__inner intro__image-wrapper  col-12 col-lg-6"
          data-aos="fade-right">
          <img className="intro__image" src={imageIntro} alt="" />
        </div>
      </div>
    </section>
  );
}
