<?php
// Ensure categories are available
if (!isset($categories)) {
    $categories = [];
}
?>
    <!-- External Script - Centered -->
    <div class="container my-4">
        <div class="row justify-content-center">
            <div class="col-12 text-center">
                <script>
                (function(qab){
                var d = document,
                    s = d.createElement('script'),
                    l = d.scripts[d.scripts.length - 1];
                s.settings = qab || {};
                s.src = "\/\/knownconflict.com\/bEXbV\/s.dNGhlk0iYIWWcN\/ceRmf9tulZDUslYkNPrT\/Yq2\/OTTeEn3bOzD\/Ygt\/NejJY\/5qMBT\/cB4aN_wQ";
                s.async = true;
                s.referrerPolicy = 'no-referrer-when-downgrade';
                l.parentNode.insertBefore(s, l);
                })({})
                </script>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light py-5" id="contact">
        <div class="container">
            <div class="row gy-4">
                <div class="col-lg-4">
                    <h3 class="h5 mb-3">AI Prompt Gallery</h3>
                    <p class="text-muted">Your trusted source for high-quality AI art prompts.</p>
                </div>
                <div class="col-lg-4">
                    <h4 class="h6 mb-3">Popular Categories</h4>
                    <ul class="list-unstyled">
                        <?php 
                        $displayCategories = !empty($categories) ? array_slice($categories, 0, 5) : [];
                        foreach ($displayCategories as $cat): 
                        ?>
                        <li class="mb-2">
                            <a href="index.php?category=<?php echo urlencode($cat); ?>" class="text-decoration-none text-secondary">
                                <?php echo htmlspecialchars($cat); ?>
                            </a>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h4 class="h6 mb-3">AI Tools</h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">
                            <a href="https://www.midjourney.com" target="_blank" rel="noopener" class="text-decoration-none text-secondary">Midjourney</a>
                        </li>
                        <li class="mb-2">
                            <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener" class="text-decoration-none text-secondary">DALL-E 3</a>
                        </li>
                        <li class="mb-2">
                            <a href="https://stability.ai" target="_blank" rel="noopener" class="text-decoration-none text-secondary">Stable Diffusion</a>
                        </li>
                        <li class="mb-2">
                            <a href="https://leonardo.ai" target="_blank" rel="noopener" class="text-decoration-none text-secondary">Leonardo AI</a>
                        </li>
                        <li class="mb-2">
                            <a href="https://aistudio.google.com" target="_blank" rel="noopener" class="text-decoration-none text-secondary">Google AI Studio</a>
                        </li>
                        <li class="mb-2">
                            <a href="https://deepmind.google/technologies/gemini/nano/" target="_blank" rel="noopener" class="text-decoration-none text-secondary">Google Gemini Nano</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-top border-light pt-4 mt-4 text-center">
                <p class="text-light small mb-0">&copy; 2025 AI Prompt Gallery.</p>
                <p class="text-light small mb-0">MommentX</p>
                <p class="text-light small mb-0">All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Modal -->
    <div class="modal fade" id="promptModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4" id="modalBody">
                    <!-- Content will be injected here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Help Button -->
    <a href="instructions.php" 
       class="btn btn-info floating-help-btn" 
       data-bs-toggle="tooltip" 
       data-bs-placement="left" 
       title="How to use AI prompts with your photos">
        <i class="bi bi-question-circle-fill help-badge-icon"></i>
    </a>

    <!-- Bootstrap & JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>