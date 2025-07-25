/**
 * Laptop Price Predictor - Industry Level JavaScript
 * Features: Modern ES6+, Performance Optimized, Accessibility Compliant
 * Author: AI Assistant
 * Version: 2.0.0
 */

// --- Ensure theme and toggle are set before anything else ---
(function() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    // Sync dark mode toggle button
    window.addEventListener('DOMContentLoaded', function() {
        const darkToggle = document.querySelector('.toggle-control[data-action="dark-mode"]');
        if (darkToggle) {
            const icon = darkToggle.querySelector('.toggle-icon');
            if (isDark) {
                darkToggle.classList.add('active');
                if (icon) icon.textContent = '☀️';
            } else {
                darkToggle.classList.remove('active');
                if (icon) icon.textContent = '🌙';
            }
        }
    });
})();

// Sync dark mode across all tabs/windows
window.addEventListener('storage', function(event) {
    if (event.key === 'theme') {
        const isDark = event.newValue === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.body && document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body && document.body.classList.remove('dark-mode');
        }
        // Also update the toggle button state/icon if present
        const darkToggle = document.querySelector('.toggle-control[data-action="dark-mode"]');
        if (darkToggle) {
            const icon = darkToggle.querySelector('.toggle-icon');
            if (isDark) {
                darkToggle.classList.add('active');
                if (icon) icon.textContent = '☀️';
            } else {
                darkToggle.classList.remove('active');
                if (icon) icon.textContent = '🌙';
            }
        }
    }
});

// Configuration and Constants
const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 150,
    TOGGLE_SOUNDS: {
        ON: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        OFF: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    },
    THEMES: {
        LIGHT: {
            background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
            text: '#2d3a4b',
            glass: 'rgba(255, 255, 255, 0.1)'
        },
        DARK: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.2)'
        }
    }
};

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static playSound(audioData) {
        try {
            const audio = new Audio(audioData);
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore autoplay restrictions
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    static createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    static animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            element.style.transform = `translateX(${current}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
}

// Advanced Toggle System
class AdvancedToggle {
    constructor(selector, options = {}) {
        this.toggles = document.querySelectorAll(selector);
        this.options = {
            enableSound: true,
            enableHaptics: 'vibrate' in navigator,
            enableAnimations: true,
            accessibility: true,
            ...options
        };
        this.state = new Map();
        this.init();
    }

    init() {
        this.toggles.forEach(toggle => {
            this.setupToggle(toggle);
            this.setupAccessibility(toggle);
            this.setupAnimations(toggle);
        });

        // Add CSS animations if not present
        this.injectAnimations();
        
        console.log(`🎛️ Advanced Toggle System initialized with ${this.toggles.length} toggles`);
    }

    setupToggle(toggle) {
        const action = toggle.getAttribute('data-action');
        const initialState = this.getInitialState(action);
        
        this.state.set(toggle, {
            action,
            active: initialState,
            lastToggle: 0
        });

        // Set initial state
        if (initialState) {
            toggle.classList.add('active');
            this.updateToggleVisuals(toggle, true);
        }

        // Add click handler with debouncing
        const debouncedClick = Utils.debounce((e) => this.handleToggleClick(e), CONFIG.DEBOUNCE_DELAY);
        toggle.addEventListener('click', debouncedClick);

        // Add keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleToggleClick(e);
            }
        });
    }

    setupAccessibility(toggle) {
        if (!this.options.accessibility) return;

        const action = toggle.getAttribute('data-action');
        const label = this.getAccessibilityLabel(action);
        
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-checked', 'false');
    }

    setupAnimations(toggle) {
        if (!this.options.enableAnimations) return;

        const switchElement = toggle.querySelector('.toggle-3d');
        if (switchElement) {
            // Add smooth transition
            switchElement.style.transition = `all ${CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        }
    }

    handleToggleClick(event) {
        const toggle = event.currentTarget;
        const now = Date.now();
        const toggleState = this.state.get(toggle);
        
        // Prevent rapid clicking
        if (now - toggleState.lastToggle < CONFIG.DEBOUNCE_DELAY) {
            return;
        }

        toggleState.lastToggle = now;
        toggleState.active = !toggleState.active;

        // Update visual state
        this.updateToggleVisuals(toggle, toggleState.active);
        
        // Handle specific actions
        this.handleAction(toggle, toggleState.action, toggleState.active);
        
        // Accessibility update
        this.updateAccessibility(toggle, toggleState.active);
        
        // Feedback
        this.provideFeedback(toggle, toggleState.active);
    }

    updateToggleVisuals(toggle, isActive) {
        const switchElement = toggle.querySelector('.toggle-3d');
        const icon = toggle.querySelector('.toggle-icon');
        
        if (isActive) {
            toggle.classList.add('active');
            if (switchElement) {
                Utils.animateValue(switchElement, 0, 30, CONFIG.ANIMATION_DURATION);
            }
        } else {
            toggle.classList.remove('active');
            if (switchElement) {
                Utils.animateValue(switchElement, 30, 0, CONFIG.ANIMATION_DURATION);
            }
        }

        // Update icon
        if (icon) {
            const action = toggle.getAttribute('data-action');
            icon.textContent = this.getIconForState(action, isActive);
        }
    }

    handleAction(toggle, action, isActive) {
        switch (action) {
            case 'dark-mode':
                this.toggleTheme(isActive);
                break;
            case 'sound':
                this.toggleSound(isActive);
                break;
            default:
                console.warn(`Unknown toggle action: ${action}`);
        }
    }

    toggleTheme(isDark) {
        const theme = isDark ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
        
        // Smooth theme transition
        document.body.style.transition = `all ${CONFIG.ANIMATION_DURATION}ms ease-in-out`;
        document.body.style.background = theme.background;
        
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Update CSS custom properties
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--glass-bg', theme.glass);

        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        console.log(`🎨 Theme switched to ${isDark ? 'dark' : 'light'} mode`);
    }

    toggleSound(isOn) {
        if (this.options.enableSound) {
            const soundData = isOn ? CONFIG.TOGGLE_SOUNDS.ON : CONFIG.TOGGLE_SOUNDS.OFF;
            Utils.playSound(soundData);
        }
        
        // Save preference
        localStorage.setItem('sound', isOn ? 'on' : 'off');
        
        console.log(`🔊 Sound ${isOn ? 'enabled' : 'disabled'}`);
    }

    provideFeedback(toggle, isActive) {
        // Haptic feedback
        if (this.options.enableHaptics && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Visual feedback
        Utils.createRipple({ currentTarget: toggle, clientX: 0, clientY: 0 });
    }

    updateAccessibility(toggle, isActive) {
        if (!this.options.accessibility) return;
        
        toggle.setAttribute('aria-checked', isActive.toString());
    }

    getInitialState(action) {
        switch (action) {
            case 'dark-mode':
                return localStorage.getItem('theme') === 'dark';
            case 'sound':
                return localStorage.getItem('sound') !== 'off';
            default:
                return false;
        }
    }

    getAccessibilityLabel(action) {
        const labels = {
            'dark-mode': 'Toggle dark mode',
            'sound': 'Toggle sound effects'
        };
        return labels[action] || `Toggle ${action}`;
    }

    getIconForState(action, isActive) {
        const icons = {
            'dark-mode': isActive ? '☀️' : '🌙',
            'sound': isActive ? '🔇' : '🔊'
        };
        return icons[action] || '⚙️';
    }

    injectAnimations() {
        if (document.getElementById('toggle-animations')) return;

        const style = document.createElement('style');
        style.id = 'toggle-animations';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .toggle-control {
                position: relative;
                overflow: hidden;
            }
            
            .toggle-control:focus {
                outline: 2px solid #64b6ff;
                outline-offset: 2px;
            }
            
            .toggle-control.active {
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            toggleClicks: 0,
            themeChanges: 0,
            soundToggles: 0,
            errors: 0
        };
        this.startTime = performance.now();
    }

    logMetric(type) {
        this.metrics[type]++;
        if (this.metrics[type] % 10 === 0) {
            console.log(`📊 Performance: ${type} count reached ${this.metrics[type]}`);
        }
    }

    getUptime() {
        return ((performance.now() - this.startTime) / 1000).toFixed(2);
    }
}

// Error Handling
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`❌ Error in ${context}:`, error);
        
        // Log to external service in production
        if (window.location.hostname !== 'localhost') {
            // this.logToService(error, context);
        }
    }

    static wrap(fn, context) {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                ErrorHandler.handle(error, context);
            }
        };
    }
}

