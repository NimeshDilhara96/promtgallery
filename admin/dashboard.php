<?php
// dashboard.php - Updated to use MongoDB with newest first
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

require_once '../models/Prompt.php';

$promptModel = new Prompt();

// Get all prompts sorted by created_at descending (newest first)
$prompts = $promptModel->getAll([], ['sort' => ['created_at' => -1]]);

$categories = $promptModel->getCategories();

// Calculate total stats
$totalViews = 0;
$totalCopies = 0;
foreach ($prompts as $prompt) {
    $totalViews += isset($prompt['stats']['views']) ? $prompt['stats']['views'] : 0;
    $totalCopies += isset($prompt['stats']['copies']) ? $prompt['stats']['copies'] : 0;
}

$totalPrompts = count($prompts);
$totalCategories = count($categories);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AI Prompt Gallery</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: #f8f9fa;
        }
        .stat-card {
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .table-actions {
            white-space: nowrap;
        }
        .prompt-image-thumb {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }
        .new-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #28a745;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
        }
        .prompt-row-new {
            background-color: #f0f9ff !important;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="dashboard.php">
                <i class="bi bi-shield-lock"></i> Admin Panel
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="../index.php" target="_blank">
                            <i class="bi bi-box-arrow-up-right"></i> View Site
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="add_prompt.php">
                            <i class="bi bi-plus-circle"></i> Add Prompt
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4">
        <!-- Stats Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Total Prompts</h6>
                                <h2 class="mb-0"><?php echo $totalPrompts; ?></h2>
                            </div>
                            <div class="fs-1 text-primary">
                                <i class="bi bi-collection"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Categories</h6>
                                <h2 class="mb-0"><?php echo $totalCategories; ?></h2>
                            </div>
                            <div class="fs-1 text-success">
                                <i class="bi bi-tags"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Total Views</h6>
                                <h2 class="mb-0"><?php echo number_format($totalViews); ?></h2>
                            </div>
                            <div class="fs-1 text-info">
                                <i class="bi bi-eye"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Total Copies</h6>
                                <h2 class="mb-0"><?php echo number_format($totalCopies); ?></h2>
                            </div>
                            <div class="fs-1 text-warning">
                                <i class="bi bi-clipboard-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Prompts Table -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-list-ul me-2"></i>All Prompts 
                        <small class="text-muted">(Newest First)</small>
                    </h5>
                    <a href="add_prompt.php" class="btn btn-primary">
                        <i class="bi bi-plus-circle me-2"></i>Add New Prompt
                    </a>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Platform</th>
                                <th class="text-center">Views</th>
                                <th class="text-center">Copies</th>
                                <th>Created</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($prompts)): ?>
                                <tr>
                                    <td colspan="8" class="text-center py-5 text-muted">
                                        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                                        No prompts found. <a href="add_prompt.php">Add your first prompt</a>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php 
                                $now = time();
                                foreach ($prompts as $index => $prompt): 
                                    // Check if prompt is new (created within last 24 hours)
                                    $createdTime = isset($prompt['created_at']) ? strtotime($prompt['created_at']) : 0;
                                    $isNew = ($now - $createdTime) < 86400; // 24 hours
                                    $rowClass = $isNew ? 'prompt-row-new' : '';
                                ?>
                                <tr class="<?php echo $rowClass; ?>">
                                    <td class="position-relative">
                                        <?php if ($isNew): ?>
                                            <span class="new-badge">NEW</span>
                                        <?php endif; ?>
                                        <?php if (!empty($prompt['image'])): ?>
                                            <img src="../<?php echo htmlspecialchars($prompt['image']); ?>" 
                                                 alt="Thumbnail" 
                                                 class="prompt-image-thumb"
                                                 onerror="this.src='../image/placeholder.jpg'">
                                        <?php else: ?>
                                            <div class="prompt-image-thumb bg-light d-flex align-items-center justify-content-center">
                                                <i class="bi bi-image text-muted"></i>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($prompt['title']); ?></strong>
                                        <?php if ($index === 0): ?>
                                            <span class="badge bg-success ms-2">Latest</span>
                                        <?php endif; ?>
                                        <br>
                                        <small class="text-muted">
                                            <?php echo htmlspecialchars(substr($prompt['prompt'], 0, 60)) . '...'; ?>
                                        </small>
                                    </td>
                                    <td>
                                        <?php 
                                        $categories = is_array($prompt['category']) ? $prompt['category'] : [$prompt['category']];
                                        foreach ($categories as $cat): 
                                        ?>
                                            <span class="badge bg-primary mb-1"><?php echo htmlspecialchars($cat); ?></span>
                                        <?php endforeach; ?>
                                    </td>
                                    <td>
                                        <small class="text-muted">
                                            <?php echo htmlspecialchars($prompt['platform'] ?? 'All'); ?>
                                        </small>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-info">
                                            <i class="bi bi-eye me-1"></i>
                                            <?php echo isset($prompt['stats']['views']) ? $prompt['stats']['views'] : 0; ?>
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-clipboard-check me-1"></i>
                                            <?php echo isset($prompt['stats']['copies']) ? $prompt['stats']['copies'] : 0; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <small class="text-muted">
                                            <?php 
                                            if (isset($prompt['created_at'])) {
                                                $date = date('M d, Y', strtotime($prompt['created_at']));
                                                $time = date('h:i A', strtotime($prompt['created_at']));
                                                echo $date . '<br>' . $time;
                                            } else {
                                                echo 'N/A';
                                            }
                                            ?>
                                        </small>
                                    </td>
                                    <td class="text-end table-actions">
                                        <a href="../prompt.php?id=<?php echo urlencode($prompt['_id']); ?>" 
                                           class="btn btn-sm btn-outline-primary" 
                                           target="_blank"
                                           title="View">
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        <a href="edit_prompt.php?id=<?php echo urlencode($prompt['_id']); ?>" 
                                           class="btn btn-sm btn-outline-secondary"
                                           title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                        <button onclick="confirmDelete('<?php echo htmlspecialchars($prompt['_id']); ?>', '<?php echo htmlspecialchars(addslashes($prompt['title'])); ?>')" 
                                                class="btn btn-sm btn-outline-danger"
                                                title="Delete">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this prompt?</p>
                    <p class="fw-bold" id="deletePromptTitle"></p>
                    <p class="text-danger small">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <form method="POST" action="delete_prompt.php" id="deleteForm">
                        <input type="hidden" name="id" id="deletePromptId">
                        <button type="submit" class="btn btn-danger">
                            <i class="bi bi-trash me-2"></i>Delete Prompt
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let deleteModal;
        
        document.addEventListener('DOMContentLoaded', function() {
            deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        });
        
        function confirmDelete(id, title) {
            document.getElementById('deletePromptId').value = id;
            document.getElementById('deletePromptTitle').textContent = title;
            deleteModal.show();
        }
    </script>
</body>
</html>