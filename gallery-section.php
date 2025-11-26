<?php
// gallery-section.php - Prompt Gallery Section (Updated for MongoDB with AJAX sorting)
// This file should be included in index.php

if (!isset($paginatedPrompts)) {
    die('Error: This file should be included in index.php');
}

// Get protocol for URLs
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$baseURL = $protocol . $_SERVER['HTTP_HOST'];

// Get current sort parameter
$currentSort = isset($_GET['sort']) ? $_GET['sort'] : 'latest';

// DEBUG: Log what we received
error_log("Gallery Section - Total paginated prompts: " . count($paginatedPrompts));
error_log("Gallery Section - Offset: " . $offset);
error_log("Gallery Section - Total prompts: " . $totalPrompts);
error_log("Gallery Section - Sort by: " . $currentSort);
?>

<!-- Prompt Gallery -->
<section class="py-5" id="gallery-section">
    <div class="container">
        <?php if (empty($paginatedPrompts)): ?>
            <!-- No Results Found -->
            <div class="text-center p-5 bg-white rounded-3 shadow-sm">
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h2 class="h3 mb-3">No prompts found</h2>
                <p class="text-muted mb-4">
                    <?php if (!empty($search)): ?>
                        No results found for "<?php echo htmlspecialchars($search); ?>". Try a different search term.
                    <?php elseif ($category !== 'all'): ?>
                        No prompts found in the "<?php echo htmlspecialchars($category); ?>" category.
                    <?php else: ?>
                        No prompts available. Please check back later or contact the administrator.
                    <?php endif; ?>
                </p>
                <div class="d-flex gap-2 justify-content-center">
                    <a href="index.php" class="btn btn-primary px-4 py-2">
                        <i class="bi bi-house me-2"></i>View All Prompts
                    </a>
                    <?php if (!empty($search) || $category !== 'all'): ?>
                    <a href="index.php" class="btn btn-outline-secondary px-4 py-2">
                        <i class="bi bi-x-circle me-2"></i>Clear Filters
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        <?php else: ?>
            <!-- Results Header -->
            <div class="mb-4" id="gallery-header">
                <div class="row align-items-center">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <h2 class="h2 mb-2">
                            <?php 
                            if ($category !== 'all') {
                                echo '<i class="bi bi-folder me-2"></i>' . htmlspecialchars($category) . ' Prompts';
                            } elseif (!empty($search)) {
                                echo '<i class="bi bi-search me-2"></i>Search Results for "' . htmlspecialchars($search) . '"';
                            } else {
                                echo '<i class="bi bi-grid-3x3-gap me-2"></i>All Prompts';
                            }
                            ?>
                        </h2>
                        <p class="text-muted mb-0">
                            <i class="bi bi-info-circle me-1"></i>
                            Showing <?php echo $offset + 1; ?>-<?php echo min($offset + $prompts_per_page, $totalPrompts); ?> of <?php echo $totalPrompts; ?> prompts
                        </p>
                    </div>
                    
                    <!-- Sort Filter -->
                    <div class="col-md-6">
                        <div class="d-flex justify-content-md-end gap-2">
                            <span class="text-muted align-self-center me-2 d-none d-sm-inline">
                                <i class="bi bi-sort-down me-1"></i>Sort by:
                            </span>
                            <button onclick="sortGallery('latest')" 
                                    class="btn btn-sm <?php echo $currentSort === 'latest' ? 'btn-primary' : 'btn-outline-primary'; ?> rounded-pill sort-btn" 
                                    data-sort="latest">
                                <i class="bi bi-clock-history me-1"></i>
                                <span class="d-none d-sm-inline">Latest</span>
                                <span class="d-inline d-sm-none">New</span>
                            </button>
                            <button onclick="sortGallery('views')" 
                                    class="btn btn-sm <?php echo $currentSort === 'views' ? 'btn-primary' : 'btn-outline-primary'; ?> rounded-pill sort-btn" 
                                    data-sort="views">
                                <i class="bi bi-eye-fill me-1"></i>
                                <span class="d-none d-sm-inline">Most Viewed</span>
                                <span class="d-inline d-sm-none">Views</span>
                            </button>
                            <button onclick="sortGallery('copies')" 
                                    class="btn btn-sm <?php echo $currentSort === 'copies' ? 'btn-primary' : 'btn-outline-primary'; ?> rounded-pill sort-btn" 
                                    data-sort="copies">
                                <i class="bi bi-clipboard-check me-1"></i>
                                <span class="d-none d-sm-inline">Most Copied</span>
                                <span class="d-inline d-sm-none">Copies</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading Overlay -->
            <div id="gallery-loading" class="d-none">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-3">Loading prompts...</p>
                </div>
            </div>

            <!-- Prompts Grid -->
            <div class="row g-4" id="gallery-grid">
                <?php 
                $displayCount = 0;
                foreach ($paginatedPrompts as $index => $prompt): 
                    // MongoDB ObjectId handling - already converted to string by Prompt model
                    $promptID = $prompt['_id'] ?? ($prompt['id'] ?? '');
                    $promptSlug = $prompt['slug'] ?? '';
                    $promptTitle = $prompt['title'] ?? '';
                    $promptImage = !empty($prompt['image']) ? $prompt['image'] : '';
                    $promptText = $prompt['prompt'] ?? '';
                    
                    // Skip if essential data is missing
                    if (empty($promptID) || empty($promptSlug) || empty($promptTitle) || empty($promptText)) {
                        error_log("Gallery: Skipping incomplete prompt at index $index - ID: $promptID, Slug: $promptSlug, Title: $promptTitle");
                        continue;
                    }
                    
                    // Generate URL with ID and slug
                    $promptURL = $baseURL . '/prompt.php?id=' . urlencode($promptID) . '&slug=' . urlencode($promptSlug);
                    
                    // Increment display counter
                    $displayCount++;
                ?>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card prompt-card h-100 shadow-sm border position-relative">
                        <!-- Instruction badge in top-left corner -->
                        <a href="<?php echo $baseURL; ?>/instructions.php" 
                           class="position-absolute top-0 start-0 m-2 text-decoration-none" 
                           style="z-index: 10;" 
                           data-bs-toggle="tooltip" 
                           data-bs-placement="right" 
                           title="Learn how to use this prompt with your photos">
                            <span class="badge bg-info text-white rounded-circle p-2">
                                <i class="bi bi-question-circle-fill"></i>
                            </span>
                        </a>
                        
                        <!-- Image -->
                        <div class="card-img-container">
                            <?php if ($promptImage): ?>
                                <img src="<?php echo htmlspecialchars($promptImage); ?>" 
                                     class="card-img-top"
                                     alt="<?php echo htmlspecialchars($promptTitle); ?>"
                                     loading="lazy"
                                     onerror="this.parentElement.innerHTML='<div class=\'d-flex align-items-center justify-content-center bg-light\' style=\'min-height: 200px;\'><i class=\'bi bi-image text-muted\' style=\'font-size: 3rem;\'></i></div>'">
                            <?php else: ?>
                                <div class="d-flex align-items-center justify-content-center bg-light" style="min-height: 200px;">
                                    <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                                </div>
                            <?php endif; ?>
                            
                            <!-- Display categories -->
                            <div class="position-absolute top-0 end-0 m-2" style="z-index: 5;">
                                <?php 
                                $promptCategories = ['General']; // Default
                                if (isset($prompt['category'])) {
                                    if (is_array($prompt['category'])) {
                                        $promptCategories = $prompt['category'];
                                    } elseif (is_string($prompt['category']) && !empty($prompt['category'])) {
                                        $promptCategories = [$prompt['category']];
                                    }
                                }
                                    
                                foreach (array_slice($promptCategories, 0, 2) as $cat): 
                                ?>
                                    <a href="<?php echo $baseURL; ?>/?category=<?php echo urlencode($cat); ?>" 
                                       class="badge bg-white text-primary shadow-sm mb-1 d-block text-decoration-none"
                                       style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        <?php echo htmlspecialchars($cat); ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="card-body d-flex flex-column">
                            <h3 class="h5 card-title mb-3" style="min-height: 48px;">
                                <?php echo htmlspecialchars($promptTitle); ?>
                            </h3>
                            
                            <div class="prompt-text mb-3 small" style="min-height: 60px;">
                                <?php 
                                $displayText = strip_tags($promptText);
                                if (strlen($displayText) > 150) {
                                    echo htmlspecialchars(substr($displayText, 0, 150)) . '...';
                                } else {
                                    echo htmlspecialchars($displayText);
                                }
                                ?>
                            </div>

                            <?php if (!empty($prompt['tags']) && is_array($prompt['tags'])): ?>
                            <div class="mb-3" style="min-height: 30px;">
                                <?php foreach (array_slice($prompt['tags'], 0, 4) as $tag): ?>
                                    <span class="badge bg-light text-primary tag-badge me-1 mb-1">
                                        #<?php echo htmlspecialchars($tag); ?>
                                    </span>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>

                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <small class="text-muted">
                                        <i class="bi bi-laptop"></i>
                                        <?php echo !empty($prompt['platform']) ? htmlspecialchars($prompt['platform']) : 'All Platforms'; ?>
                                    </small>
                                    
                                    <div>
                                        <span class="badge bg-primary rounded-pill views-count" data-id="<?php echo htmlspecialchars($promptID); ?>" title="Views">
                                            <i class="bi bi-eye-fill me-1"></i>
                                            <?php 
                                            $views = 0;
                                            if (isset($prompt['stats']) && is_array($prompt['stats'])) {
                                                $views = isset($prompt['stats']['views']) && is_numeric($prompt['stats']['views']) ? $prompt['stats']['views'] : 0;
                                            }
                                            echo htmlspecialchars($views); 
                                            ?>
                                        </span>
                                        <span class="badge bg-success rounded-pill copies-count" data-id="<?php echo htmlspecialchars($promptID); ?>" title="Copies">
                                            <i class="bi bi-clipboard-check me-1"></i>
                                            <?php 
                                            $copies = 0;
                                            if (isset($prompt['stats']) && is_array($prompt['stats'])) {
                                                $copies = isset($prompt['stats']['copies']) && is_numeric($prompt['stats']['copies']) ? $prompt['stats']['copies'] : 0;
                                            }
                                            echo htmlspecialchars($copies); 
                                            ?>
                                        </span>
                                    </div>
                                </div>

                                <div class="d-grid gap-2">
                                    <!-- FIXED: Pass promptID correctly to copyPrompt() -->
                                    <button class="btn btn-primary btn-sm" 
                                            onclick="copyPrompt('<?php echo htmlspecialchars($promptID, ENT_QUOTES); ?>', this)"
                                            title="Copy prompt to clipboard">
                                        <i class="bi bi-clipboard me-2"></i> Copy Prompt
                                    </button>
                                    <a href="<?php echo htmlspecialchars($promptURL); ?>" 
                                       class="btn btn-outline-primary btn-sm w-100"
                                       title="View full prompt details">
                                        <i class="bi bi-eye me-2"></i>View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <?php 
                // Add banner ad after every 3rd prompt
                if ($displayCount % 3 === 0 && $displayCount < count($paginatedPrompts)): 
                ?>
                <!-- Ad Banner -->
                <div class="col-12">
                    <div class="alert alert-light border shadow-sm" role="alert">
                        <div class="text-center mb-2">
                            <small class="text-muted text-uppercase">Advertisement</small>
                        </div>
                        <div class="d-flex justify-content-center">
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : '590e0e6bdb9033cd4d7e1e8ae32e1e52',
                                    'format' : 'iframe',
                                    'height' : 90,
                                    'width' : 728,
                                    'params' : {}
                                };
                            </script>
                            <script type="text/javascript" src="//www.highperformanceformat.com/590e0e6bdb9033cd4d7e1e8ae32e1e52/invoke.js"></script>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php endforeach; ?>
            </div>

            <?php if ($displayCount === 0): ?>
            <!-- All prompts were skipped due to incomplete data -->
            <div class="text-center p-5 bg-white rounded-3 shadow-sm mt-4">
                <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                <h2 class="h3 mb-3">Data Error</h2>
                <p class="text-muted mb-4">
                    The prompts on this page have incomplete data. Please contact the administrator.
                </p>
                <a href="index.php" class="btn btn-primary px-4 py-2">
                    <i class="bi bi-arrow-left me-2"></i>Go Back
                </a>
            </div>
            <?php endif; ?>

            <!-- WordPress-style Pagination -->
            <?php if ($total_pages > 1 && $displayCount > 0): ?>
            <nav aria-label="Prompt pagination" class="mt-5" id="gallery-pagination">
                <ul class="pagination justify-content-center flex-wrap">
                    <!-- Previous Page -->
                    <?php if ($current_page > 1): ?>
                    <li class="page-item">
                        <a class="page-link" href="<?php echo buildQueryString($current_page - 1, $category, $search, $currentSort); ?>" aria-label="Previous">
                            <span aria-hidden="true"><i class="bi bi-chevron-left"></i> Previous</span>
                        </a>
                    </li>
                    <?php else: ?>
                    <li class="page-item disabled">
                        <span class="page-link"><i class="bi bi-chevron-left"></i> Previous</span>
                    </li>
                    <?php endif; ?>

                    <!-- Page Numbers -->
                    <?php
                    // Show max 5 page numbers at a time
                    $range = 2;
                    $start_page = max(1, $current_page - $range);
                    $end_page = min($total_pages, $current_page + $range);
                    
                    if ($start_page > 1) {
                        echo '<li class="page-item"><a class="page-link" href="' . buildQueryString(1, $category, $search, $currentSort) . '">1</a></li>';
                        if ($start_page > 2) {
                            echo '<li class="page-item disabled"><span class="page-link">...</span></li>';
                        }
                    }
                    
                    for ($i = $start_page; $i <= $end_page; $i++):
                    ?>
                        <li class="page-item <?php echo $i === $current_page ? 'active' : ''; ?>">
                            <a class="page-link" href="<?php echo buildQueryString($i, $category, $search, $currentSort); ?>">
                                <?php echo $i; ?>
                            </a>
                        </li>
                    <?php
                    endfor;
                    
                    if ($end_page < $total_pages) {
                        if ($end_page < $total_pages - 1) {
                            echo '<li class="page-item disabled"><span class="page-link">...</span></li>';
                        }
                        echo '<li class="page-item"><a class="page-link" href="' . buildQueryString($total_pages, $category, $search, $currentSort) . '">' . $total_pages . '</a></li>';
                    }
                    ?>

                    <!-- Next Page -->
                    <?php if ($current_page < $total_pages): ?>
                    <li class="page-item">
                        <a class="page-link" href="<?php echo buildQueryString($current_page + 1, $category, $search, $currentSort); ?>" aria-label="Next">
                            <span aria-hidden="true">Next <i class="bi bi-chevron-right"></i></span>
                        </a>
                    </li>
                    <?php else: ?>
                    <li class="page-item disabled">
                        <span class="page-link">Next <i class="bi bi-chevron-right"></i></span>
                    </li>
                    <?php endif; ?>
                </ul>
            </nav>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</section>

