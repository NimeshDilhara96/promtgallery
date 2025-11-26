<?php
// instructions.php - How to use AI prompts
session_start();

// Load prompts from JSON file (for header counts)
$jsonFile = 'prompts.json';
$prompts = [];

if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    $prompts = json_decode($jsonData, true);
}

// Get unique categories - handle both array and string formats
$categories = [];
foreach ($prompts as $prompt) {
    if (isset($prompt['category'])) {
        if (is_array($prompt['category'])) {
            $categories = array_merge($categories, $prompt['category']);
        } else {
            $categories[] = $prompt['category'];
        }
    }
}
$categories = array_unique($categories);
sort($categories);

// Set default values for header
$category = 'all';
$search = '';

// Include header
include 'header.php';
?>

    <!-- Hero Section -->
    <section class="py-5 bg-gradient-primary">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10 text-center">
                    <h1 class="display-5 fw-bold mb-3">How to Use AI Prompts</h1>
                    <p class="lead mb-0">A comprehensive guide to getting the best results from your AI art generators</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <section class="py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card shadow-sm mb-5">
                        <div class="card-body p-4 p-lg-5">
                            <h2 class="mb-4">Getting Started with AI Art Prompts</h2>
                            
                            <p class="lead">AI image generators have revolutionized digital art creation, allowing anyone to create stunning visuals with just text prompts. This guide will help you understand how to use our prompts effectively across different AI platforms.</p>
                            
                            <div class="alert alert-primary d-flex align-items-center mb-4" role="alert">
                                <i class="bi bi-info-circle-fill me-2"></i>
                                <div>
                                    All prompts in our gallery are tested and optimized for quality results, but you can always modify them to suit your specific needs!
                                </div>
                            </div>
                            
                            <h3 class="mt-5 mb-4">Step-by-Step Instructions</h3>
                            
                            <div class="row g-4 mb-5">
                                <div class="col-lg-6">
                                    <div class="card h-100 instruction-card shadow-sm">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-center mb-3">
                                                <div class="instruction-number">1</div>
                                                <h4 class="mb-0">Browse & Find a Prompt</h4>
                                            </div>
                                            <p>Use our search feature or category filters to find prompts that match your creative vision. You can search by style, subject, mood, or any keyword.</p>
                                            <div class="bg-light p-3 rounded mb-3">
                                                <p class="mb-2"><strong>Example Categories:</strong></p>
                                                <span class="badge bg-primary me-1">Portrait</span>
                                                <span class="badge bg-primary me-1">Landscape</span>
                                                <span class="badge bg-primary me-1">Fantasy</span>
                                                <span class="badge bg-primary me-1">Cyberpunk</span>
                                            </div>
                                            <p class="text-muted small"><i class="bi bi-lightbulb"></i> Tip: Check the tags on each prompt for additional style information!</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6">
                                    <div class="card h-100 instruction-card shadow-sm">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-center mb-3">
                                                <div class="instruction-number">2</div>
                                                <h4 class="mb-0">Copy the Prompt</h4>
                                            </div>
                                            <p>Once you find a prompt you like, simply click the "Copy Prompt" button. This will copy the full prompt text to your clipboard.</p>
                                            <div class="bg-light p-3 rounded mb-3">
                                                <button class="btn btn-sm btn-primary" disabled>
                                                    <i class="bi bi-clipboard me-1"></i> Copy Prompt
                                                </button>
                                                <span class="ms-2 text-success"><i class="bi bi-check-lg"></i> Copied!</span>
                                            </div>
                                            <p class="text-muted small"><i class="bi bi-lightbulb"></i> You can also view the full prompt details before copying by clicking "View Full".</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6">
                                    <div class="card h-100 instruction-card shadow-sm border-primary">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-center mb-3">
                                                <div class="instruction-number">3</div>
                                                <h4 class="mb-0">Upload Your Photo</h4>
                                            </div>
                                            <p>Open your preferred AI platform and <strong>upload your own photo</strong> that you want to transform or enhance.</p>
                                            <div class="alert alert-info mb-3">
                                                <i class="bi bi-info-circle me-2"></i>
                                                <strong>Important:</strong> Most modern AI tools allow you to upload an image and then apply a prompt to transform it!
                                            </div>
                                            <p class="mb-2"><strong>Supported platforms:</strong></p>
                                            <ul class="mb-0">
                                                <li><strong>Google AI Studio</strong> - Upload image + prompt</li>
                                                <li><strong>Midjourney</strong> - /imagine [image URL] + prompt</li>
                                                <li><strong>Leonardo AI</strong> - Image to Image feature</li>
                                                <li><strong>Stable Diffusion</strong> - img2img mode</li>
                                                <li><strong>DALL-E 3</strong> - Edit with prompt</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6">
                                    <div class="card h-100 instruction-card shadow-sm border-primary">
                                        <div class="card-body p-4">
                                            <div class="d-flex align-items-center mb-3">
                                                <div class="instruction-number">4</div>
                                                <h4 class="mb-0">Paste Prompt & Generate</h4>
                                            </div>
                                            <p>Paste the copied prompt into the AI platform's text field, then click generate to transform your photo!</p>
                                            <div class="bg-light p-3 rounded mb-3 font-monospace small">
                                                <div class="mb-2"><strong>Your Photo:</strong> portrait.jpg ✓</div>
                                                <div><strong>Prompt:</strong> "Transform this into a cyberpunk warrior..."</div>
                                            </div>
                                            <button class="btn btn-success w-100 mb-2" disabled>
                                                <i class="bi bi-stars me-2"></i> Generate AI Art
                                            </button>
                                            <p class="text-muted small mb-0"><i class="bi bi-lightbulb"></i> Results may vary between platforms and generations. Try adjusting the prompt for different effects!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-success mb-5" role="alert">
                                <h4 class="alert-heading"><i class="bi bi-image me-2"></i> Use Prompts with Your Own Photos!</h4>
                                <p>Our prompts work great with your personal photos! Upload your selfie, landscape, or any image, then apply our prompts to:</p>
                                <ul class="mb-0">
                                    <li>Transform yourself into different artistic styles</li>
                                    <li>Convert your photos into fantasy or sci-fi scenes</li>
                                    <li>Apply professional photography effects</li>
                                    <li>Create unique variations of your existing images</li>
                                </ul>
                            </div>
                            
                            <h3 class="mt-5 mb-4">How to Use Prompts with Your Photos on Different Platforms</h3>
                            
                            <div class="row g-4 mb-5">
                                <div class="col-md-6">
                                    <div class="card h-100 shadow-sm">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0"><i class="bi bi-google me-2"></i> Google AI Studio</h5>
                                        </div>
                                        <div class="card-body">
                                            <ol class="mb-3">
                                                <li>Go to <a href="https://aistudio.google.com" target="_blank">Google AI Studio</a></li>
                                                <li>Click on "Upload Image" or drag your photo</li>
                                                <li>Paste your copied prompt in the text field</li>
                                                <li>Add instructions like "Apply this style to the uploaded image"</li>
                                                <li>Click "Generate" and wait for results</li>
                                            </ol>
                                            <div class="prompt-example">
                                                <strong>Example:</strong><br>
                                                "Transform the person in this image into a cyberpunk warrior with neon lights, futuristic cityscape background, dramatic lighting"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 shadow-sm">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0"><i class="bi bi-discord me-2"></i> Midjourney</h5>
                                        </div>
                                        <div class="card-body">
                                            <ol class="mb-3">
                                                <li>Upload your image to Discord</li>
                                                <li>Right-click the image → Copy Link</li>
                                                <li>Type: <code>/imagine</code></li>
                                                <li>Paste image URL, then paste your prompt</li>
                                                <li>Press Enter to generate</li>
                                            </ol>
                                            <div class="prompt-example">
                                                <strong>Example:</strong><br>
                                                /imagine https://cdn.discord.com/your-image.jpg cyberpunk warrior, neon lights, futuristic --v 6 --ar 16:9
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 shadow-sm">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0"><i class="bi bi-palette me-2"></i> Leonardo AI</h5>
                                        </div>
                                        <div class="card-body">
                                            <ol class="mb-3">
                                                <li>Go to <a href="https://leonardo.ai" target="_blank">Leonardo.ai</a></li>
                                                <li>Select "Image to Image" feature</li>
                                                <li>Upload your photo</li>
                                                <li>Paste your prompt in the prompt box</li>
                                                <li>Adjust "Image Strength" (0.3-0.7 recommended)</li>
                                                <li>Click "Generate"</li>
                                            </ol>
                                            <div class="prompt-example">
                                                <strong>Tip:</strong> Lower strength = closer to original photo<br>
                                                Higher strength = more creative transformation
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100 shadow-sm">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0"><i class="bi bi-cpu me-2"></i> Stable Diffusion</h5>
                                        </div>
                                        <div class="card-body">
                                            <ol class="mb-3">
                                                <li>Open Stable Diffusion WebUI or online service</li>
                                                <li>Switch to "img2img" tab</li>
                                                <li>Upload your image</li>
                                                <li>Paste your prompt</li>
                                                <li>Set denoising strength (0.4-0.7)</li>
                                                <li>Click "Generate"</li>
                                            </ol>
                                            <div class="prompt-example">
                                                <strong>Tip:</strong> Use negative prompts to avoid unwanted elements:<br>
                                                "blurry, low quality, distorted"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border-warning mb-5">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="bi bi-exclamation-triangle text-warning me-2"></i> Important Tips for Best Results</h5>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>✅ Do's:</h6>
                                            <ul>
                                                <li>Use high-quality, well-lit photos</li>
                                                <li>Choose prompts that match your photo type</li>
                                                <li>Experiment with different strength/weight settings</li>
                                                <li>Try multiple generations for variety</li>
                                                <li>Adjust prompts to your specific image</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>❌ Don'ts:</h6>
                                            <ul>
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
                            
                            <div class="text-center p-4 bg-gradient-primary rounded mb-5">
                                <h4 class="mb-3">Quick Example Workflow</h4>
                                <div class="row g-3 align-items-center justify-content-center">
                                    <div class="col-auto">
                                        <div class="bg-white p-3 rounded shadow-sm">
                                            <i class="bi bi-card-image display-4 text-primary"></i>
                                            <p class="small mb-0 mt-2">1. Your Photo</p>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="bi bi-arrow-right display-6"></i>
                                    </div>
                                    <div class="col-auto">
                                        <div class="bg-white p-3 rounded shadow-sm">
                                            <i class="bi bi-clipboard-check display-4 text-success"></i>
                                            <p class="small mb-0 mt-2">2. Copy Prompt</p>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="bi bi-arrow-right display-6"></i>
                                    </div>
                                    <div class="col-auto">
                                        <div class="bg-white p-3 rounded shadow-sm">
                                            <i class="bi bi-robot display-4 text-info"></i>
                                            <p class="small mb-0 mt-2">3. AI Platform</p>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="bi bi-arrow-right display-6"></i>
                                    </div>
                                    <div class="col-auto">
                                        <div class="bg-white p-3 rounded shadow-sm">
                                            <i class="bi bi-stars display-4 text-warning"></i>
                                            <p class="small mb-0 mt-2">4. Amazing Result!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <a href="index.php" class="btn btn-primary btn-lg px-5">
                                    <i class="bi bi-arrow-left me-2"></i> Back to Gallery
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php
// Include footer
include 'footer.php';
?>

    <script>
        // Initialize Bootstrap tooltips
        document.addEventListener('DOMContentLoaded', function() {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        });
    </script>
</body>
</html>