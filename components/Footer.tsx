export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Cloud Designs</h3>
            <p>Mapping future career paths with AI.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="/features-pricing">Features & Pricing</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/">Try Free</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/privacy">Privacy</a>
              </li>
              <li>
                <a href="/terms">Terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider">
          <p>&copy; 2025 Cloud Designs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
