import "../App.css";
import "../components/css/cta.css"
const Cta = () => {
  return (
      <section className="cta">
          <div className="cta__container container d-flex flex-column text-center text-md-start flex-md-row justify-content-between align-items-center">
              <h1 className="cta__heading mb-4 mb-md-0">
                  Find out more  about how we work
              </h1>
              <a className="button button-white cta__link text-nowrap" href="#">
                  HOW WE WORK
              </a>
          </div>
      </section>
  )
}

export default Cta;