import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use AI Prompts | AI Prompt Gallery",
  description: "A comprehensive guide to getting the best results from your AI art generators using our curated prompts.",
};

export default function InstructionsPage() {
  return (
    <>
      <section className="py-5 bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-5 fw-bold mb-3">How to Use AI Prompts</h1>
              <p className="lead mb-0 text-muted">A comprehensive guide to getting the best results from your AI art generators</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-sm mb-5">
                <div className="card-body p-4 p-lg-5">
                  <h2 className="mb-4">Getting Started with AI Art Prompts</h2>
                  
                  <p className="lead">AI image generators have revolutionized digital art creation, allowing anyone to create stunning visuals with just text prompts. This guide will help you understand how to use our prompts effectively across different AI platforms.</p>
                  
                  <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                    <div>
                      All prompts in our gallery are tested and optimized for quality results, but you can always modify them to suit your specific needs!
                    </div>
                  </div>
                  
                  <h3 className="mt-5 mb-4">Step-by-Step Instructions</h3>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-lg-6">
                      <div className="card h-100 instruction-card shadow-sm">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="instruction-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "35px", height: "35px" }}>1</div>
                            <h4 className="mb-0">Browse & Find a Prompt</h4>
                          </div>
                          <p>Use our search feature or category filters to find prompts that match your creative vision. You can search by style, subject, mood, or any keyword.</p>
                          <div className="bg-light p-3 rounded mb-3">
                            <p className="mb-2"><strong>Example Categories:</strong></p>
                            <span className="badge bg-primary me-1">Portrait</span>
                            <span className="badge bg-primary me-1">Landscape</span>
                            <span className="badge bg-primary me-1">Fantasy</span>
                            <span className="badge bg-primary me-1">Cyberpunk</span>
                          </div>
                          <p className="text-muted small"><i className="bi bi-lightbulb text-warning"></i> Tip: Check the tags on each prompt for additional style information!</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="card h-100 instruction-card shadow-sm">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="instruction-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "35px", height: "35px" }}>2</div>
                            <h4 className="mb-0">Copy the Prompt</h4>
                          </div>
                          <p>Once you find a prompt you like, simply click the "Copy Prompt" button. This will copy the full prompt text to your clipboard.</p>
                          <div className="bg-light p-3 rounded mb-3">
                            <button className="btn btn-sm btn-primary" disabled>
                              <i className="bi bi-clipboard me-1"></i> Copy Prompt
                            </button>
                            <span className="ms-2 text-success"><i className="bi bi-check-lg"></i> Copied!</span>
                          </div>
                          <p className="text-muted small"><i className="bi bi-lightbulb text-warning"></i> You can also view the full prompt details before copying by clicking "View Details".</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="card h-100 instruction-card shadow-sm border-primary">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="instruction-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "35px", height: "35px" }}>3</div>
                            <h4 className="mb-0">Upload Your Photo</h4>
                          </div>
                          <p>Open your preferred AI platform and <strong>upload your own photo</strong> that you want to transform or enhance.</p>
                          <div className="alert alert-info mb-3">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Important:</strong> Most modern AI tools allow you to upload an image and then apply a prompt to transform it!
                          </div>
                          <p className="mb-2"><strong>Supported platforms:</strong></p>
                          <ul className="mb-0 text-muted small">
                            <li><strong>Google AI Studio</strong> - Upload image + prompt</li>
                            <li><strong>Midjourney</strong> - /imagine [image URL] + prompt</li>
                            <li><strong>Leonardo AI</strong> - Image to Image feature</li>
                            <li><strong>Stable Diffusion</strong> - img2img mode</li>
                            <li><strong>DALL-E 3</strong> - Edit with prompt</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-lg-6">
                      <div className="card h-100 instruction-card shadow-sm border-primary">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="instruction-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "35px", height: "35px" }}>4</div>
                            <h4 className="mb-0">Paste Prompt & Generate</h4>
                          </div>
                          <p>Paste the copied prompt into the AI platform's text field, then click generate to transform your photo!</p>
                          <div className="bg-light p-3 rounded mb-3 font-monospace small text-muted">
                            <div className="mb-2"><strong>Your Photo:</strong> portrait.jpg ✓</div>
                            <div><strong>Prompt:</strong> "Transform this into a cyberpunk warrior..."</div>
                          </div>
                          <button className="btn btn-success w-100 mb-2" disabled>
                            <i className="bi bi-stars me-2"></i> Generate AI Art
                          </button>
                          <p className="text-muted small mb-0"><i className="bi bi-lightbulb text-warning"></i> Results may vary between platforms and generations. Try adjusting the prompt for different effects!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-success mb-5" role="alert">
                    <h4 className="alert-heading"><i className="bi bi-image me-2"></i> Use Prompts with Your Own Photos!</h4>
                    <p>Our prompts work great with your personal photos! Upload your selfie, landscape, or any image, then apply our prompts to:</p>
                    <ul className="mb-0">
                      <li>Transform yourself into different artistic styles</li>
                      <li>Convert your photos into fantasy or sci-fi scenes</li>
                      <li>Apply professional photography effects</li>
                      <li>Create unique variations of your existing images</li>
                    </ul>
                  </div>
                  
                  <h3 className="mt-5 mb-4">How to Use Prompts with Your Photos on Different Platforms</h3>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0"><i className="bi bi-google me-2"></i> Google AI Studio</h5>
                        </div>
                        <div className="card-body bg-light">
                          <ol className="mb-3 small">
                            <li>Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                            <li>Click on "Upload Image" or drag your photo</li>
                            <li>Paste your copied prompt in the text field</li>
                            <li>Add instructions like "Apply this style to the uploaded image"</li>
                            <li>Click "Generate" and wait for results</li>
                          </ol>
                          <div className="bg-white p-3 rounded border small text-muted font-monospace">
                            <strong>Example:</strong><br/>
                            "Transform the person in this image into a cyberpunk warrior with neon lights, futuristic cityscape background, dramatic lighting"
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0"><i className="bi bi-discord me-2"></i> Midjourney</h5>
                        </div>
                        <div className="card-body bg-light">
                          <ol className="mb-3 small">
                            <li>Upload your image to Discord</li>
                            <li>Right-click the image → Copy Link</li>
                            <li>Type: <code>/imagine</code></li>
                            <li>Paste image URL, then paste your prompt</li>
                            <li>Press Enter to generate</li>
                          </ol>
                          <div className="bg-white p-3 rounded border small text-muted font-monospace">
                            <strong>Example:</strong><br/>
                            /imagine https://cdn.discord.com/your-image.jpg cyberpunk warrior, neon lights, futuristic --v 6 --ar 16:9
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0"><i className="bi bi-palette me-2"></i> Leonardo AI</h5>
                        </div>
                        <div className="card-body bg-light">
                          <ol className="mb-3 small">
                            <li>Go to <a href="https://leonardo.ai" target="_blank" rel="noopener noreferrer">Leonardo.ai</a></li>
                            <li>Select "Image to Image" feature</li>
                            <li>Upload your photo</li>
                            <li>Paste your prompt in the prompt box</li>
                            <li>Adjust "Image Strength" (0.3-0.7 recommended)</li>
                            <li>Click "Generate"</li>
                          </ol>
                          <div className="bg-white p-3 rounded border small text-muted font-monospace">
                            <strong>Tip:</strong> Lower strength = closer to original photo<br/>
                            Higher strength = more creative transformation
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0"><i className="bi bi-cpu me-2"></i> Stable Diffusion</h5>
                        </div>
                        <div className="card-body bg-light">
                          <ol className="mb-3 small">
                            <li>Open Stable Diffusion WebUI or online service</li>
                            <li>Switch to "img2img" tab</li>
                            <li>Upload your image</li>
                            <li>Paste your prompt</li>
                            <li>Set denoising strength (0.4-0.7)</li>
                            <li>Click "Generate"</li>
                          </ol>
                          <div className="bg-white p-3 rounded border small text-muted font-monospace">
                            <strong>Tip:</strong> Use negative prompts to avoid unwanted elements:<br/>
                            "blurry, low quality, distorted"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card border-warning mb-5 shadow-sm">
                    <div className="card-body bg-warning bg-opacity-10">
                      <h5 className="card-title text-warning-emphasis"><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i> Important Tips for Best Results</h5>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <h6 className="text-success"><i className="bi bi-check-circle-fill me-2"></i>Do's:</h6>
                          <ul className="small text-muted">
                            <li>Use high-quality, well-lit photos</li>
                            <li>Choose prompts that match your photo type</li>
                            <li>Experiment with different strength/weight settings</li>
                            <li>Try multiple generations for variety</li>
                            <li>Adjust prompts to your specific image</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-danger"><i className="bi bi-x-circle-fill me-2"></i>Don'ts:</h6>
                          <ul className="small text-muted">
                            <li>Don't use blurry or low-resolution images</li>
                            <li>Avoid extremely dark or overexposed photos</li>
                            <li>Don't expect identical results every time</li>
                            <li>Don't use copyrighted images without permission</li>
                            <li>Don't over-complicate your prompts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-light rounded border mb-5 shadow-sm">
                    <h4 className="mb-4 text-primary">Quick Example Workflow</h4>
                    <div className="row g-3 align-items-center justify-content-center">
                      <div className="col-auto">
                        <div className="bg-white p-3 rounded shadow-sm border">
                          <i className="bi bi-card-image display-4 text-primary"></i>
                          <p className="small mb-0 mt-2 fw-bold text-muted">1. Your Photo</p>
                        </div>
                      </div>
                      <div className="col-auto d-none d-sm-block">
                        <i className="bi bi-arrow-right fs-1 text-muted"></i>
                      </div>
                      <div className="col-auto">
                        <div className="bg-white p-3 rounded shadow-sm border">
                          <i className="bi bi-clipboard-check display-4 text-success"></i>
                          <p className="small mb-0 mt-2 fw-bold text-muted">2. Copy Prompt</p>
                        </div>
                      </div>
                      <div className="col-auto d-none d-sm-block">
                        <i className="bi bi-arrow-right fs-1 text-muted"></i>
                      </div>
                      <div className="col-auto">
                        <div className="bg-white p-3 rounded shadow-sm border">
                          <i className="bi bi-robot display-4 text-info"></i>
                          <p className="small mb-0 mt-2 fw-bold text-muted">3. AI Platform</p>
                        </div>
                      </div>
                      <div className="col-auto d-none d-sm-block">
                        <i className="bi bi-arrow-right fs-1 text-muted"></i>
                      </div>
                      <div className="col-auto">
                        <div className="bg-white p-3 rounded shadow-sm border">
                          <i className="bi bi-stars display-4 text-warning"></i>
                          <p className="small mb-0 mt-2 fw-bold text-muted">4. Amazing Result!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-5">
                    <Link href="/" className="btn btn-primary btn-lg px-5 shadow-sm">
                      <i className="bi bi-arrow-left me-2"></i> Back to Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
