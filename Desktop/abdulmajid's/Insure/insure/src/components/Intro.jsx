import "../App.css";
import "../components/css/Intro.css"
import imageIntro from "../assets/image-intro-desktop.jpg";
import ("../assets/")

export default function Intro() {
  return (
    <section className="intro">
      <div className="intro__container container row flex-lg-row flex-column-reverse">
        <div className="intro__inner col-12 col-lg-6">
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

        <div className="intro__inner col-12 col-lg-6">
          <img className="intro__image" src={imageIntro} alt="" />
        </div>
      </div>
    </section>
  );
}
