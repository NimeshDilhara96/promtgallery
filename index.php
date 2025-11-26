<?php
// index.php - Updated to use MongoDB with sorting options
session_start();

require_once 'models/Prompt.php';

$promptModel = new Prompt();

// Check if it's a tracking action via AJAX
if (isset($_POST['action']) && $_POST['action'] === 'track') {
    header('Content-Type: application/json');
    
    $id = $_POST['id'] ?? '';
    $type = $_POST['type'] ?? '';
    
    if (empty($id) || empty($type)) {
        echo json_encode(['success' => false, 'error' => 'Missing parameters']);
        exit;
    }
    
    if ($type === 'copy') {
        $promptModel->incrementCopies($id);
    }
    
    $prompt = $promptModel->getById($id);
    
    echo json_encode([
        'success' => true,
        'stats' => $prompt['stats'] ?? ['views' => 0, 'copies' => 0]
    ]);
    exit;
}

// Get filter and search parameters
$category = isset($_GET['category']) ? trim($_GET['category']) : 'all';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$sortBy = isset($_GET['sort']) ? trim($_GET['sort']) : 'latest'; // New: sort parameter

// Pagination settings
$prompts_per_page = 12;
$current_page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;

// Get all categories
$categories = $promptModel->getCategories();
sort($categories);

// Determine sort options based on selection
switch ($sortBy) {
    case 'views':
        $sortOptions = ['sort' => ['stats.views' => -1, 'created_at' => -1]];
        break;
    case 'copies':
        $sortOptions = ['sort' => ['stats.copies' => -1, 'created_at' => -1]];
        break;
    case 'latest':
    default:
        $sortOptions = ['sort' => ['created_at' => -1]];
        break;
}

// Filter prompts with sorting
if ($category !== 'all') {
    $filteredPrompts = $promptModel->getByCategory($category, $sortOptions);
} elseif (!empty($search)) {
    $filteredPrompts = $promptModel->search($search, $sortOptions);
} else {
    $filteredPrompts = $promptModel->getAll([], $sortOptions);
}

// Calculate pagination
$totalPrompts = count($filteredPrompts);
$total_pages = ceil($totalPrompts / $prompts_per_page);
$current_page = min($current_page, max(1, $total_pages));
$offset = ($current_page - 1) * $prompts_per_page;

// Get paginated prompts
$paginatedPrompts = array_slice($filteredPrompts, $offset, $prompts_per_page);

// For stats display - use all prompts
$prompts = $filteredPrompts;

// Helper function for query strings
function buildQueryString($page, $category, $search, $sortBy = 'latest') {
    $params = ['page' => $page];
    if ($category !== 'all') $params['category'] = $category;
    if (!empty($search)) $params['search'] = $search;
    if ($sortBy !== 'latest') $params['sort'] = $sortBy;
    return 'index.php?' . http_build_query($params);
}

