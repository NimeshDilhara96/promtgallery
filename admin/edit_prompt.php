<?php
// edit_prompt.php - Fixed image upload path with custom categories
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

require_once '../models/Prompt.php';

$promptModel = new Prompt();
$message = '';
$error = '';

$id = $_GET['id'] ?? '';

if (empty($id)) {
    header('Location: dashboard.php');
    exit;
}

$prompt = $promptModel->getById($id);

if (!$prompt) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $promptText = trim($_POST['prompt'] ?? '');
    $categories = isset($_POST['categories']) && is_array($_POST['categories']) ? $_POST['categories'] : [];
    $customCategory = trim($_POST['custom_category'] ?? '');
    $platform = trim($_POST['platform'] ?? 'All Platforms');
    $tags = trim($_POST['tags'] ?? '');
    
    // Add custom category if provided
    if (!empty($customCategory)) {
        $customCategories = array_map('trim', explode(',', $customCategory));
        $customCategories = array_filter($customCategories);
        $categories = array_merge($categories, $customCategories);
    }
    
    // Remove duplicates and empty values
    $categories = array_unique(array_filter($categories));
    
    // Process tags
    $tagsArray = [];
    if (!empty($tags)) {
        $tagsArray = array_map('trim', explode(',', $tags));
        $tagsArray = array_filter($tagsArray);
    }
    
    // Handle image upload - USE IMAGE FOLDER
    $imagePath = $prompt['image'] ?? '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../image/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileExtension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $fileName = uniqid('prompt_') . '.' . $fileExtension;
            $targetPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                // Delete old image
                if (!empty($imagePath) && file_exists('../' . $imagePath)) {
                    unlink('../' . $imagePath);
                }
                $imagePath = 'image/' . $fileName;
            } else {
                $error = 'Failed to upload image.';
            }
        } else {
            $error = 'Invalid image format. Allowed: JPG, PNG, GIF, WebP';
        }
    }
    
    if (empty($error)) {
        if (empty($title) || empty($promptText) || empty($categories)) {
            $error = 'Please fill in all required fields and select at least one category.';
        } else {
            $data = [
                'title' => $title,
                'prompt' => $promptText,
                'category' => $categories,
                'platform' => $platform,
                'tags' => $tagsArray,
                'image' => $imagePath,
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            try {
                $result = $promptModel->update($id, $data);
                
                if ($result) {
                    $message = 'Prompt updated successfully!';
                    // Refresh prompt data
                    $prompt = $promptModel->getById($id);
                } else {
                    $error = 'Failed to update prompt. Please try again.';
                }
            } catch (Exception $e) {
                $error = 'Database error: ' . $e->getMessage();
                error_log('Update prompt error: ' . $e->getMessage());
            }
        }
    }
}

// Prepare form values
$formTitle = $_POST['title'] ?? $prompt['title'];
$formPrompt = $_POST['prompt'] ?? $prompt['prompt'];
$formPlatform = $_POST['platform'] ?? ($prompt['platform'] ?? 'All Platforms');
$formCategories = isset($_POST['categories']) ? $_POST['categories'] : (is_array($prompt['category']) ? $prompt['category'] : [$prompt['category']]);
$formTags = isset($_POST['tags']) ? $_POST['tags'] : (isset($prompt['tags']) ? implode(', ', $prompt['tags']) : '');

