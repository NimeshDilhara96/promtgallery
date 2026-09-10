import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | AI Prompt Gallery",
  description: "Get in touch with us for questions, support, or copyright inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3 fs-6 rounded-pill">
                <i className="bi bi-envelope me-2"></i> Get In Touch
              </span>
              <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
              <p className="lead text-muted">We'd love to hear from you. Reach out with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Email Contact Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-envelope-fill text-primary" style={{ fontSize: "4rem" }}></i>
                  </div>
                  <h2 className="h4 mb-3">Email Us</h2>
                  <p className="text-muted mb-4">Send us an email and we'll get back to you as soon as possible.</p>
                  <a href="mailto:slcfcricinfo@gmail.com" className="btn btn-primary btn-lg px-5">
                    <i className="bi bi-envelope me-2"></i> slcfcricinfo@gmail.com
                  </a>
                </div>
              </div>

              {/* Copyright/DMCA Notice */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-5">
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="bi bi-shield-exclamation text-warning" style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-2">Copyright & DMCA Notice</h3>
                      <p className="text-muted mb-0">We respect intellectual property rights</p>
                    </div>
                  </div>
                  
                  <div className="alert alert-warning border-0 mb-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                      <div>
                        <strong>Important Notice:</strong> If you believe any content on our site infringes your copyright, please contact us immediately.
                      </div>
                    </div>
                  </div>

                  <h4 className="h6 mb-3">What to Include in Your Notice:</h4>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <strong>Prompt Content:</strong> Specific prompt text or ID
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <strong>Images/Photos:</strong> Link or description of copyrighted image
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <strong>Proof of Ownership:</strong> Evidence that you own the copyright
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <strong>Contact Information:</strong> Your name and email address
                    </li>
                  </ul>

                  <div className="bg-light p-4 rounded-3 mb-4">
                    <h5 className="h6 mb-3"><i className="bi bi-clock-history me-2 text-primary"></i>Our Commitment</h5>
                    <p className="mb-0">
                      We take copyright concerns seriously and will <strong className="text-primary">remove infringing content immediately</strong> upon verification. 
                      We typically respond within <strong>24-48 hours</strong> and remove content within the same timeframe.
                    </p>
                  </div>

                  <div className="text-center">
                    <a href="mailto:slcfcricinfo@gmail.com?subject=Copyright%20Infringement%20Notice" className="btn btn-outline-warning btn-lg">
                      <i className="bi bi-flag me-2"></i> Report Copyright Infringement
                    </a>
                  </div>
                </div>
              </div>

              {/* General Inquiries */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <div className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="bi bi-chat-dots-fill text-info" style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-2">General Inquiries</h3>
                      <p className="text-muted mb-0">Questions, feedback, or suggestions</p>
                    </div>
                  </div>

                  <p className="mb-4">We welcome your feedback! Contact us for:</p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill text-info me-2"></i>
                      Questions about using prompts
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill text-info me-2"></i>
                      Suggestions for new features
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill text-info me-2"></i>
                      Prompt submissions
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill text-info me-2"></i>
                      Partnership opportunities
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill text-info me-2"></i>
                      Technical support
                    </li>
                  </ul>

                  <div className="text-center">
                    <a href="mailto:slcfcricinfo@gmail.com?subject=General%20Inquiry" className="btn btn-outline-info btn-lg">
                      <i className="bi bi-send me-2"></i> Send General Inquiry
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h3 text-center mb-5">Frequently Asked Questions</h2>
              
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How quickly will you respond to my email?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We typically respond to all inquiries within 24-48 hours. Copyright infringement notices are our top priority and are handled immediately.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      What happens after I report copyright infringement?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Once we verify your claim, the infringing content will be removed immediately from our gallery. You'll receive a confirmation email once the removal is complete.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      Can I submit my own prompts?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes! We welcome prompt submissions. Please email us with your prompt ideas, and we'll review them for inclusion in our gallery.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      Are all prompts free to use?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes, all prompts in our gallery are completely free to use for both personal and commercial projects.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="h3 mb-3">Ready to Create Amazing AI Art?</h2>
          <p className="lead text-muted mb-4">Browse our collection of professional AI prompts</p>
          <Link href="/" className="btn btn-primary btn-lg px-5">
            <i className="bi bi-arrow-left me-2"></i> Back to Gallery
          </Link>
        </div>
      </section>
    </>
  );
}