<style>
/* Prompt Card Styles */
.prompt-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    border-radius: 12px;
}

.prompt-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15) !important;
    border-color: #0d6efd !important;
}

.card-img-container {
    position: relative;
    min-height: 200px;
    max-height: 280px;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-img-container img {
    width: 100%;
    height: auto;
    max-height: 280px;
    object-fit: contain;
    transition: transform 0.4s ease;
    display: block;
}

.prompt-card:hover .card-img-container img {
    transform: scale(1.05);
}

.prompt-text {
    color: #6c757d;
    line-height: 1.6;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-word;
}

.tag-badge {
    font-size: 0.7rem;
    font-weight: 500;
    border: 1px solid #e0e0e0;
    padding: 0.25rem 0.5rem;
}

.views-count, .copies-count {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
}

/* Loading overlay */
#gallery-loading {
    position: relative;
    min-height: 300px;
}

.fade-out {
    opacity: 0.3;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-img-container {
        min-height: 180px;
        max-height: 240px;
    }
    
    .card-img-container img {
        max-height: 240px;
    }
    
    .prompt-card {
        margin-bottom: 1rem;
    }
    
    .card-title {
        font-size: 1rem;
    }
}

@media (max-width: 576px) {
    .card-img-container {
        min-height: 160px;
        max-height: 200px;
    }
    
    .card-img-container img {
        max-height: 200px;
    }
    
    .prompt-text {
        font-size: 0.85rem;
    }
}

