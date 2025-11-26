<?php
// prompt.php - Updated to use MongoDB with FIXED image display
session_start();

require_once 'models/Prompt.php';

// Get ID or slug from URL
$id = isset($_GET['id']) ? trim($_GET['id']) : '';
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

if (empty($id) && empty($slug)) {
    header('Location: index.php');
    exit;
}

$promptModel = new Prompt();

// Get prompt by ID or slug
$prompt = !empty($id) ? $promptModel->getById($id) : $promptModel->getBySlug($slug);

if (!$prompt) {
    header('Location: index.php');
    exit;
}

// Track view
$promptId = $prompt['_id']; // Already converted to string by convertToArray()
$viewKey = 'viewed_' . $promptId;

if (!isset($_SESSION[$viewKey])) {
    $_SESSION[$viewKey] = true;
    $promptModel->incrementViews($promptId);
    // Refresh prompt data
    $prompt = $promptModel->getById($promptId);
}

// Get all categories for header
$categories = $promptModel->getCategories();
sort($categories);

// Get prompt categories
$promptCategories = is_array($prompt['category']) ? $prompt['category'] : [$prompt['category']];

// Get related prompts
$relatedPrompts = [];
if (!empty($promptCategories)) {
    $allPrompts = $promptModel->getByCategory($promptCategories[0]);
    foreach ($allPrompts as $p) {
        if ($p['_id'] !== $promptId) {
            $relatedPrompts[] = $p;
            if (count($relatedPrompts) >= 3) break;
        }
    }
}

// Set SEO variables
$pageTitle = htmlspecialchars($prompt['title']) . " - AI Prompt | AI Prompt Gallery";
$pageDescription = htmlspecialchars(substr($prompt['prompt'], 0, 155)) . "...";
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$siteURL = $protocol . $_SERVER['HTTP_HOST'];
$baseURL = $siteURL;
$currentURL = $siteURL . $_SERVER['REQUEST_URI'];
$ogImage = !empty($prompt['image']) ? $siteURL . "/" . $prompt['image'] : $siteURL . "/og-image.jpg";

include 'header.php';
?>

<style>
/* Mobile-First Responsive Styles - FIXED IMAGE DISPLAY */
.prompt-detail-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

/* FIXED: Image container for full width display */
.prompt-image-container {
    position: relative;
    width: 100%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* FIXED: Image takes full width and maintains aspect ratio */
.prompt-image-container img {
    width: 100%;
    height: auto;
    max-height: 500px;
    display: block;
    object-fit: cover;
    /* Changed from contain to cover */
}

.prompt-content {
    padding: 1.25rem;
}

.prompt-text-box {
    background: #f8f9fa;
    border-left: 4px solid #0d6efd;
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
}

.copy-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
}

.stats-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    background: #f8f9fa;
    border-radius: 50px;
    font-size: 0.8rem;
    white-space: nowrap;
}

.related-card {
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
    display: block;
}

.related-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.breadcrumb {
    background: transparent;
    padding: 0.75rem 0;
    font-size: 0.875rem;
    overflow-x: auto;
    white-space: nowrap;
    flex-wrap: nowrap;
}

.breadcrumb-item {
    display: inline-block;
}

.ad-container {
    background: #f8f9fa;
    border: 1px dashed #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.ad-label {
    font-size: 0.7rem;
    color: #6c757d;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .prompt-content {
        padding: 2rem;
    }

    .prompt-text-box {
        padding: 1.5rem;
        font-size: 0.95rem;
    }

    /* FIXED: Larger max height for desktop */
    .prompt-image-container img {
        max-height: 600px;
    }

    .stats-badge {
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
    }
}

/* Desktop - Full size images */
@media (min-width: 992px) {
    .prompt-detail-container {
        border-radius: 15px;
    }

    /* FIXED: Even larger for desktop */
    .prompt-image-container img {
        max-height: 700px;
    }
}

/* Large Desktop - Maximum image size */
@media (min-width: 1200px) {
    .prompt-image-container img {
        max-height: 800px;
    }
}

/* Print styles */
@media print {

    .copy-overlay,
    .ad-container,
    .breadcrumb,
    .btn,
    nav,
    footer,
    .mobile-action-bar {
        display: none !important;
    }

    .prompt-detail-container {
        box-shadow: none;
        border: 1px solid #ddd;
    }

    .prompt-image-container img {
        max-height: none !important;
        page-break-inside: avoid;
    }
}