// Main Application Class
class LaptopPredictorApp {
    constructor() {
        this.toggleSystem = null;
        this.performanceMonitor = new PerformanceMonitor();
        this.init();
    }

    init() {
        try {
            // Initialize advanced toggle system
            this.toggleSystem = new AdvancedToggle('.toggle-control', {
                enableSound: true,
                enableHaptics: true,
                enableAnimations: true,
                accessibility: true
            });

            // Setup form validation
            this.setupFormValidation();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup error handling
            this.setupErrorHandling();

            console.log('🚀 Laptop Predictor App initialized successfully');
            console.log(`⏱️ Uptime: ${this.performanceMonitor.getUptime()}s`);
            
        } catch (error) {
            ErrorHandler.handle(error, 'App initialization');
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const submitHandler = ErrorHandler.wrap((e) => {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#dc3545';
                        field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
                    } else {
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    this.showNotification('Please fill in all required fields', 'error');
                }
            }, 'Form validation');

            form.addEventListener('submit', submitHandler);
        });
    }

    setupPerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000);
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            ErrorHandler.handle(event.error, 'Global error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            ErrorHandler.handle(event.reason, 'Unhandled promise rejection');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
        `;

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Simple and Reliable Toggle Switches
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Setting up toggle switches...');
    
    // Find all toggle controls
    const toggleControls = document.querySelectorAll('.toggle-control');
    console.log('Found toggle controls:', toggleControls.length);
    
    // Add click listeners to each toggle control
    toggleControls.forEach(function(control) {
        control.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = this.getAttribute('data-action');
            console.log('Toggle clicked:', action);
            
            // Toggle the active class on the control
            this.classList.toggle('active');
            
            // Toggle the active class on the switch
            const toggleSwitch = this.querySelector('.toggle-3d');
            if (toggleSwitch) {
                toggleSwitch.classList.toggle('active');
            }
            
            // Update the icon
            const icon = this.querySelector('.toggle-icon');
            if (icon) {
                if (action === 'dark-mode') {
                    icon.textContent = this.classList.contains('active') ? '☀️' : '🌙';
                    // Toggle dark mode on body
                    document.body.classList.toggle('dark-mode');
                } else if (action === 'sound') {
                    icon.textContent = this.classList.contains('active') ? '🔇' : '🔊';
                }
            }
            
            // Add a small animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('✅ Toggle switches setup complete!');
    
    // Add some visual feedback when page loads
    setTimeout(() => {
        const controls = document.querySelector('.floating-controls');
        if (controls) {
            controls.style.opacity = '0';
            controls.style.transform = 'translateY(-20px)';
            controls.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                controls.style.opacity = '1';
                controls.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 500);
}); 