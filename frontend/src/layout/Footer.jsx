function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={styles.footer}>
      {/* BACK TO TOP */}
      <div style={styles.backToTop} onClick={scrollToTop}>
        Back to top
      </div>

      {/* MAIN FOOTER LINKS */}
      <div style={styles.topSection}>
        <div>
          <h4 style={styles.heading}>Get to Know Us</h4>
          <p>About WebnApp</p>
          <p>Careers</p>
          <p>Press Releases</p>
          <p>Our Technology</p>
        </div>

        <div>
          <h4 style={styles.heading}>Connect with Us</h4>
          <p>Instagram</p>
          <p>LinkedIn</p>
          <p>GitHub</p>
        </div>

        <div>
          <h4 style={styles.heading}>Make Money with Us</h4>
          <p>Sell on WebnApp</p>
          <p>Affiliate Program</p>
          <p>Advertise Products</p>
          <p>Business Solutions</p>
        </div>

        <div>
          <h4 style={styles.heading}>Let Us Help You</h4>
          <p>Your Account</p>
          <p>Returns Centre</p>
          <p>Shipping Information</p>
          <p>Help</p>
        </div>
      </div>

      {/* BRAND SECTION */}
      <div style={styles.middleSection}>
        <h2 style={{ margin: 0 }}>WebnApp</h2>

        <div style={styles.selectorRow}>
          <button style={styles.selectorBtn}>🌐 English</button>
          <button style={styles.selectorBtn}>🇮🇳 India</button>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div style={styles.bottomSection}>
        <div>
          <strong>WebnApp Prime</strong>
          <p>Premium Membership</p>
        </div>

        <div>
          <strong>WebnApp Business</strong>
          <p>Solutions for Enterprises</p>
        </div>

        <div>
          <strong>WebnApp Music</strong>
          <p>Stream 10M+ Songs</p>
        </div>

        <div>
          <strong>WebnApp Cloud</strong>
          <p>Scalable Cloud Services</p>
        </div>
      </div>

      <div style={styles.copyright}>
        © {new Date().getFullYear()} WebnApp. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "100px",
    background: "#131a22",
    color: "#ddd",
    fontSize: "14px",
  },

  backToTop: {
    background: "#232f3e",
    textAlign: "center",
    padding: "15px",
    cursor: "pointer",
    fontWeight: "500",
  },

  topSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "40px",
    padding: "50px 8%",
    borderBottom: "1px solid #3a4553",
  },

  heading: {
    color: "#fff",
    marginBottom: "15px",
  },

  middleSection: {
    borderBottom: "1px solid #3a4553",
    padding: "30px 8%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  selectorRow: {
    display: "flex",
    gap: "15px",
  },

  selectorBtn: {
    background: "transparent",
    border: "1px solid #555",
    padding: "8px 14px",
    color: "#ddd",
    cursor: "pointer",
  },

  bottomSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    padding: "40px 8%",
    background: "#0f1111",
  },

  copyright: {
    textAlign: "center",
    padding: "20px",
    background: "#0f1111",
    fontSize: "13px",
    opacity: 0.6,
  },
};

export default Footer;