// Include header
include 'header.php';
?>

    <!-- Hero Section -->
    <section class="hero-section bg-white py-5">
        <div class="container py-4">
            <div class="row justify-content-center text-center">
                <div class="col-lg-10 col-xl-9">
                    <!-- Main Heading with Animation -->
                    <div class="hero-content mb-4">
                        <span class="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-4 fs-6 rounded-pill">
                            <i class="bi bi-stars me-2"></i> AI-Powered Creativity
                        </span>
                        <h1 class="display-2 fw-bold mb-4 text-dark">
                            Create Stunning <span class="text-primary">AI Art</span>
                        </h1>
                        <p class="lead text-muted mb-5 fs-5 px-lg-5 mx-auto" style="max-width: 700px;">
                            Browse our curated collection of high-quality prompts. Copy, customize, and create amazing AI-generated images with just one click.
                        </p>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="row justify-content-center g-3 mt-4">
                        <div class="col-lg-3 col-md-4 col-sm-4 col-6">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-body text-center p-3">
                                    <div class="mb-2">
                                        <i class="bi bi-collection-fill text-primary" style="font-size: 2rem;"></i>
                                    </div>
                                    <h3 class="h4 text-primary fw-bold mb-1"><?php echo $totalPrompts; ?>+</h3>
                                    <p class="text-muted mb-0 small fw-semibold">AI Prompts</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-6">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-body text-center p-3">
                                    <div class="mb-2">
                                        <i class="bi bi-grid-3x3-gap-fill text-primary" style="font-size: 2rem;"></i>
                                    </div>
                                    <h3 class="h4 text-primary fw-bold mb-1"><?php echo count($categories); ?>+</h3>
                                    <p class="text-muted mb-0 small fw-semibold">Categories</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-6">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-body text-center p-3">
                                    <div class="mb-2">
                                        <i class="bi bi-gift-fill text-primary" style="font-size: 2rem;"></i>
                                    </div>
                                    <h3 class="h4 text-primary fw-bold mb-1">100%</h3>
                                    <p class="text-muted mb-0 small fw-semibold">Free Forever</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Search Section - Separate from Hero -->
    <section class="search-section py-4 bg-white border-bottom">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <form method="GET" action="index.php" class="search-form">
                        <div class="search-wrapper">
                            <div class="search-icon">
                                <i class="bi bi-search"></i>
                            </div>
                            <input 
                                type="text" 
                                name="search" 
                                class="search-input" 
                                placeholder="Search by keyword, category, or style..."
                                value="<?php echo htmlspecialchars($search); ?>"
                            >
                            <?php if (!empty($search)): ?>
                                <a href="index.php" class="search-clear" title="Clear search">
                                    <i class="bi bi-x-circle-fill"></i>
                                </a>
                            <?php endif; ?>
                            <button type="submit" class="search-button">
                                <i class="bi bi-search me-2"></i>
                                <span class="d-none d-sm-inline">Search</span>
                                <span class="d-inline d-sm-none">Go</span>
                            </button>
                        </div>
                    </form>
                    
                    <!-- Filter Categories - Under Search Bar -->
                    <div class="text-center mt-4">
                        <h5 class="h6 fw-bold mb-3 text-muted">
                            <i class="bi bi-funnel-fill me-2"></i>
                            Filter by Category
                        </h5>
                        <div class="d-flex flex-wrap justify-content-center gap-2">
                            <a href="index.php?category=all<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?><?php echo $sortBy !== 'latest' ? '&sort=' . $sortBy : ''; ?>" 
                               class="btn btn-sm btn-outline-primary rounded-pill <?php echo $category === 'all' ? 'active' : ''; ?>">
                                <i class="bi bi-grid-fill me-1"></i> All Prompts
                            </a>
                            <?php if (!empty($categories)): ?>
                                <?php foreach ($categories as $cat): ?>
                                <a href="index.php?category=<?php echo urlencode($cat); ?><?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?><?php echo $sortBy !== 'latest' ? '&sort=' . $sortBy : ''; ?>" 
                                   class="btn btn-sm btn-outline-primary rounded-pill <?php echo $category === $cat ? 'active' : ''; ?>">
                                    <?php echo htmlspecialchars($cat); ?>
                                </a>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <p class="text-muted small">No categories available</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- New: How to Use Banner -->
    <div class="container mt-4 mb-3">
        <div class="alert alert-info d-flex align-items-center shadow-sm border-0 rounded-3" role="alert">
            <div class="alert-icon me-3">
                <i class="bi bi-info-circle-fill fs-3"></i>
            </div>
            <div class="flex-grow-1">
                <h5 class="alert-heading mb-1 fw-bold">New to AI Prompts?</h5>
                <p class="mb-0 small">Learn how to use these prompts with your own photos on Midjourney, DALL-E, and more!</p>
            </div>
            <a href="instructions.php" class="btn btn-primary btn-sm ms-3 flex-shrink-0">
                <i class="bi bi-book me-1"></i> 
                <span class="d-none d-sm-inline">View Instructions</span>
                <span class="d-inline d-sm-none">Learn</span>
            </a>
        </div>
    </div>

    <!-- Ad placement after filters -->
    <div class="container">
        <div class="ad-container">
            <div class="ad-label">Advertisement</div>
            <div class="d-flex justify-content-center">
                <ins style="width: 300px;height:250px" data-width="300" data-height="250" class="dcbba79c2e2" data-domain="//data527.click" data-affquery="/7b490ec51ed546025bfd/cbba79c2e2/?placementName=top_header"><script src="//data527.click/js/responsive.js" async></script></ins>
            </div>
        </div>
    </div>

    <?php include 'gallery-section.php'; ?>

    <!-- Ad placement before the about section -->
    <div class="container">
        <div class="ad-container">
            <div class="ad-label">Advertisement</div>
            <div class="d-flex justify-content-center">
                <!-- Mobile ad (320x50) - show on all screens now -->
                <div>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : '128442c3c5aa96a6ac33260860f38c94',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/128442c3c5aa96a6ac33260860f38c94/invoke.js"></script>
                </div>
            </div>
        </div>
    </div>

    <!-- Call to Action for About Page -->
    <section class="py-5 bg-light">
        <div class="container text-center">
            <h2 class="h3 mb-3">Want to Learn More?</h2>
            <p class="lead text-muted mb-4">Discover how AI Prompt Gallery can help you create stunning AI art</p>
            <a href="about.php" class="btn btn-primary btn-lg px-5">
                <i class="bi bi-info-circle me-2"></i> About Us
            </a>
        </div>
    </section>