/* Mobile action buttons sticky footer */
@media (max-width: 767.98px) {
    .mobile-action-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 0.75rem;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        border-top: 1px solid #dee2e6;
    }

    body {
        padding-bottom: 80px;
        /* Space for fixed button */
    }
}

/* Image loading animation */
.prompt-image-container img {
    animation: fadeInImage 0.6s ease-in;
}

@keyframes fadeInImage {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Image zoom on hover (desktop only) */
@media (min-width: 992px) {
    .prompt-image-container {
        cursor: zoom-in;
    }

    .prompt-image-container:hover img {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }
}
</style>

<!-- Breadcrumb -->
<section class="py-2 py-md-3 bg-white border-bottom">
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 small">
                <li class="breadcrumb-item"><a href="<?php echo $baseURL; ?>/"><i class="bi bi-house-door"></i><span
                            class="d-none d-sm-inline ms-1">Home</span></a></li>
                <?php foreach ($promptCategories as $cat): ?>
                <li class="breadcrumb-item"><a
                        href="<?php echo $baseURL; ?>/?category=<?php echo urlencode($cat); ?>"><?php echo htmlspecialchars($cat); ?></a>
                </li>
                <?php endforeach; ?>
                <li class="breadcrumb-item active text-truncate" aria-current="page" style="max-width: 200px;">
                    <?php echo htmlspecialchars($prompt['title']); ?></li>
            </ol>
        </nav>
    </div>
</section>

<!-- Banner Ad -->
<section class="py-3 bg-light">
    <div class="container">
        <div class="text-center">
            <a href="https://hilltopads.com/?ref=341783" target="_blank" rel="noopener">
                <img src="//static.hilltopads.com/other/banners/pub/make_big_money/728x90.gif?v=1762006891"
                    alt="Advertisement" style="max-width: 100%; height: auto;">
            </a>
        </div>
    </div>
</section>

<!-- Prompt Detail -->
<section class="py-3 py-md-5">
    <div class="container">
        <div class="row">
            <div class="col-12 col-lg-10 col-xl-9 mx-auto">
                <div class="prompt-detail-container mb-3 mb-md-4">
                    <!-- FIXED: Image with full width display -->
                    <?php if (!empty($prompt['image'])): ?>
                    <div class="prompt-image-container" onclick="openImageModal(this)">
                        <img src="<?php echo htmlspecialchars($prompt['image']); ?>"
                            alt="<?php echo htmlspecialchars($prompt['title']); ?>" loading="eager"
                            onerror="this.parentElement.innerHTML='<div class=\'p-5 text-center text-muted\'><i class=\'bi bi-image fs-1\'></i><p class=\'mt-2\'>Image not found</p></div>'">
                    </div>
                    <?php endif; ?>

                    <!-- Content -->
                    <div class="prompt-content">
                        <!-- Title and Categories -->
                        <div class="mb-3 mb-md-4">
                            <h1 class="h2 h1-md fw-bold mb-3"><?php echo htmlspecialchars($prompt['title']); ?></h1>
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                <?php foreach ($promptCategories as $cat): ?>
                                <a href="<?php echo $baseURL; ?>/?category=<?php echo urlencode($cat); ?>"
                                    class="badge bg-primary text-decoration-none">
                                    <i class="bi bi-tag-fill me-1"></i><?php echo htmlspecialchars($cat); ?>
                                </a>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="d-flex flex-wrap gap-2 mb-3 mb-md-4">
                            <div class="stats-badge">
                                <i class="bi bi-eye-fill text-primary"></i>
                                <span><strong><?php echo isset($prompt['stats']['views']) ? $prompt['stats']['views'] : 0; ?></strong><span
                                        class="d-none d-sm-inline"> views</span></span>
                            </div>
                            <div class="stats-badge">
                                <i class="bi bi-clipboard-check text-success"></i>
                                <span><strong
                                        id="copyCount"><?php echo isset($prompt['stats']['copies']) ? $prompt['stats']['copies'] : 0; ?></strong><span
                                        class="d-none d-sm-inline"> copies</span></span>
                            </div>
                            <div class="stats-badge">
                                <i class="bi bi-laptop text-info"></i>
                                <span
                                    class="d-none d-sm-inline"><?php echo htmlspecialchars($prompt['platform'] ?? 'All Platforms'); ?></span>
                                <span class="d-sm-none">Platform</span>
                            </div>
                        </div>

                        <!-- Instruction Alert -->
                        <div class="alert alert-info mb-3 mb-md-4">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-lightbulb-fill me-2 mt-1 fs-5"></i>
                                <div class="small">
                                    <strong>How to use:</strong> Copy this prompt and upload your own photo to an AI
                                    platform like Gemini, Midjourney, or DALL-E.
                                    <a href="<?php echo $baseURL; ?>/instructions.php"
                                        class="alert-link d-block d-sm-inline mt-1 mt-sm-0">Learn more →</a>
                                </div>
                            </div>
                        </div>

                        <!-- Prompt Text -->
                        <div class="mb-3 mb-md-4">
                            <h3 class="h6 h5-md mb-2 mb-md-3">
                                <i class="bi bi-code-square me-2"></i>Full Prompt:
                            </h3>
                            <div class="prompt-text-box" id="promptText">
                                <?php echo nl2br(htmlspecialchars($prompt['prompt'])); ?>
                            </div>
                        </div>

                        <!-- Tags -->
                        <?php if (!empty($prompt['tags']) && is_array($prompt['tags'])): ?>
                        <div class="mb-3 mb-md-4">
                            <h3 class="h6 mb-2">
                                <i class="bi bi-tags me-2"></i>Tags:
                            </h3>
                            <div class="d-flex flex-wrap gap-2">
                                <?php foreach ($prompt['tags'] as $tag): ?>
                                <span
                                    class="badge bg-light text-dark border small">#<?php echo htmlspecialchars($tag); ?></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <?php endif; ?>

                        <!-- Metadata -->
                        <?php if (isset($prompt['created_at']) || isset($prompt['updated_at'])): ?>
                        <div class="mb-3 mb-md-4 text-muted small d-none d-md-block">
                            <?php if (isset($prompt['created_at'])): ?>
                            <span class="me-3"><i class="bi bi-calendar-plus me-1"></i> Created:
                                <?php echo date('M d, Y', strtotime($prompt['created_at'])); ?></span>
                            <?php endif; ?>
                            <?php if (isset($prompt['updated_at'])): ?>
                            <span><i class="bi bi-calendar-check me-1"></i> Updated:
                                <?php echo date('M d, Y', strtotime($prompt['updated_at'])); ?></span>
                            <?php endif; ?>
                        </div>
                        <?php endif; ?>

                        <!-- Desktop Action Buttons -->
                        <div class="d-none d-md-flex gap-2 flex-wrap justify-content-between align-items-center">
                            <button class="btn btn-primary btn-lg px-4 px-md-5" onclick="copyPrompt()">
                                <i class="bi bi-clipboard me-2"></i> Copy Prompt
                            </button>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary" onclick="window.print()" title="Print">
                                    <i class="bi bi-printer"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onclick="sharePrompt()" title="Share">
                                    <i class="bi bi-share"></i>
                                </button>
                                <a href="<?php echo $baseURL; ?>/" class="btn btn-outline-secondary"
                                    title="Back to Gallery">
                                    <i class="bi bi-arrow-left me-1 d-none d-lg-inline"></i>Back
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ad Placement -->
                <div class="ad-container mb-3 mb-md-4">
                    <div class="ad-label">Advertisement</div>
                    <div class="d-flex justify-content-center">
                        <script type="text/javascript">
                        atOptions = {
                            'key': '590e0e6bdb9033cd4d7e1e8ae32e1e52',
                            'format': 'iframe',
                            'height': 90,
                            'width': 728,
                            'params': {}
                        };
                        </script>
                        <script type="text/javascript"
                            src="//www.highperformanceformat.com/590e0e6bdb9033cd4d7e1e8ae32e1e52/invoke.js"></script>
                    </div>
                </div>

                <!-- Related Prompts -->
                <?php if (!empty($relatedPrompts)): ?>
                <div class="mt-4 mt-md-5">
                    <h2 class="h5 h4-md mb-3 mb-md-4">
                        <i class="bi bi-collection me-2"></i>Related Prompts
                    </h2>
                    <div class="row g-3 g-md-4">
                        <?php foreach ($relatedPrompts as $related): 
                            $relatedURL = $baseURL . '/prompt.php?id=' . urlencode($related['_id']) . '&slug=' . urlencode($related['slug']);
                        ?>
                        <div class="col-12 col-sm-6 col-lg-4">
                            <a href="<?php echo $relatedURL; ?>" class="related-card">
                                <div class="card h-100 shadow-sm border">
                                    <?php if (!empty($related['image'])): ?>
                                    <div style="height: 200px; overflow: hidden;">
                                        <img src="<?php echo htmlspecialchars($related['image']); ?>"
                                            class="card-img-top" style="width: 100%; height: 100%; object-fit: cover;"
                                            alt="<?php echo htmlspecialchars($related['title']); ?>" loading="lazy">
                                    </div>
                                    <?php endif; ?>
                                    <div class="card-body">
                                        <h5 class="card-title h6"><?php echo htmlspecialchars($related['title']); ?>
                                        </h5>
                                        <p class="card-text text-muted small mb-3">
                                            <?php echo htmlspecialchars(substr($related['prompt'], 0, 80)) . '...'; ?>
                                        </p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">
                                                <i
                                                    class="bi bi-eye me-1"></i><?php echo isset($related['stats']['views']) ? $related['stats']['views'] : 0; ?>
                                            </small>
                                            <small class="text-primary fw-semibold">View →</small>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Desktop Back Button -->
                <div class="text-center mt-4 mt-md-5 d-none d-md-block">
                    <a href="<?php echo $baseURL; ?>/" class="btn btn-outline-primary btn-lg px-5">
                        <i class="bi bi-grid-3x3-gap me-2"></i>Back to Gallery
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Mobile Sticky Action Bar -->
<div class="mobile-action-bar d-md-none">
    <div class="d-flex gap-2">
        <button class="btn btn-primary flex-grow-1" onclick="copyPrompt()">
            <i class="bi bi-clipboard me-1"></i> Copy Prompt
        </button>
        <button class="btn btn-outline-secondary" onclick="sharePrompt()">
            <i class="bi bi-share"></i>
        </button>
        <a href="<?php echo $baseURL; ?>/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i>
        </a>
    </div>
</div>

<!-- Image Modal for Full View (Optional) -->
<div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-transparent border-0">
            <div class="modal-body p-0 text-center">
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                    data-bs-dismiss="modal" aria-label="Close" style="z-index: 10;"></button>
                <img src="" id="modalImage" class="img-fluid rounded" alt="Full size image" style="max-height: 90vh;">
            </div>
        </div>
    </div>
</div>

<?php include 'footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
const promptText = <?php echo json_encode($prompt['prompt']); ?>;
const promptId = <?php echo json_encode($prompt['_id']); ?>;

function copyPrompt() {
    navigator.clipboard.writeText(promptText).then(() => {
        const btns = document.querySelectorAll(
            '.copy-overlay, .mobile-action-bar .btn-primary, .prompt-content .btn-primary');

        btns.forEach(btn => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Copied!';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-primary');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 2000);
        });

        // Track copy
        fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=track&id=${encodeURIComponent(promptId)}&type=copy`
            }).then(response => response.json())
            .then(data => {
                if (data.success && data.stats) {
                    document.getElementById('copyCount').textContent = data.stats.copies;
                }
            }).catch(err => console.error('Tracking error:', err));
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

function sharePrompt() {
    if (navigator.share) {
        navigator.share({
            title: <?php echo json_encode($prompt['title']); ?>,
            text: <?php echo json_encode(substr($prompt['prompt'], 0, 100)); ?>,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            alert('Unable to share. Please copy the URL manually.');
        });
    }
}

// Image modal for full view (desktop only)
function openImageModal(container) {
    if (window.innerWidth >= 992) {
        const imgSrc = container.querySelector('img').src;
        document.getElementById('modalImage').src = imgSrc;
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    }
}

// Smooth scroll for mobile
if (window.innerWidth < 768) {
    window.addEventListener('load', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Log page load
console.log('Prompt page loaded:', promptId);
</script>

<!-- Ad Script hiltop-video if remove -->
<script>
(function(mpwwn) {
    var d = document,
        s = d.createElement('script'),
        l = d.scripts[d.scripts.length - 1];
    s.settings = mpwwn || {};
    s.src =
        "\/\/livid-factor.com\/bLXQVos.dKGBl\/0qYNWCcn\/Weymw9budZTU\/lHkcPqTdYa2mOiT\/E-4JMoDQkHt\/NQjXYK5OM\/TsgrxsMBAR";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';
    l.parentNode.insertBefore(s, l);
})({})
</script>

</body>

</html>