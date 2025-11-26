<?php
// Default variables
if (!isset($prompts)) { $prompts = []; }
if (!isset($categories)) { $categories = []; }
if (!isset($category)) { $category = 'all'; }
if (!isset($search)) { $search = ''; }
if (!isset($currentPage)) { $currentPage = basename($_SERVER['PHP_SELF']); }

// Get protocol (http or https)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

// Dynamic title + description
if (!isset($pageTitle)) {
    $pageTitle = ($category !== 'all') 
        ? ucfirst($category) . " AI Prompts | AI Prompt Gallery" 
        : "AI Prompt Gallery - Free AI Art Prompts for Gemini, Midjourney, DALL-E & More";
}

if (!isset($pageDescription)) {
    $pageDescription = ($category !== 'all')
        ? "Discover the best " . ucfirst($category) . " AI prompts for Gemini, Midjourney, DALL-E, and more. Create stunning AI-generated images instantly with our free prompt library."
        : "Free AI Art Prompts for Gemini, Midjourney, DALL-E, and more. Browse our curated collection of " . count($prompts) . "+ professional prompts and create stunning digital art effortlessly.";
}

$currentURL = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$siteName = "AI Prompt Gallery";
$siteURL = $protocol . $_SERVER['HTTP_HOST'];

if (!isset($ogImage)) {
    $ogImage = $siteURL . "/og-image.jpg";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title><?= htmlspecialchars($pageTitle); ?></title>
    <meta name="title" content="<?= htmlspecialchars($pageTitle); ?>">
    <meta name="description" content="<?= htmlspecialchars($pageDescription); ?>">
    <meta name="keywords" content="AI Art Gemini, AI Art DALL-E, AI Image Generator Prompts, Free AI Prompts, AI Art Prompts, AI Art Gallery, Midjourney prompts, Stable Diffusion prompts, Leonardo AI prompts, AI prompt library, AI prompt gallery">
    <meta name="author" content="AI Prompt Gallery">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="<?= htmlspecialchars($currentURL); ?>">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= htmlspecialchars($currentURL); ?>">
    <meta property="og:title" content="<?= htmlspecialchars($pageTitle); ?>">
    <meta property="og:description" content="<?= htmlspecialchars($pageDescription); ?>">
    <meta property="og:image" content="<?= htmlspecialchars($ogImage); ?>">
    <meta property="og:site_name" content="<?= htmlspecialchars($siteName); ?>">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?= htmlspecialchars($currentURL); ?>">
    <meta name="twitter:title" content="<?= htmlspecialchars($pageTitle); ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($pageDescription); ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($ogImage); ?>">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "<?= $siteURL; ?>/",
      "name": "AI Prompt Gallery",
      "description": "Free AI Art Prompts for Gemini, Midjourney, DALL-E, and more.",
      "publisher": {
        "@type": "Organization",
        "name": "AI Prompt Gallery"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "<?= $siteURL; ?>/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?= $siteURL; ?>/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?= $siteURL; ?>/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?= $siteURL; ?>/favicon/favicon-16x16.png">
    <link rel="manifest" href="<?= $siteURL; ?>/favicon/site.webmanifest">
    <link rel="shortcut icon" href="<?= $siteURL; ?>/favicon/favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <!-- Styles / Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <!-- Google Verification -->
    <meta name="google-site-verification" content="fVjSYIuqjb7QS9Qd_UQkQ3Ojm5a8pHoOCdtc0boYbrc" />

    <!-- Custom CSS for Bootstrap overrides -->
    <style>
        body {
            background-color: #f8f9fa;
            padding-top: 76px; /* Account for fixed navbar */
        }
        
        /* Search Section Styles */
        .search-section {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
        }
        
        /* Modern Search Bar */
        .search-form {
            position: relative;
            z-index: 1;
            margin-bottom: 0;
        }
        
        .search-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            background: white;
            border-radius: 50px;
            padding: 8px 8px 8px 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 5;
        }
        
        .search-wrapper:focus-within {
            box-shadow: 0 15px 50px rgba(13, 110, 253, 0.2);
            transform: translateY(-2px);
            z-index: 6;
        }
        
        .search-icon {
            color: #6c757d;
            margin-right: 12px;
            font-size: 1.2rem;
        }
        
        .search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 1rem;
            padding: 12px 8px;
            background: transparent;
        }
        
        .search-input::placeholder {
            color: #adb5bd;
        }
        
        .search-clear {
            color: #6c757d;
            margin-right: 8px;
            font-size: 1.2rem;
            transition: color 0.2s ease;
            text-decoration: none;
        }
        
        .search-clear:hover {
            color: #dc3545;
        }
        
        .search-button {
            background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 28px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .search-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
        }
        
        @media (max-width: 576px) {
            .search-wrapper {
                padding: 6px 6px 6px 15px;
            }
            
            .search-input {
                font-size: 0.9rem;
                padding: 10px 6px;
            }
            
            .search-button {
                padding: 10px 20px;
                font-size: 0.9rem;
            }
        }
        
        /* Category Badge Styles */
        .category-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            color: #495057;
            text-decoration: none;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            z-index: 1;
            white-space: nowrap;
        }
        
        .category-badge:hover {
            background: #e9ecef;
            color: #0d6efd;
            border-color: #0d6efd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .category-badge.active {
            background: #0d6efd;
            color: white;
            border-color: #0d6efd;
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
        
        .category-badge i {
            font-size: 0.875rem;
        }
        
        /* Categories Container Centering - UPDATED */
        .categories-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin: 0 auto;
        }

        /* Ensure proper spacing */
        .gap-2 {
            gap: 0.5rem !important;
        }

        /* Alert Box */
        .alert-icon {
            flex-shrink: 0;
        }
        
        @media (max-width: 576px) {
            .alert {
                flex-direction: column;
                text-align: center;
            }
            
            .alert-icon {
                margin-bottom: 1rem;
            }
            
            .alert .btn {
                margin-top: 1rem;
                margin-left: 0 !important;
            }
        }
        
        .bg-gradient-primary {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }
        
        /* Modern Navbar Styles */
        .navbar {
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.95) !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .navbar-brand {
            transition: transform 0.3s ease;
        }
        
        .navbar-brand:hover {
            transform: scale(1.02);
        }
        
        .navbar-brand h1 {
            font-size: 1.5rem;
            background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .navbar-brand p {
            font-size: 0.75rem;
        }
        
        .nav-link {
            position: relative;
            font-weight: 500;
            color: #495057 !important;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem !important;
            margin: 0 0.25rem;
        }
        
        .nav-link:hover {
            color: #0d6efd !important;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #0d6efd, #0dcaf0);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
            width: 80%;
        }
        
        .nav-link.active {
            color: #0d6efd !important;
        }
        
        /* Mobile Menu Styles */
        @media (max-width: 991.98px) {
            body {
                padding-top: 70px;
            }
            
            .navbar-brand h1 {
                font-size: 1.25rem;
            }
            
            .navbar-brand p {
                font-size: 0.7rem;
            }
            
            .navbar-collapse {
                background-color: rgba(255, 255, 255, 0.98);
                border-radius: 0.5rem;
                margin-top: 1rem;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .nav-link {
                padding: 0.75rem 1rem !important;
                border-radius: 0.375rem;
                margin: 0.25rem 0;
            }
            
            .nav-link:hover,
            .nav-link.active {
                background-color: rgba(13, 110, 253, 0.1);
            }
            
            .nav-link::after {
                display: none;
            }
            
            .nav-link.active::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 70%;
                background: linear-gradient(180deg, #0d6efd, #0dcaf0);
                border-radius: 0 4px 4px 0;
            }
        }
        
        /* Hamburger Animation */
        .navbar-toggler {
            border: none;
            padding: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .navbar-toggler:focus {
            box-shadow: none;
            outline: none;
        }
        
        .navbar-toggler-icon {
            width: 1.5em;
            height: 1.5em;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(13, 110, 253, 0.75)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
            transition: transform 0.3s ease;
        }
        
        .navbar-toggler:hover .navbar-toggler-icon {
            transform: scale(1.1);
        }
        
        .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
            transform: rotate(90deg);
        }
        
        .prompt-card {
            transition: all 0.3s ease;
            height: 100%;
        }
        
        .prompt-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
            border-color: #0d6efd !important;
        }
        
        .card-img-container {
            height: 250px;
            overflow: hidden;
            position: relative;
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .card-img-top {
            max-height: 100%;
            max-width: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
        }
        
        .category-badge {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        
        .prompt-text {
            background-color: #f8f9fa;
            font-family: monospace;
            padding: 15px;
            border-radius: 6px;
            font-size: 0.9rem;
        }
        
        .tag-badge {
            font-size: 0.75rem;
        }
        
        .modal-header {
            border-bottom: none;
            padding-bottom: 0;
        }
        
        .modal-content {
            border-radius: 15px;
        }
        
        .ad-container {
            background-color: #f8f9fa;
            padding: 15px 0;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
        }
        
        .ad-label {
            font-size: 0.7rem;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        /* Floating Help Button */
        .floating-help-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: all 0.3s ease;
        }
        
        .floating-help-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        
        .help-badge-icon {
            transition: all 0.2s ease;
        }
        
        .help-badge-icon:hover {
            transform: scale(1.05);
        }
        
        /* Instructions page specific styles */
        .prompt-example {
            background-color: #f8f9fa;
            font-family: monospace;
            padding: 15px;
            border-radius: 6px;
            font-size: 0.9rem;
            border-left: 4px solid #0d6efd;
        }
        
        .instruction-card {
            transition: all 0.3s ease;
        }
        
        .instruction-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        
        .instruction-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #0d6efd;
            color: white;
            border-radius: 50%;
            font-weight: bold;
            margin-right: 15px;
        }
        
        /* Pagination Styles */
        .pagination {
            margin-bottom: 0;
        }
        
        .pagination .page-link {
            color: #0d6efd;
            border: 1px solid #dee2e6;
            padding: 0.5rem 0.75rem;
            margin: 0 2px;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }
        
        .pagination .page-link:hover {
            background-color: #e7f1ff;
            border-color: #0d6efd;
            color: #0d6efd;
        }
        
        .pagination .page-item.active .page-link {
            background-color: #0d6efd;
            border-color: #0d6efd;
            color: white;
            font-weight: bold;
        }
        
        .pagination .page-item.disabled .page-link {
            color: #6c757d;
            pointer-events: none;
            background-color: #fff;
            border-color: #dee2e6;
        }
        
        /* Responsive pagination */
        @media (max-width: 576px) {
            .pagination .page-link {
                padding: 0.375rem 0.5rem;
                font-size: 0.875rem;
                margin: 0 1px;
            }
            
            .floating-help-btn {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                font-size: 1.25rem;
            }
        }

        /* Category Badge Styles - Using Bootstrap Buttons */
        .btn-outline-primary.rounded-pill {
            padding: 0.375rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-outline-primary.rounded-pill:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
        }
        
        .btn-outline-primary.rounded-pill.active {
            background-color: #0d6efd;
            border-color: #0d6efd;
            color: white;
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }
    </style>

    <!-- Schema.org JSON-LD for ItemList (MongoDB Compatible) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        <?php 
        if (!empty($prompts)) {
            $schemaItems = [];
            foreach (array_slice($prompts, 0, 10) as $index => $prompt) {
                // Handle both MongoDB (_id) and JSON (id) formats
                $promptId = isset($prompt['_id']) ? (string)$prompt['_id'] : ($prompt['id'] ?? '');
                $promptTitle = isset($prompt['title']) ? $prompt['title'] : '';
                $promptText = isset($prompt['prompt']) ? substr($prompt['prompt'], 0, 150) : '';
                $promptCategory = isset($prompt['category']) ? $prompt['category'] : 'General';
                
                if (!empty($promptTitle)) {
                    $schemaItems[] = '{
                      "@type": "ListItem",
                      "position": ' . ($index + 1) . ',
                      "item": {
                        "@type": "CreativeWork",
                        "name": ' . json_encode($promptTitle) . ',
                        "description": ' . json_encode($promptText) . ',
                        "category": ' . json_encode($promptCategory) . '
                      }
                    }';
                }
            }
            echo implode(',', $schemaItems);
        }
        ?>
      ]
    }
    </script>
    
    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        <?php if (!empty($category) && $category !== 'all'): ?>
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "<?= $siteURL; ?>/
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "<?php echo htmlspecialchars($category); ?>",
          "item": "<?= $siteURL; ?>/?category=<?php echo urlencode($category); ?>"
        }
        <?php elseif (!empty($search)): ?>
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "<?= $siteURL; ?>/
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Search Results",
          "item": "<?= $siteURL; ?>/?search=<?php echo urlencode($search); ?>"
        }
        <?php else: ?>
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "<?= $siteURL; ?>/
        }
        <?php endif; ?>
      ]
    }
    </script>
    
    <!-- Ad Scripts (unchanged) -->
    <script type='text/javascript' src='//pl27875664.effectivegatecpm.com/84/83/93/848393a06a358b10af876c6a54c60926.js'></script>

    <!-- hiltop ads -->
     <meta name="ca7c5550a90d6c1c620fb0cbb0c213729a1d634d" content="ca7c5550a90d6c1c620fb0cbb0c213729a1d634d" />
     <meta name="referrer" content="no-referrer-when-downgrade" />
 