<?php
// Include footer
include 'footer.php';
?>

<script>
    const allPrompts = <?php echo json_encode(array_values($filteredPrompts)); ?>;
    let promptModal;
    
    document.addEventListener('DOMContentLoaded', function() {
        promptModal = new bootstrap.Modal(document.getElementById('promptModal'));
        
        // Initialize Bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
        
        // Debug: Log first prompt to check structure
        if (allPrompts.length > 0) {
            console.log('First prompt structure:', allPrompts[0]);
            console.log('ID field:', allPrompts[0]._id || allPrompts[0].id);
            console.log('Total prompts loaded:', allPrompts.length);
            console.log('Sort by:', '<?php echo $sortBy; ?>');
        }
    });
    
    // Track an action (view or copy)
    function trackAction(id, type) {
        const storageKey = `prompt_${type}_${id}`;
        
        if (localStorage.getItem(storageKey)) {
            return Promise.resolve(false);
        }
        
        localStorage.setItem(storageKey, Date.now());
        
        return fetch('index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=track&id=${encodeURIComponent(id)}&type=${type}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.stats) {
                const viewCounters = document.querySelectorAll(`.views-count[data-id="${id}"]`);
                const copyCounters = document.querySelectorAll(`.copies-count[data-id="${id}"]`);
                
                viewCounters.forEach(el => {
                    const icon = el.querySelector('.bi');
                    el.innerHTML = '';
                    el.appendChild(icon.cloneNode(true));
                    el.appendChild(document.createTextNode(` ${data.stats.views}`));
                });
                
                copyCounters.forEach(el => {
                    const icon = el.querySelector('.bi');
                    el.innerHTML = '';
                    el.appendChild(icon.cloneNode(true));
                    el.appendChild(document.createTextNode(` ${data.stats.copies}`));
                });
                
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error('Error tracking action:', error);
            return false;
        });
    }

    function copyPrompt(promptId, btn) {
        // FIXED: Search by _id instead of id
        const prompt = allPrompts.find(p => p._id === promptId || p.id === promptId);
        
        console.log('Copying prompt ID:', promptId);
        console.log('Found prompt:', prompt);
        
        if (!prompt) {
            console.error('Prompt not found. Available IDs:', allPrompts.map(p => p._id || p.id));
            alert('Prompt not found: ' + promptId);
            return;
        }
        
        const text = prompt.prompt;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Copied!';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-primary');
            
            // Use _id for tracking
            trackAction(prompt._id || prompt.id, 'copy');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 2500);
        }).catch((err) => {
            console.error('Copy failed:', err);
            alert('Failed to copy. Please try again.');
        });
    }

    function viewDetails(promptId) {
        // FIXED: Search by _id instead of id
        const prompt = allPrompts.find(p => p._id === promptId || p.id === promptId);
        
        if (!prompt) {
            console.error('Prompt not found:', promptId);
            alert('Prompt not found');
            return;
        }
        
        const modalBody = document.getElementById('modalBody');
        
        const views = prompt.stats?.views || 0;
        const copies = prompt.stats?.copies || 0;
        const promptIdForTracking = prompt._id || prompt.id;
        
        // Handle categories (array or string)
        const categories = Array.isArray(prompt.category) ? prompt.category : [prompt.category];
        const categoryBadges = categories.map(cat => `<span class="badge bg-primary mb-3 me-1">${escapeHtml(cat)}</span>`).join('');
        
        modalBody.innerHTML = `
            <div>
                ${prompt.image ? `<img src="${escapeHtml(prompt.image)}" alt="${escapeHtml(prompt.title)}" class="img-fluid rounded mb-4">` : ''}
                <h2 class="h3 mb-2">${escapeHtml(prompt.title)}</h2>
                ${categoryBadges}
                
                <div class="mb-3">
                    <span class="badge bg-primary rounded-pill views-count" data-id="${promptIdForTracking}">
                        <i class="bi bi-eye-fill me-1"></i>
                        ${views} views
                    </span>
                    <span class="badge bg-danger rounded-pill copies-count" data-id="${promptIdForTracking}">
                        <i class="bi bi-clipboard-check me-1"></i>
                        ${copies} copies
                    </span>
                </div>
                
                <div class="alert alert-info" role="alert">
                    <div class="d-flex align-items-start">
                        <i class="bi bi-lightbulb-fill me-2 mt-1"></i>
                        <div>
                            <strong>Pro Tip:</strong> Upload your own photo to an AI platform, then use this prompt to transform it! 
                            <a href="instructions.php" class="alert-link">Learn how →</a>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h5 class="mb-2">Full Prompt</h5>
                    <div class="bg-light p-3 rounded small font-monospace">${escapeHtml(prompt.prompt)}</div>
                </div>
                
                ${prompt.tags && prompt.tags.length ? `
                <div class="mb-4">
                    <h5 class="mb-2">Tags</h5>
                    <div>
                        ${prompt.tags.map(tag => `<span class="badge bg-light text-primary me-1 mb-1">#${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="mb-4">
                    <p><strong>Best for:</strong> ${escapeHtml(prompt.platform || 'All AI platforms')}</p>
                </div>
                
                <button class="btn btn-primary w-100 py-2" onclick="copyFromModal('${promptIdForTracking}')">
                    <i class="bi bi-clipboard me-2"></i> Copy Full Prompt
                </button>
            </div>
        `;
        
        promptModal.show();
        trackAction(promptIdForTracking, 'view');
    }
    
    function copyFromModal(promptId) {
        // FIXED: Search by _id instead of id
        const prompt = allPrompts.find(p => p._id === promptId || p.id === promptId);
        if (!prompt) return;
        
        navigator.clipboard.writeText(prompt.prompt).then(() => {
            const btn = document.querySelector('.modal-body .btn');
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Copied!';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-primary');
            
            trackAction(prompt._id || prompt.id, 'copy');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-clipboard me-2"></i> Copy Full Prompt';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 2500);
        }).catch(() => {
            alert('Failed to copy. Please try again.');
        });
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
</script>
</body>
</html>

