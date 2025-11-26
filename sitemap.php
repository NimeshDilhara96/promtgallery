<?php
header("Content-Type: application/xml; charset=utf-8");

require_once __DIR__ . '/models/Prompt.php';

// Base URL of your site
$baseUrl = "https://mometec.codes";

// Get prompts from MongoDB
$promptModel = new Prompt();
$prompts = $promptModel->getAll();

// Collect unique categories
$categories = [];
foreach ($prompts as $p) {
    if (!empty($p['category'])) {
        if (is_array($p['category'])) {
            foreach ($p['category'] as $c) {
                $categories[] = trim($c);
            }
        } else {
            $categories[] = trim($p['category']);
        }
    }
}
$categories = array_unique($categories);
sort($categories); // Sort alphabetically

// Get current date for lastmod
$currentDate = date('Y-m-d');

// XML Header
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/</loc>
        <lastmod><?= $currentDate ?></lastmod>
        <priority>1.00</priority>
        <changefreq>daily</changefreq>
    </url>

    <!-- About Page -->
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/about.php</loc>
        <lastmod><?= $currentDate ?></lastmod>
        <priority>0.8</priority>
        <changefreq>monthly</changefreq>
    </url>

    <!-- Instructions Page -->
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/instructions.php</loc>
        <lastmod><?= $currentDate ?></lastmod>
        <priority>0.9</priority>
        <changefreq>monthly</changefreq>
    </url>

    <!-- Contact Page -->
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/contact.php</loc>
        <lastmod><?= $currentDate ?></lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>

    <!-- Category Pages -->
    <?php foreach ($categories as $cat): ?>
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/?category=<?= urlencode($cat) ?></loc>
        <lastmod><?= $currentDate ?></lastmod>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <?php endforeach; ?>

    <!-- Prompt Pages -->
    <?php foreach ($prompts as $p):
        // Get slug from prompt (already exists in MongoDB)
        $slug = !empty($p['slug']) ? $p['slug'] : strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $p['title'])));
        
        // Get ID for URL (MongoDB _id)
        $promptId = $p['_id'] ?? ($p['id'] ?? '');
        
        // Get last modified date
        if (!empty($p['updated_at'])) {
            // Handle MongoDB date object
            if ($p['updated_at'] instanceof MongoDB\BSON\UTCDateTime) {
                $lastmod = date('Y-m-d', $p['updated_at']->toDateTime()->getTimestamp());
            } else {
                $lastmod = date('Y-m-d', strtotime($p['updated_at']));
            }
        } elseif (!empty($p['created_at'])) {
            // Use created_at if updated_at not available
            if ($p['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
                $lastmod = date('Y-m-d', $p['created_at']->toDateTime()->getTimestamp());
            } else {
                $lastmod = date('Y-m-d', strtotime($p['created_at']));
            }
        } else {
            $lastmod = $currentDate;
        }
        
        // Skip if no ID
        if (empty($promptId)) continue;
    ?>
    <url>
        <loc><?= htmlspecialchars($baseUrl) ?>/prompt.php?id=<?= urlencode($promptId) ?>&amp;slug=<?= urlencode($slug) ?></loc>
        <lastmod><?= $lastmod ?></lastmod>
        <priority>0.6</priority>
        <changefreq>monthly</changefreq>
    </url>
    <?php endforeach; ?>
</urlset>