</head>
<body>
    <!-- Header/Navbar (unchanged) -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex flex-column" href="<?= $siteURL; ?>/">
                <h1 class="h4 mb-0 fw-bold">
                    <i class="bi bi-stars me-2"></i>AI Prompt Gallery
                </h1>
                <p class="small text-muted mb-0 d-none d-sm-block">Professional AI Art Prompts</p>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center">
                    <li class="nav-item">
                        <a class="nav-link <?php echo $currentPage === 'index.php' ? 'active' : ''; ?>" href="<?= $siteURL; ?>/">
                            <i class="bi bi-grid-3x3-gap me-1"></i>Browse
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $siteURL; ?>/#categories">
                            <i class="bi bi-folder me-1"></i>Categories
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $currentPage === 'instructions.php' ? 'active' : ''; ?>" href="<?= $siteURL; ?>/instructions">
                            <i class="bi bi-book me-1"></i>Instructions
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $currentPage === 'about.php' ? 'active' : ''; ?>" href="<?= $siteURL; ?>/about">
                            <i class="bi bi-info-circle me-1"></i>About
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo $currentPage === 'contact.php' ? 'active' : ''; ?>" href="<?= $siteURL; ?>/contact">
                            <i class="bi bi-envelope me-1"></i>Contact
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    
    <script>
        // Auto-close mobile menu when clicking a link
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                });
            });
        });
    </script>

    <!-- Ad Script advataica pop up -->
<script type="text/javascript" src="//data527.click/5a67f1001e95874b36be/5269193abe/?placementName=default"></script>