/* Pagination styles */
.pagination {
    gap: 5px;
}

.page-link {
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    color: #0d6efd;
    border: 1px solid #dee2e6;
    transition: all 0.3s ease;
    font-weight: 500;
}

.page-link:hover {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
    transform: translateY(-2px);
}

.page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.page-item.disabled .page-link {
    background-color: #f8f9fa;
    border-color: #dee2e6;
    color: #6c757d;
}

/* Loading animation for images */
.card-img-container img {
    opacity: 0;
    animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

/* Button animations */
.btn {
    transition: all 0.3s ease;
}

.btn:active {
    transform: scale(0.95);
}

/* Copy button hover effect */
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}
</style>

<script>
// AJAX Sort Gallery Function
function sortGallery(sortBy) {
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const search = urlParams.get('search') || '';
    
    // Show loading state
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryLoading = document.getElementById('gallery-loading');
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    galleryGrid.classList.add('fade-out');
    galleryLoading.classList.remove('d-none');
    
    // Disable sort buttons
    sortButtons.forEach(btn => btn.disabled = true);
    
    // Build new URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('sort', sortBy);
    newUrl.searchParams.set('page', 1); // Reset to page 1
    
    // Fetch new content
    fetch(newUrl.href, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(html => {
        // Parse the response
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract gallery section
        const newGallerySection = doc.querySelector('#gallery-section');
        
        if (newGallerySection) {
            // Smooth scroll to gallery
            document.getElementById('gallery-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Update gallery after scroll
            setTimeout(() => {
                document.getElementById('gallery-section').innerHTML = newGallerySection.innerHTML;
                
                // Update URL without reload
                window.history.pushState({}, '', newUrl.href);
                
                // Re-initialize tooltips
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
                
                // Hide loading
                galleryLoading.classList.add('d-none');
                galleryGrid.classList.remove('fade-out');
                
                // Re-enable buttons
                sortButtons.forEach(btn => btn.disabled = false);
                
                console.log('Gallery sorted by:', sortBy);
            }, 300);
        }
    })
    .catch(error => {
        console.error('Error sorting gallery:', error);
        // Fallback: reload page
        window.location.href = newUrl.href;
    });
}

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Log gallery statistics
    console.log('Gallery loaded with', document.querySelectorAll('.prompt-card').length, 'prompts');
});
</script>

<!-- Ad Script hiltop-video if remove -->
<script>
(function(mpwwn){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = mpwwn || {};
s.src = "\/\/livid-factor.com\/bLXQVos.dKGBl\/0qYNWCcn\/Weymw9budZTU\/lHkcPqTdYa2mOiT\/E-4JMoDQkHt\/NQjXYK5OM\/TsgrxsMBAR";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>