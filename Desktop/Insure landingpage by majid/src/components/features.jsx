import "../App.css";
import snappy from "../assets/icon-snappy-process.svg";
import affordable from "../assets/icon-affordable-prices.svg";
import people from "../assets/icon-people-first.svg";
import "../components/css/features.css";

const Features = () => {
  return (
    <section className="features">
      <div className="container features__container">
        <h1 className="features__heading text-center text-md-start mb-5">
          We’re different
        </h1>

        <ul className="features__list list-unstyled p-0 row justify-content-center align-items-center">
          <li className="features__item col-md-4" data-aos="fade-left">
            <img
              className="features__item-icon d-block mb-3"
              src={snappy}
              alt=""
            />

            <h2 className="features__item-title text-nowrap">Snappy Process</h2>
            <p className="features__item-info">
              Our application process can be completedn’t get stuck filling in
              tedious forms.
            </p>
          </li>
          <li className="features__item col-md-4">
            <img
              className="features__item-icon d-block mb-3"
              src={affordable}
              alt=""
            />

            <h2 className="features__item-title text-nowrap">
              Affordable Prices
            </h2>
            <p className="features__item-info">
              We don’t want you worrying about highe low but we still offer the
              best coverage possible.
            </p>
          </li>
          <li className="features__item col-md-4" data-aos="fade-right">
            <img
              className="features__item-icon d-block mb-3"
              src={people}
              alt=""
            />

            <h2 className="features__item-title text-nowrap">People First</h2>
            <p className="features__item-info">
              Our plans aren’t full of conditions. We make sure you’re covered
              when you need it.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Features;
