<?php
// delete_prompt.php - Updated to use MongoDB and image folder
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

require_once '../models/Prompt.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];
    
    $promptModel = new Prompt();
    
    // Get prompt to delete image file
    $prompt = $promptModel->getById($id);
    
    if ($prompt) {
        // Delete image file if exists (checking image folder)
        if (!empty($prompt['image']) && file_exists('../' . $prompt['image'])) {
            unlink('../' . $prompt['image']);
        }
        
        // Delete prompt from database
        $promptModel->delete($id);
    }
}

header('Location: dashboard.php');
exit;
?>