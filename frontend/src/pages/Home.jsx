import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to WebnApp</h1>
        <p>
          A modern full-stack web application built with passion, performance,
          and premium UI design.
        </p>
      </section>

      {/* About WebnApp */}
      <section className="about-section">
        <h2>About WebnApp</h2>
        <p>
          WebnApp is a secure and scalable full-stack web platform built using
          React, Node.js, MongoDB, and Razorpay integration. It demonstrates
          authentication, payment integration, product management, and a premium
          dark UI experience.
        </p>

        <p>
          This project showcases modern development practices including: JWT
          Authentication, Protected Routes, Payment Gateway Integration, REST
          APIs, and Responsive UI Design.
        </p>
      </section>

      {/* About Developer */}
      <section className="developer-section">
        <h2>About the Developer</h2>
        <p>
          WebnApp was designed and developed by <strong>Nikhil</strong>, a
          passionate full-stack developer focused on building modern, secure,
          and scalable web applications.
        </p>

        <p>
          With strong knowledge in React, Node.js, MongoDB, and real-world
          backend architecture, Nikhil aims to create production-ready
          applications with clean design and optimized performance.
        </p>
        <p className="signature">Crafted with dedication by Nikhil</p>
      </section>
    </div>
  );
}

export default Home;
