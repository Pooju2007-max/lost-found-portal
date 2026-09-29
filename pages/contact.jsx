function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Contact Us</h1>

        <p>
          Have a question or need help with a lost or found item?
          Get in touch with us.
        </p>
      </div>

      <div className="contact-container">

        <div className="contact-card">
          <div className="contact-icon">📧</div>

          <h3>Email</h3>

          <p>
            support@lostandfound.com
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">📞</div>

          <h3>Phone</h3>

          <p>
            +91 98765 43210
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-icon">📍</div>

          <h3>Location</h3>

          <p>
            College Campus
          </p>
        </div>

      </div>

      <div className="contact-message">

        <h2>We're Here to Help</h2>

        <p>
          If you have found an item or lost something,
          please use our dashboard to report it.
        </p>

      </div>

    </div>
  );
}

export default Contact;