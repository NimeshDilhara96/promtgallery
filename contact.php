<?php
// contact.php - Contact Us Page
session_start();

// Include header
include 'header.php';
?>

    <!-- Hero Section -->
    <section class="py-5 bg-white">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                    <span class="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3 fs-6 rounded-pill">
                        <i class="bi bi-envelope me-2"></i> Get In Touch
                    </span>
                    <h1 class="display-4 fw-bold mb-3">Contact Us</h1>
                    <p class="lead text-muted">We'd love to hear from you. Reach out with any questions or concerns.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Information Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <!-- Email Contact Card -->
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-5 text-center">
                            <div class="mb-4">
                                <i class="bi bi-envelope-fill text-primary" style="font-size: 4rem;"></i>
                            </div>
                            <h2 class="h4 mb-3">Email Us</h2>
                            <p class="text-muted mb-4">Send us an email and we'll get back to you as soon as possible.</p>
                            <a href="mailto:slcfcricinfo@gmail.com" class="btn btn-primary btn-lg px-5">
                                <i class="bi bi-envelope me-2"></i> slcfcricinfo@gmail.com
                            </a>
                        </div>
                    </div>

                    <!-- Copyright/DMCA Notice -->
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-5">
                            <div class="d-flex align-items-start mb-4">
                                <div class="me-3">
                                    <i class="bi bi-shield-exclamation text-warning" style="font-size: 2.5rem;"></i>
                                </div>
                                <div>
                                    <h3 class="h5 mb-2">Copyright & DMCA Notice</h3>
                                    <p class="text-muted mb-0">We respect intellectual property rights</p>
                                </div>
                            </div>
                            
                            <div class="alert alert-warning border-0 mb-4">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                                    <div>
                                        <strong>Important Notice:</strong> If you believe any content on our site infringes your copyright, please contact us immediately.
                                    </div>
                                </div>
                            </div>

                            <h4 class="h6 mb-3">What to Include in Your Notice:</h4>
                            <ul class="list-unstyled mb-4">
                                <li class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                    <strong>Prompt Content:</strong> Specific prompt text or ID
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                    <strong>Images/Photos:</strong> Link or description of copyrighted image
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                    <strong>Proof of Ownership:</strong> Evidence that you own the copyright
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                    <strong>Contact Information:</strong> Your name and email address
                                </li>
                            </ul>

                            <div class="bg-light p-4 rounded-3 mb-4">
                                <h5 class="h6 mb-3"><i class="bi bi-clock-history me-2 text-primary"></i>Our Commitment</h5>
                                <p class="mb-0">
                                    We take copyright concerns seriously and will <strong class="text-primary">remove infringing content immediately</strong> upon verification. 
                                    We typically respond within <strong>24-48 hours</strong> and remove content within the same timeframe.
                                </p>
                            </div>

                            <div class="text-center">
                                <a href="mailto:slcfcricinfo@gmail.com?subject=Copyright%20Infringement%20Notice" class="btn btn-outline-warning btn-lg">
                                    <i class="bi bi-flag me-2"></i> Report Copyright Infringement
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- General Inquiries -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-5">
                            <div class="d-flex align-items-start mb-4">
                                <div class="me-3">
                                    <i class="bi bi-chat-dots-fill text-info" style="font-size: 2.5rem;"></i>
                                </div>
                                <div>
                                    <h3 class="h5 mb-2">General Inquiries</h3>
                                    <p class="text-muted mb-0">Questions, feedback, or suggestions</p>
                                </div>
                            </div>

                            <p class="mb-4">We welcome your feedback! Contact us for:</p>
                            <ul class="list-unstyled mb-4">
                                <li class="mb-2">
                                    <i class="bi bi-arrow-right-circle-fill text-info me-2"></i>
                                    Questions about using prompts
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-arrow-right-circle-fill text-info me-2"></i>
                                    Suggestions for new features
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-arrow-right-circle-fill text-info me-2"></i>
                                    Prompt submissions
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-arrow-right-circle-fill text-info me-2"></i>
                                    Partnership opportunities
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-arrow-right-circle-fill text-info me-2"></i>
                                    Technical support
                                </li>
                            </ul>

                            <div class="text-center">
                                <a href="mailto:slcfcricinfo@gmail.com?subject=General%20Inquiry" class="btn btn-outline-info btn-lg">
                                    <i class="bi bi-send me-2"></i> Send General Inquiry
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-5 bg-white">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h2 class="h3 text-center mb-5">Frequently Asked Questions</h2>
                    
                    <div class="accordion" id="faqAccordion">
                        <div class="accordion-item border-0 shadow-sm mb-3">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                    How quickly will you respond to my email?
                                </button>
                            </h2>
                            <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    We typically respond to all inquiries within 24-48 hours. Copyright infringement notices are our top priority and are handled immediately.
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item border-0 shadow-sm mb-3">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                    What happens after I report copyright infringement?
                                </button>
                            </h2>
                            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Once we verify your claim, the infringing content will be removed immediately from our gallery. You'll receive a confirmation email once the removal is complete.
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item border-0 shadow-sm mb-3">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                    Can I submit my own prompts?
                                </button>
                            </h2>
                            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Yes! We welcome prompt submissions. Please email us with your prompt ideas, and we'll review them for inclusion in our gallery.
                                </div>
                            </div>
                        </div>

                        <div class="accordion-item border-0 shadow-sm">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                    Are all prompts free to use?
                                </button>
                            </h2>
                            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Yes, all prompts in our gallery are completely free to use for both personal and commercial projects.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Back to Home CTA -->
    <section class="py-5 bg-light">
        <div class="container text-center">
            <h2 class="h3 mb-3">Ready to Create Amazing AI Art?</h2>
            <p class="lead text-muted mb-4">Browse our collection of professional AI prompts</p>
            <a href="index.php" class="btn btn-primary btn-lg px-5">
                <i class="bi bi-arrow-left me-2"></i> Back to Gallery
            </a>
        </div>
    </section>

<?php
// Include footer
include 'footer.php';
?>