// Get existing categories
$existingCategories = $promptModel->getCategories();
sort($existingCategories);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Prompt - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: #f8f9fa;
        }
        .form-container {
            max-width: 900px;
            margin: 0 auto;
        }
        .image-preview {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            margin-top: 10px;
        }
        .current-image {
            max-width: 200px;
            border-radius: 8px;
        }
        .custom-category-box {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        .existing-categories {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 10px;
            background: white;
        }
        .btn-lg {
            padding: 12px 24px;
            font-size: 1.1rem;
            font-weight: 600;
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
            <div class="ms-auto">
                <a href="dashboard.php" class="btn btn-outline-light btn-sm">
                    <i class="bi bi-arrow-left me-1"></i> Back to Dashboard
                </a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <div class="form-container">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3">
                    <h4 class="mb-0"><i class="bi bi-pencil me-2"></i>Edit Prompt</h4>
                </div>
                <div class="card-body p-4">
                    <?php if ($message): ?>
                        <div class="alert alert-success alert-dismissible fade show">
                            <i class="bi bi-check-circle me-2"></i><?php echo htmlspecialchars($message); ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($error): ?>
                        <div class="alert alert-danger alert-dismissible fade show">
                            <i class="bi bi-exclamation-triangle me-2"></i><?php echo htmlspecialchars($error); ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    <?php endif; ?>

                    <form method="POST" enctype="multipart/form-data">
                        <!-- Title -->
                        <div class="mb-3">
                            <label for="title" class="form-label fw-bold">
                                Title <span class="text-danger">*</span>
                            </label>
                            <input type="text" 
                                   class="form-control" 
                                   id="title" 
                                   name="title" 
                                   required
                                   value="<?php echo htmlspecialchars($formTitle); ?>"
                                   placeholder="e.g., Cyberpunk Portrait Style">
                        </div>

                        <!-- Prompt Text -->
                        <div class="mb-3">
                            <label for="prompt" class="form-label fw-bold">
                                Prompt Text <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control font-monospace" 
                                      id="prompt" 
                                      name="prompt" 
                                      rows="6" 
                                      required
                                      placeholder="Enter the full AI prompt here..."><?php echo htmlspecialchars($formPrompt); ?></textarea>
                            <div class="form-text">The complete prompt that users will copy</div>
                        </div>

                        <!-- Categories -->
                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                Categories <span class="text-danger">*</span>
                            </label>
                            
                            <!-- Current Categories Display -->
                            <div class="mb-2">
                                <small class="text-muted">Currently assigned:</small>
                                <div>
                                    <?php foreach ($formCategories as $cat): ?>
                                        <span class="badge bg-primary me-1"><?php echo htmlspecialchars($cat); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            
                            <!-- Existing Categories -->
                            <?php if (!empty($existingCategories)): ?>
                            <div class="existing-categories mb-2">
                                <small class="text-muted d-block mb-2">
                                    <i class="bi bi-info-circle me-1"></i>Select from existing categories:
                                </small>
                                <div class="row g-2">
                                    <?php foreach ($existingCategories as $cat): 
                                        $checked = in_array($cat, $formCategories) ? 'checked' : '';
                                    ?>
                                    <div class="col-md-3 col-sm-4 col-6">
                                        <div class="form-check">
                                            <input class="form-check-input" 
                                                   type="checkbox" 
                                                   name="categories[]" 
                                                   value="<?php echo htmlspecialchars($cat); ?>" 
                                                   id="cat_<?php echo htmlspecialchars($cat); ?>"
                                                   <?php echo $checked; ?>>
                                            <label class="form-check-label" for="cat_<?php echo htmlspecialchars($cat); ?>">
                                                <?php echo htmlspecialchars($cat); ?>
                                            </label>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <?php endif; ?>

                            <!-- Custom Category Input -->
                            <div class="custom-category-box">
                                <label for="custom_category" class="form-label fw-bold mb-2">
                                    <i class="bi bi-plus-circle me-1"></i>Add New Category
                                </label>
                                <input type="text" 
                                       class="form-control" 
                                       id="custom_category" 
                                       name="custom_category"
                                       value="<?php echo htmlspecialchars($_POST['custom_category'] ?? ''); ?>"
                                       placeholder="Enter new category name (e.g., 3D Art, Cartoon, etc.)">
                                <div class="form-text">
                                    <i class="bi bi-lightbulb me-1"></i>
                                    Add multiple categories separated by commas (e.g., "3D Art, Cartoon, Pixel Art")
                                </div>
                            </div>
                            
                            <div class="form-text mt-2">
                                Select existing categories or create new ones above. At least one category is required.
                            </div>
                        </div>

                        <!-- Platform -->
                        <div class="mb-3">
                            <label for="platform" class="form-label fw-bold">Platform</label>
                            <select class="form-select" id="platform" name="platform">
                                <option value="All Platforms" <?php echo ($formPlatform === 'All Platforms') ? 'selected' : ''; ?>>All Platforms</option>
                                <option value="Midjourney" <?php echo ($formPlatform === 'Midjourney') ? 'selected' : ''; ?>>Midjourney</option>
                                <option value="DALL-E" <?php echo ($formPlatform === 'DALL-E') ? 'selected' : ''; ?>>DALL-E</option>
                                <option value="Stable Diffusion" <?php echo ($formPlatform === 'Stable Diffusion') ? 'selected' : ''; ?>>Stable Diffusion</option>
                                <option value="Leonardo AI" <?php echo ($formPlatform === 'Leonardo AI') ? 'selected' : ''; ?>>Leonardo AI</option>
                                <option value="Gemini" <?php echo ($formPlatform === 'Gemini') ? 'selected' : ''; ?>>Gemini</option>
                            </select>
                        </div>

                        <!-- Tags -->
                        <div class="mb-3">
                            <label for="tags" class="form-label fw-bold">Tags</label>
                            <input type="text" 
                                   class="form-control" 
                                   id="tags" 
                                   name="tags"
                                   value="<?php echo htmlspecialchars($formTags); ?>"
                                   placeholder="e.g., portrait, cyberpunk, neon, futuristic">
                            <div class="form-text">Comma-separated tags for better searchability</div>
                        </div>

                        <!-- Current Image -->
                        <?php if (!empty($prompt['image'])): ?>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Current Image</label>
                            <div>
                                <img src="../<?php echo htmlspecialchars($prompt['image']); ?>" 
                                     alt="Current" 
                                     class="current-image"
                                     onerror="this.src='../image/placeholder.jpg'">
                            </div>
                        </div>
                        <?php endif; ?>

                        <!-- Image Upload -->
                        <div class="mb-4">
                            <label for="image" class="form-label fw-bold">
                                <?php echo !empty($prompt['image']) ? 'Replace Image' : 'Upload Image'; ?>
                            </label>
                            <input type="file" 
                                   class="form-control" 
                                   id="image" 
                                   name="image" 
                                   accept="image/*"
                                   onchange="previewImage(this)">
                            <div class="form-text">
                                <?php echo !empty($prompt['image']) ? 'Upload a new image to replace the current one' : 'Upload an example image'; ?>
                                (JPG, PNG, GIF, WebP - Max 5MB)
                            </div>
                            <div id="imagePreview"></div>
                        </div>

                        <!-- Stats Display -->
                        <div class="mb-4">
                            <label class="form-label fw-bold">Statistics & Information</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="d-flex gap-3 mb-2">
                                        <span class="badge bg-info">
                                            <i class="bi bi-eye me-1"></i>
                                            <?php echo isset($prompt['stats']['views']) ? $prompt['stats']['views'] : 0; ?> views
                                        </span>
                                        <span class="badge bg-warning text-dark">
                                            <i class="bi bi-clipboard-check me-1"></i>
                                            <?php echo isset($prompt['stats']['copies']) ? $prompt['stats']['copies'] : 0; ?> copies
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="text-muted small">
                                        <?php if (isset($prompt['created_at'])): ?>
                                        <div class="mb-1">
                                            <i class="bi bi-calendar-plus me-1"></i>Created: 
                                            <?php 
                                                $createdDate = $prompt['created_at']->toDateTime();
                                                $createdDate->setTimezone(new DateTimeZone('Asia/Colombo'));
                                                echo $createdDate->format('M j, Y g:i A'); 
                                            ?> (LK Time)
                                        </div>
                                        <?php endif; ?>
                                        <?php if (isset($prompt['updated_at']) && $prompt['updated_at'] != $prompt['created_at']): ?>
                                        <div>
                                            <i class="bi bi-calendar-check me-1"></i>Updated: 
                                            <?php 
                                                $updatedDate = $prompt['updated_at']->toDateTime();
                                                $updatedDate->setTimezone(new DateTimeZone('Asia/Colombo'));
                                                echo $updatedDate->format('M j, Y g:i A'); 
                                            ?> (LK Time)
                                        </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-success px-4">
                                <i class="bi bi-check-circle me-2"></i>Update Prompt
                            </button>
                            <a href="dashboard.php" class="btn btn-outline-secondary">Cancel</a>
                            <a href="../prompt.php?id=<?php echo urlencode($prompt['_id']); ?>" 
                               class="btn btn-outline-info ms-auto" 
                               target="_blank">
                                <i class="bi bi-eye me-2"></i>View Live
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'image-preview';
                    preview.appendChild(img);
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>