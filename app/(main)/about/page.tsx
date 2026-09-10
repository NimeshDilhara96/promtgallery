import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AI Prompt Gallery",
  description: "Learn more about our mission to help creators make stunning AI art.",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-5 bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">About AI Prompt Gallery</h1>
              <p className="lead text-muted">Learn more about our mission to help creators make stunning AI art</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="display-6 mb-4">About AI Prompt Gallery</h2>
              <p className="lead mb-5">
                Welcome to our carefully curated collection of AI art prompts. Whether you're using Midjourney, DALL-E, Stable Diffusion, or any other AI image generator, our prompts are designed to help you create stunning, professional-quality images.
              </p>
              
              <div className="row g-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-4 mb-3">✨</div>
                      <h3 className="h5 mb-3">Curated Collection</h3>
                      <p className="text-muted">Every prompt is tested and optimized for best results</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-4 mb-3">🎯</div>
                      <h3 className="h5 mb-3">Easy to Use</h3>
                      <p className="text-muted">One-click copy and paste into your favorite AI tool</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-4 mb-3">🆓</div>
                      <h3 className="h5 mb-3">Completely Free</h3>
                      <p className="text-muted">All prompts are free for personal and commercial use</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div className="display-4 mb-3">📱</div>
                      <h3 className="h5 mb-3">Mobile Friendly</h3>
                      <p className="text-muted">Access prompts anywhere, on any device</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h3 className="h4 mb-4">Our Mission</h3>
              <p className="mb-4">
                We believe that everyone should have access to high-quality AI prompts to unlock their creative potential. 
                Our team carefully curates and tests each prompt to ensure you get the best possible results with your AI art tools.
              </p>
              
              <h3 className="h4 mb-4">How It Works</h3>
              <ol className="mb-4">
                <li className="mb-2">Browse our collection of prompts organized by category</li>
                <li className="mb-2">Click "Copy Prompt" to copy the full prompt text</li>
                <li className="mb-2">Paste it into your favorite AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.)</li>
                <li className="mb-2">Customize as needed and generate amazing images!</li>
              </ol>
              
              <h3 className="h4 mb-4">Contact Us</h3>
              <p className="mb-4">
                Have questions, suggestions, or want to submit your own prompts? 
                We'd love to hear from you! You can reach out through our contact page.
              </p>
              
              <div className="text-center mt-5">
                <Link href="/" className="btn btn-primary btn-lg px-5">
                  <i className="bi bi-arrow-left me-2"></i> Back to Gallery
                </Link>
                <Link href="/contact" className="btn btn-outline-primary btn-lg px-5 ms-3">
                  <i className="bi bi-envelope me-2"></i> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
