// GHD Sports Download Page - Ad Strategy Script

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
    
    // Also navigate current page to ad (some ad networks require this)
    // Uncomment the line below if you want to redirect current page instead
    // window.location.href = CONFIG.adUrl;
    
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
    
    // Track download (you can add analytics here)
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
                background: var(--dark-light);
                border: 1px solid var(--gray);
                border-radius: 12px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                z-index: 10001;
                animation: slideUp 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
                max-width: 90%;
            }
            .toast-success .toast-icon { color: #00d4aa; }
            .toast-error .toast-icon { color: #ff6b6b; }
            .toast-info .toast-icon { color: #feca57; }
            .toast-icon { font-size: 1.2rem; }
            .toast-message { font-size: 0.95rem; color: white; }
            .toast-close {
                background: none;
                border: none;
                color: var(--gray-light);
                cursor: pointer;
                padding: 5px;
                margin-left: 10px;
            }
            .toast-close:hover { color: white; }
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
        header.style.background = 'rgba(10, 10, 15, 0.98)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.9)';
        header.style.boxShadow = 'none';
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
    const animatedElements = document.querySelectorAll('.feature-card, .channel-card, .match-card, .info-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Check if user came back from ad page
    if (document.referrer.includes('effectiveratecpm.com') || hasVisitedAd()) {
        setTimeout(() => {
            showToast('Welcome back! Click download to get the app.', 'success');
        }, 1000);
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('instructionModal');
        if (modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// Close modal on overlay click
document.getElementById('instructionModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Prevent body scroll when modal is open
document.getElementById('instructionModal').addEventListener('touchmove', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.preventDefault();
    }
}, { passive: false });

// Add download tracking
function trackEvent(eventName, data = {}) {
    // You can integrate with Google Analytics or any other analytics service
    console.log('Event:', eventName, data);
    
    // Example Google Analytics integration (uncomment if using GA)
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, data);
    // }
}

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

console.log('%c GHD Sports Download Page ', 'background: #00d4aa; color: #000; padding: 10px 20px; font-size: 14px; font-weight: bold;');
console.log('%c Made with ❤️ ', 'color: #ff6b6b; font-size: 12px;');
