// GHD Sports Download Page - Script

// Configuration
const CONFIG = {
    adUrl: 'https://www.effectiveratecpm.com/p6z2dgj0?key=a6119989a3bcbd81864f3300c5394f67',
    apkUrl: 'https://github.com/shakibshalim2/downloadapk/raw/refs/heads/main/GHD-SPORTS.apk',
    storageKey: 'ghd_ad_visited',
    storageExpiry: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// Check if user has visited ad recently
function hasVisitedAd() {
    const visitData = localStorage.getItem(CONFIG.storageKey);
    if (!visitData) return false;
    
    try {
        const { timestamp } = JSON.parse(visitData);
        const now = Date.now();
        
        // Check if visit is still valid (within 24 hours)
        if (now - timestamp < CONFIG.storageExpiry) {
            return true;
        } else {
            // Expired, remove the entry
            localStorage.removeItem(CONFIG.storageKey);
            return false;
        }
    } catch (e) {
        localStorage.removeItem(CONFIG.storageKey);
        return false;
    }
}

// Mark that user has visited ad
function markAdVisited() {
    const visitData = {
        timestamp: Date.now(),
        visited: true
    };
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(visitData));
}

// Show instruction modal
function showModal() {
    const modal = document.getElementById('instructionModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close instruction modal
function closeModal() {
    const modal = document.getElementById('instructionModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // After closing modal, redirect to ad page
    redirectToAd();
}

// Redirect to ad page
function redirectToAd() {
    // Mark that we're about to visit ad
    markAdVisited();
    
    // Open ad in new tab
    window.open(CONFIG.adUrl, '_blank');
    
    // Show a toast notification
    showToast('Please wait for the page to load, then come back to download!', 'info');
}

// Start actual download
function startDownload() {
    showToast('Starting download...', 'success');
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = CONFIG.apkUrl;
    link.download = 'GHD-Sports-v9.8.apk';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download
    console.log('Download started at:', new Date().toISOString());
}

// Main download handler
function handleDownload() {
    if (hasVisitedAd()) {
        // User has already visited ad, start download
        startDownload();
    } else {
        // First time user, show instructions
        showModal();
    }
}

// Toggle FAQ items
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('.faq-question i');
        if (icon) {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
        const icon = element.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add toast styles if not present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                animation: slideUp 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
                max-width: 90%;
            }
            .toast-success .toast-icon { color: #4caf50; }
            .toast-error .toast-icon { color: #f44336; }
            .toast-info .toast-icon { color: #ff5722; }
            .toast-icon { font-size: 1.2rem; }
            .toast-message { font-size: 0.95rem; color: #333; }
            .toast-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 5px;
                margin-left: 10px;
            }
            .toast-close:hover { color: #333; }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-box, .category-card, .review-card, .support-card, .fix-step');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Check if user came back from ad page
    if (document.referrer.includes('effectiveratecpm.com') || hasVisitedAd()) {
        setTimeout(() => {
            showToast('Welcome back! Click download to get the app.', 'success');
        }, 1000);
    }
    
    // Animate stats counter
    animateCounters();
});

// Animate stat counters
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Don't animate if already animated
                if (target.dataset.animated) return;
                target.dataset.animated = 'true';
                
                // Simple fade in for complex values
                target.style.opacity = '0';
                target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    target.style.transition = 'all 0.5s ease';
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => counterObserver.observe(stat));
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('instructionModal');
        if (modal.classList.contains('active')) {
            closeModal();
        }
        closeMobileMenu();
    }
});

// Close modal on overlay click
document.getElementById('instructionModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

// Prevent body scroll when modal is open
document.getElementById('instructionModal').addEventListener('touchmove', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.preventDefault();
    }
}, { passive: false });

// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Console branding
console.log('%c GHD Sports Download Page ', 'background: #ff5722; color: #fff; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 5px;');
console.log('%c Made with ❤️ ', 'color: #ff5722; font-size: 12px;');
