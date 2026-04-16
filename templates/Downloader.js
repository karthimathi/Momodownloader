<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Downloader - Creator Toolkit Hub</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <span class="logo-icon">🎨</span>
                <span class="logo-text">Creator Toolkit Hub</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/downloader" class="active">Downloader</a></li>
                <li><a href="/title">Title Generator</a></li>
                <li><a href="/hashtag">Hashtag Generator</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <main class="container">
        <div class="tool-header">
            <div class="header-badge">⚡ Fast & Free ⚡</div>
            <h1>📥 Instagram & Facebook Video Downloader</h1>
            <p>Download videos from Instagram and Facebook quickly and easily in HD quality</p>
            <div class="warning-note">
                <i class="fas fa-exclamation-triangle"></i> 
                YouTube videos are not supported due to copyright restrictions
            </div>
        </div>

        <div class="form-container glass-effect">
            <form method="POST" action="/downloader" class="tool-form" id="downloadForm">
                <div class="form-group">
                    <label for="url">
                        <i class="fas fa-link"></i> Video URL:
                    </label>
                    <input type="url" 
                           id="url" 
                           name="url" 
                           placeholder="https://www.instagram.com/p/... or https://www.facebook.com/..."
                           required
                           value="{{ request.form.get('url', '') }}">
                    <small>Supported: Instagram Reels, Posts, Facebook Videos, Facebook Watch</small>
                </div>
                <button type="submit" class="submit-button" id="submitBtn">
                    <span class="btn-normal">
                        <i class="fas fa-download"></i> Download Video
                    </span>
                    <span class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i> Processing...
                    </span>
                </button>
            </form>
            
            <div class="platform-icons">
                <div class="platform-icon"><i class="fab fa-instagram"></i> Instagram</div>
                <div class="platform-icon"><i class="fab fa-facebook"></i> Facebook</div>
                <div class="platform-icon"><i class="fas fa-video"></i> Reels</div>
                <div class="platform-icon"><i class="fas fa-play-circle"></i> Watch</div>
            </div>
        </div>

        {% if error %}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
        </div>
        {% endif %}

        {% if video_info %}
        <div class="result-card glass-effect" id="resultCard">
            <h2><i class="fas fa-check-circle"></i> Video Ready for Download</h2>
            <div class="video-preview">
                {% if video_info.thumbnail %}
                <img src="{{ video_info.thumbnail }}" alt="Video thumbnail" class="thumbnail" 
                     onerror="this.src='https://via.placeholder.com/120x120?text=No+Thumbnail'">
                {% else %}
                <div class="thumbnail-placeholder">
                    <i class="fas fa-video"></i>
                </div>
                {% endif %}
                <div class="video-details">
                    <h3>{{ video_info.title }}</h3>
                    {% if video_info.duration %}
                    <p><i class="far fa-clock"></i> Duration: {{ video_info.duration }} seconds</p>
                    {% endif %}
                    <div class="download-actions">
                        <a href="{{ video_info.url }}" class="download-button" download target="_blank">
                            <i class="fas fa-save"></i> Save Video
                        </a>
                        <button class="copy-url-btn" onclick="copyVideoUrl('{{ video_info.url }}')">
                            <i class="fas fa-copy"></i> Copy URL
                        </button>
                    </div>
                </div>
            </div>
            <p class="download-note">
                <i class="fas fa-info-circle"></i> 
                Tip: Right-click and select "Save link as" if download doesn't start automatically
            </p>
        </div>
        {% endif %}

        <div class="tips-section">
            <div class="tips-header">
                <i class="fas fa-lightbulb"></i>
                <h3>Pro Tips:</h3>
            </div>
            <ul>
                <li><i class="fas fa-copy"></i> Copy the video URL from Instagram or Facebook</li>
                <li><i class="fas fa-paste"></i> Paste it in the input field above</li>
                <li><i class="fas fa-download"></i> Click download and save your video</li>
                <li><i class="fas fa-mobile-alt"></i> Works with Instagram Reels, Posts, and Facebook Videos</li>
                <li><i class="fas fa-database"></i> Maximum file size: 50MB</li>
                <li><i class="fas fa-lock"></i> Private videos cannot be downloaded</li>
            </ul>
        </div>
        
        <div class="supported-platforms">
            <h3><i class="fas fa-thumbs-up"></i> Supported Platforms:</h3>
            <div class="platform-badges">
                <span class="platform-badge"><i class="fab fa-instagram"></i> Instagram</span>
                <span class="platform-badge"><i class="fab fa-facebook"></i> Facebook</span>
                <span class="platform-badge"><i class="fab fa-instagram"></i> Instagram Reels</span>
                <span class="platform-badge"><i class="fab fa-facebook"></i> Facebook Watch</span>
                <span class="platform-badge"><i class="fas fa-image"></i> Instagram Posts</span>
                <span class="platform-badge"><i class="fas fa-video"></i> Facebook Videos</span>
            </div>
        </div>
        
        <div class="faq-section">
            <h3><i class="fas fa-question-circle"></i> Frequently Asked Questions:</h3>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-chevron-right"></i> Why can't I download YouTube videos?
                </div>
                <div class="faq-answer">
                    Due to copyright restrictions and legal policies, we don't support YouTube downloads. Please use Instagram or Facebook links.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-chevron-right"></i> What quality will I get?
                </div>
                <div class="faq-answer">
                    Videos are downloaded in the best available quality up to 720p for optimal balance between quality and file size.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <i class="fas fa-chevron-right"></i> Is this service free?
                </div>
                <div class="faq-answer">
                    Yes! All our tools are completely free to use with no hidden charges or subscriptions.
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>Free Creator Tools | Made for content creators</p>
            <p class="footer-note">© 2024 Creator Toolkit Hub - All tools are free to use</p>
        </div>
    </footer>

    <!-- Toast Container -->
    <div id="toastContainer" class="toast-container"></div>

    <script>
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Toast notification system
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                info: 'ℹ️',
                warning: '⚠️'
            };
            
            toast.innerHTML = `
                <div class="toast-icon">${icons[type] || '✅'}</div>
                <div class="toast-message">${message}</div>
                <div class="toast-progress"></div>
            `;
            
            container.appendChild(toast);
            
            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        // Form submission loading state
        const form = document.getElementById('downloadForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnNormal = submitBtn?.querySelector('.btn-normal');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                const urlInput = document.getElementById('url');
                if (!urlInput.value.trim()) {
                    e.preventDefault();
                    showToast('Please enter a video URL', 'warning');
                    return;
                }
                
                if (btnNormal && btnLoading) {
                    btnNormal.style.display = 'none';
                    btnLoading.style.display = 'inline-flex';
                    submitBtn.disabled = true;
                }
            });
        }
        
        // Copy video URL to clipboard
        function copyVideoUrl(url) {
            navigator.clipboard.writeText(url).then(() => {
                showToast('Video URL copied to clipboard! 📋', 'success');
            }).catch(() => {
                showToast('Failed to copy URL', 'error');
            });
        }
        
        // Check if there's an error and show toast
        {% if error %}
        document.addEventListener('DOMContentLoaded', function() {
            showToast('{{ error }}', 'error');
        });
        {% endif %}
        
        // Check if video was downloaded successfully
        {% if video_info %}
        document.addEventListener('DOMContentLoaded', function() {
            showToast('Video processed successfully! Click Save Video to download.', 'success');
        });
        {% endif %}
        
        // Add smooth animation for result card
        const resultCard = document.getElementById('resultCard');
        if (resultCard) {
            resultCard.style.animation = 'slideIn 0.5s ease';
        }
        
        // FAQ toggle functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    answer.style.display = 'block';
                    icon.style.transform = 'rotate(90deg)';
                }
            });
        });
        
        // Add animation styles if not present
        if (!document.querySelector('#animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .faq-answer {
                    display: none;
                    padding: 0.75rem 1rem 0.75rem 2rem;
                    color: #64748b;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                .faq-question {
                    cursor: pointer;
                    padding: 0.75rem;
                    background: rgba(99, 102, 241, 0.05);
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    transition: all 0.3s ease;
                }
                
                .faq-question:hover {
                    background: rgba(99, 102, 241, 0.1);
                }
                
                .faq-question i {
                    transition: transform 0.3s ease;
                    margin-right: 0.5rem;
                }
                
                .thumbnail-placeholder {
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .thumbnail-placeholder i {
                    font-size: 3rem;
                    color: #6366f1;
                }
                
                .copy-url-btn {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-left: 1rem;
                }
                
                .copy-url-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(6, 182, 212, 0.3);
                }
                
                .download-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }
                
                @media (max-width: 768px) {
                    .download-actions {
                        flex-direction: column;
                    }
                    
                    .copy-url-btn {
                        margin-left: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    </script>
</body>
</html>
