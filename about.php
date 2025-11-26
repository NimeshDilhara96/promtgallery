<?php
// about.php - About Page
session_start();

// Include header
include 'header.php';
?>

    <!-- Hero Section -->
    <section class="py-5 bg-gradient-primary">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold mb-3">About AI Prompt Gallery</h1>
                    <p class="lead text-muted">Learn more about our mission to help creators make stunning AI art</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="py-5 bg-white">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10 text-center">
                    <h2 class="display-6 mb-4">About AI Prompt Gallery</h2>
                    <p class="lead mb-5">
                        Welcome to our carefully curated collection of AI art prompts. Whether you're using Midjourney, DALL-E, Stable Diffusion, or any other AI image generator, our prompts are designed to help you create stunning, professional-quality images.
                    </p>
                    
                    <div class="row g-4">
                        <div class="col-lg-3 col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body text-center p-4">
                                    <div class="display-4 mb-3">✨</div>
                                    <h3 class="h5 mb-3">Curated Collection</h3>
                                    <p class="text-muted">Every prompt is tested and optimized for best results</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body text-center p-4">
                                    <div class="display-4 mb-3">🎯</div>
                                    <h3 class="h5 mb-3">Easy to Use</h3>
                                    <p class="text-muted">One-click copy and paste into your favorite AI tool</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body text-center p-4">
                                    <div class="display-4 mb-3">🆓</div>
                                    <h3 class="h5 mb-3">Completely Free</h3>
                                    <p class="text-muted">All prompts are free for personal and commercial use</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body text-center p-4">
                                    <div class="display-4 mb-3">📱</div>
                                    <h3 class="h5 mb-3">Mobile Friendly</h3>
                                    <p class="text-muted">Access prompts anywhere, on any device</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Additional Info Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h3 class="h4 mb-4">Our Mission</h3>
                    <p class="mb-4">
                        We believe that everyone should have access to high-quality AI prompts to unlock their creative potential. 
                        Our team carefully curates and tests each prompt to ensure you get the best possible results with your AI art tools.
                    </p>
                    
                    <h3 class="h4 mb-4">How It Works</h3>
                    <ol class="mb-4">
                        <li class="mb-2">Browse our collection of prompts organized by category</li>
                        <li class="mb-2">Click "Copy Prompt" to copy the full prompt text</li>
                        <li class="mb-2">Paste it into your favorite AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.)</li>
                        <li class="mb-2">Customize as needed and generate amazing images!</li>
                    </ol>
                    
                    <h3 class="h4 mb-4">Contact Us</h3>
                    <p class="mb-4">
                        Have questions, suggestions, or want to submit your own prompts? 
                        We'd love to hear from you!
                    </p>
                    
                    <div class="text-center">
                        <a href="index.php" class="btn btn-primary btn-lg px-5">
                            <i class="bi bi-arrow-left me-2"></i> Back to Gallery
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php
// Include footer
include 'footer.php';
?>