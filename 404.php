<?php
http_response_code(404);
$pageTitle = "Page Not Found - 404 Error | AI Prompt Gallery";
$pageDescription = "The page you're looking for doesn't exist.";
include 'header.php';
?>

<section class="py-5 min-vh-100 d-flex align-items-center">
    <div class="container text-center">
        <h1 class="display-1 fw-bold text-primary">404</h1>
        <h2 class="mb-4">Page Not Found</h2>
        <p class="lead mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <a href="<?= $siteURL ?? '/'; ?>" class="btn btn-primary btn-lg">
            <i class="bi bi-house me-2"></i>Back to Home
        </a>
    </div>
</section>

<?php include 'footer.php'; ?>