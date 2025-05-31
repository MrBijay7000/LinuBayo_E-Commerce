import "./AboutPage.css";

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About Us</h1>
        <p className="about-intro">
          Welcome to <span className="brand-name">LINUBAYO</span> — where
          fashion meets confidence.
        </p>

        <div className="about-text">
          <p>
            We specialize in trendy, comfortable, and affordable women's wear.
            Our pieces are designed to empower women to look and feel their
            best.
          </p>
          <p>
            Born from a love of fashion and a desire to inspire, our brand is
            built on values of quality, creativity, and self-expression.
          </p>
          <p>
            From everyday essentials to show-stopping styles, we’ve got you
            covered for every mood, moment, and milestone.
          </p>
        </div>

        <div className="about-thanks">
          <h2>Thank you for supporting us!</h2>
          <p>- The LinuBayo Team 💖</p>
        </div>
      </div>
    </div>
  );
}
