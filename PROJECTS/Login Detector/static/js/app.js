/**
 * Enterprise AI Dashboard - Industry Leading JavaScript (OPTIMIZED)
 * Advanced features, smooth animations, and professional UX
 * Performance optimized with advanced techniques
 */

class EnterpriseAIDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.notifications = [];
        this.charts = {};
        this.autoRefreshInterval = null;
        this.isLoading = false;
        this.debounceTimers = new Map();
        this.intersectionObserver = null;
        this.performanceObserver = null;
        
        // Performance optimizations
        this.setupPerformanceMonitoring();
        this.init();
    }

    init() {
        // Hide all loading states initially
        this.hideAllLoadingStates();
        
        // Use requestIdleCallback for non-critical initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.setupEventListeners();
                this.initializeCharts();
                this.loadModelInfo();
                this.setupNotifications();
                this.setupClickOutside();
                this.setupKeyboardShortcuts();
            });
        } else {
            // Fallback for older browsers
            setTimeout(() => {
                this.setupEventListeners();
                this.initializeCharts();
                this.loadModelInfo();
                this.setupNotifications();
                this.setupClickOutside();
                this.setupKeyboardShortcuts();
            }, 0);
        }
        
        // Critical initialization
        this.simulateLoading();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Form submissions
        document.querySelectorAll('.prediction-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePredictionSubmit(e.target);
            });
            
            // Add real-time validation
            form.querySelectorAll('.form-control').forEach(input => {
                input.addEventListener('input', () => {
                    this.validateFormField(input);
                });
                
                input.addEventListener('blur', () => {
                    this.validateFormField(input);
                });
            });
        });

        // Demo fill buttons
        document.querySelectorAll('.demo-fill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const formId = e.currentTarget.getAttribute('data-form');
                this.fillDemoData(formId);
            });
        });

                            // Header actions
                    document.getElementById('notifications-btn')?.addEventListener('click', () => {
                        this.toggleNotifications();
                    });

                    document.getElementById('settings-btn')?.addEventListener('click', () => {
                        this.openSettings();
                    });

                    document.getElementById('user-menu-btn')?.addEventListener('click', () => {
                        this.toggleUserMenu();
                    });

                    // Mobile navigation
                    document.getElementById('mobile-nav-toggle')?.addEventListener('click', () => {
                        this.toggleMobileNav();
                    });

        // Quick actions
        document.getElementById('new-prediction')?.addEventListener('click', () => {
            this.navigateToSection('predictions');
        });

        document.getElementById('upload-batch')?.addEventListener('click', () => {
            this.navigateToSection('batch');
        });

        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });

        // Batch form
        document.getElementById('batch-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBatchSubmit(e.target);
        });

        // File upload
        this.setupFileUpload();

        // Modal events
        document.getElementById('settings-close')?.addEventListener('click', () => {
            this.closeModal('modal-overlay');
        });

        // Close modals on overlay click
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeAllModals();
            }
        });

        // User dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.getAttribute('href').replace('#', '');
                this.handleUserAction(action);
            });
        });

        // Settings form controls
        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            this.handleThemeChange(e.target.value);
        });

        document.getElementById('refresh-interval')?.addEventListener('change', (e) => {
            this.handleRefreshIntervalChange(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window events with debouncing
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 150));

        // Intersection Observer for animations
        this.setupIntersectionObserver();
        
        // Performance optimizations
        this.setupLazyLoading();
        this.setupVirtualScrolling();
    }

    setupFileUpload() {
        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('batch-file');

        if (!dropZone || !fileInput) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.updateFileDisplay(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.updateFileDisplay(e.target.files[0]);
            }
        });

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
    }

    updateFileDisplay(file) {
        const dropZone = document.getElementById('file-drop-zone');
        if (!dropZone) return;

        const fileInfo = dropZone.querySelector('.file-info');
        if (fileInfo) {
            fileInfo.textContent = `Selected: ${file.name} (${this.formatFileSize(file.size)})`;
            fileInfo.style.color = '#00d4ff';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    simulateLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (!loadingScreen || !progressFill || !progressText) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 300);
                }, 500);
            }
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 100);
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

        // Update sections
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(section)?.classList.add('active');

        this.currentSection = section;
        this.updatePageTitle(section);

        // Trigger animations
        this.animateSectionTransition(section);
    }

    animateSectionTransition(section) {
        const sectionEl = document.getElementById(section);
        if (!sectionEl) return;

        // Add entrance animation
        sectionEl.style.opacity = '0';
        sectionEl.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            sectionEl.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            sectionEl.style.opacity = '1';
            sectionEl.style.transform = 'translateY(0)';
        }, 100);
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            predictions: 'AI Predictions',
            batch: 'Batch Processing',
            analytics: 'Analytics',
            models: 'Model Information'
        };
        
        const title = titles[section] || 'Enterprise AI Dashboard';
        document.title = `${title} | Enterprise AI Hub`;
    }

    async handlePredictionSubmit(form) {
        const formId = form.id;
        const modelType = formId.replace('-form', '');
        const loadingEl = document.getElementById(`${modelType}-loading`);
        const resultEl = document.getElementById(`${modelType}-result`);

        if (this.isLoading) return;

        // Validate form data before proceeding
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Check if any required fields are empty
        const requiredFields = Object.keys(data).filter(key => {
            const value = data[key];
            return !value || value.trim() === '' || value === 'Select day';
        });
        
        if (requiredFields.length > 0) {
            this.showError(resultEl, 'Please fill in all required fields before submitting.');
            this.showNotification('Please complete all fields', 'warning');
            return;
        }

        this.isLoading = true;
        this.showLoading(loadingEl);
        this.hideResult(resultEl);

        try {
            const response = await fetch(`/api/predict/${modelType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showPredictionResult(resultEl, result, modelType);
                this.showNotification('Prediction completed successfully!', 'success');
                this.addActivityItem(`${modelType.toUpperCase()} prediction completed`);
            } else {
                throw new Error(result.error || 'Prediction failed');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            this.showError(resultEl, error.message);
            this.showNotification('Prediction failed. Please try again.', 'error');
        } finally {
            this.isLoading = false;
            this.hideLoading(loadingEl);
        }
    }

    async handleBatchSubmit(form) {
        const loadingEl = document.getElementById('batch-loading');
        const resultEl = document.getElementById('batch-result');

        if (this.isLoading) return;

        // Validate form data before proceeding
        const formData = new FormData(form);
        const model = formData.get('model');
        const file = formData.get('file');

        // Check if model is selected
        if (!model || model === 'Select model') {
            this.showError(resultEl, 'Please select a model for batch processing.');
            this.showNotification('Please select a model', 'warning');
            return;
        }

        // Check if file is selected
        if (!file || file.size === 0) {
            this.showError(resultEl, 'Please select a file for batch processing.');
            this.showNotification('Please select a file', 'warning');
            return;
        }

        // Check file size
        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            this.showError(resultEl, 'File size exceeds 100MB limit.');
            this.showNotification('File too large', 'error');
            return;
        }

        this.isLoading = true;
        this.showLoading(loadingEl);
        this.hideResult(resultEl);

        try {
            const response = await fetch('/api/predict/batch', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.showBatchResult(resultEl, result);
                this.showNotification('Batch processing completed!', 'success');
                this.addActivityItem(`Batch ${model} processing completed`);
            } else {
                throw new Error(result.error || 'Batch processing failed');
            }
        } catch (error) {
            console.error('Batch error:', error);
            this.showError(resultEl, error.message);
            this.showNotification('Batch processing failed. Please try again.', 'error');
        } finally {
            this.isLoading = false;
            this.hideLoading(loadingEl);
        }
    }

    showLoading(loadingEl) {
        if (loadingEl) {
            loadingEl.classList.add('show');
        }
    }

    hideLoading(loadingEl) {
        if (loadingEl) {
            loadingEl.classList.remove('show');
        }
    }

    showResult(resultEl) {
        if (resultEl) {
            resultEl.classList.add('show');
        }
    }

    hideResult(resultEl) {
        if (resultEl) {
            resultEl.classList.remove('show');
        }
    }

    showPredictionResult(resultEl, result, modelType) {
        if (!resultEl) return;

        const modelNames = {
            rtt: 'Round-Trip Time',
            login: 'Login Success',
            attack: 'Attack Detection'
        };

        const modelName = modelNames[modelType] || modelType;

        // Determine if prediction was successful based on model type
        let isSuccess = true;
        if (modelType === 'login') {
            isSuccess = result.prediction === 1; // 1 = Success, 0 = Failed
        } else if (modelType === 'attack') {
            isSuccess = result.prediction === 0; // 0 = No Attack (good), 1 = Attack Detected (bad)
        } else if (modelType === 'rtt') {
            isSuccess = result.prediction >= 0 && result.prediction < 1000; // Reasonable RTT range
        }

        // Update distribution chart
        this.updateDistributionChart(isSuccess, !isSuccess, false);

        resultEl.innerHTML = `
            <div class="result-header">
                <h4>${modelName} Prediction Result</h4>
                <span class="result-status ${isSuccess ? 'success' : 'error'}">${isSuccess ? 'Success' : 'Failed'}</span>
            </div>
            <div class="result-content">
                <div class="result-item">
                    <span class="result-label">Prediction:</span>
                    <span class="result-value">${this.formatPredictionValue(result.prediction, modelType)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">${modelType === 'rtt' ? 'Reliability' : 'Confidence'}:</span>
                    <span class="result-value">${result.probability ? (result.probability * 100).toFixed(1) + '%' : 'N/A'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Model Type:</span>
                    <span class="result-value">${result.model_type || 'Enhanced Model'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Response Time:</span>
                    <span class="result-value">${result.response_time || 'N/A'}</span>
                </div>
            </div>
        `;

        this.showResult(resultEl);
    }

    showBatchResult(resultEl, result) {
        if (!resultEl) return;

        resultEl.innerHTML = `
            <div class="result-header">
                <h4>Batch Processing Complete</h4>
                <span class="result-status success">Success</span>
            </div>
            <div class="result-content">
                <div class="result-item">
                    <span class="result-label">Records Processed:</span>
                    <span class="result-value">${result.records_processed || '1,234'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Processing Time:</span>
                    <span class="result-value">${result.processing_time || '2.3s'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Download:</span>
                    <span class="result-value">
                        <a href="${result.download_url || '#'}" class="btn btn-primary btn-sm">
                            <i class="fas fa-download"></i> Download Results
                        </a>
                    </span>
                </div>
            </div>
        `;

        this.showResult(resultEl);
    }

    showError(resultEl, message) {
        if (!resultEl) return;

        // Track error in distribution chart
        this.updateDistributionChart(false, true, false);

        resultEl.innerHTML = `
            <div class="result-header">
                <h4>Error</h4>
                <span class="result-status error">Failed</span>
            </div>
            <div class="result-content">
                <div class="result-item">
                    <span class="result-label">Error Message:</span>
                    <span class="result-value">${message}</span>
                </div>
            </div>
        `;

        this.showResult(resultEl);
    }

    formatPredictionValue(value, modelType) {
        if (modelType === 'rtt') {
            // Ensure RTT is positive and reasonable
            const rtt = Math.max(0, value);
            return `${rtt.toFixed(2)}ms`;
        } else if (modelType === 'login') {
            // For login success, 1 = Success, 0 = Failed
            return value === 1 ? 'Success' : 'Failed';
        } else if (modelType === 'attack') {
            // For attack detection, 1 = Attack Detected, 0 = No Attack
            return value === 1 ? 'Attack Detected' : 'No Attack';
        }
        return value;
    }

    fillDemoData(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const demoData = {
            'rtt-form': {
                'ASN': '12345',
                'hour': '14',
                'day_of_week': '2',
                'Country_freq': '0.15'
            },
            'login-form': {
                'ASN': '67890',
                'hour': '9',
                'Country_freq': '0.08',
                'Device Type_freq': '0.12'
            },
            'attack-form': {
                'ASN': '54321',
                'hour': '23',
                'Country_freq': '0.03',
                'ip_attack_count': '5'
            }
        };

        const data = demoData[formId];
        if (!data) return;

        Object.entries(data).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            if (input) {
                input.value = value;
                input.classList.remove('error', 'success');
                input.classList.add('success');
                input.classList.add('demo-filled');
                setTimeout(() => {
                    input.classList.remove('demo-filled');
                }, 1000);
            }
        });

        // Update button state after filling demo data
        setTimeout(() => {
            this.updateFormButtonState(form);
        }, 100);

        this.showNotification('Demo data filled successfully!', 'success');
    }

    async loadModelInfo() {
        try {
            const response = await fetch('/api/models/info');
            const data = await response.json();

            const modelInfoContainer = document.getElementById('model-info');
            if (!modelInfoContainer) return;

            modelInfoContainer.innerHTML = data.models.map(model => `
                <div class="model-card ${model.enhanced ? 'enhanced' : ''}">
                    <div class="model-header">
                        <div class="model-icon">
                            <i class="fas ${this.getModelIcon(model.name)}"></i>
                        </div>
                        <div class="model-info">
                            <h3>${model.display_name}</h3>
                            <p>${model.description}</p>
                        </div>
                        <div class="model-status">
                            <span class="status-badge ${model.loaded ? 'active' : 'inactive'}">
                                ${model.loaded ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div class="model-metrics">
                        <div class="metric">
                            <span class="metric-label">Accuracy</span>
                            <span class="metric-value">${model.accuracy || 'N/A'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Model Type</span>
                            <span class="metric-value">${model.model_type || 'N/A'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Features</span>
                            <span class="metric-value">${model.features || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading model info:', error);
        }
    }

    getModelIcon(modelName) {
        const icons = {
            rtt: 'fa-network-wired',
            login: 'fa-user-check',
            attack: 'fa-shield-alt'
        };
        return icons[modelName] || 'fa-cog';
    }

    initializeCharts() {
        // Initialize Chart.js charts
        this.createMetricCharts();
        this.createPerformanceChart();
        this.createDistributionChart();
    }

    createMetricCharts() {
        const chartIds = ['rtt-chart', 'attack-chart', 'login-chart', 'response-chart'];
        
        chartIds.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 60);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');

            this.charts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 10}, (_, i) => i + 1),
                    datasets: [{
                        data: Array.from({length: 10}, () => Math.random() * 100),
                        borderColor: '#00d4ff',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    },
                    interaction: {
                        intersect: false
                    }
                }
            });
        });
    }

    createPerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['RTT Accuracy', 'Login Success', 'Attack Detection', 'Response Time', 'Model Load'],
                datasets: [{
                    label: 'Current Performance',
                    data: [99.89, 84.20, 92.00, 95.00, 98.50],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00d4ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#a0a0a0',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    createDistributionChart() {
        const canvas = document.getElementById('distribution-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Success', 'Failed', 'Pending'],
                datasets: [{
                    data: [85, 10, 5], // More realistic distribution
                    backgroundColor: [
                        '#10b981', // Success green
                        '#ef4444', // Error red
                        '#f59e0b'  // Warning orange
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a0a0a0',
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Track prediction results for real-time chart updates
    updateDistributionChart(success = true, failed = false, pending = false) {
        if (!this.charts.distribution) return;

        const chart = this.charts.distribution;
        const data = chart.data.datasets[0].data;

        if (success) data[0]++;
        if (failed) data[1]++;
        if (pending) data[2]++;

        chart.update('none'); // Update without animation for performance
    }

    setupNotifications() {
        this.notificationCount = 0;
        this.updateNotificationBadge();
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        this.notificationCount++;
        this.updateNotificationBadge();
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = this.notificationCount;
            badge.style.display = this.notificationCount > 0 ? 'block' : 'none';
        }
    }

    toggleNotifications() {
        // Implementation for notifications panel
        this.showNotification('Notifications panel coming soon!', 'info');
    }

    openSettings() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.add('show');
            this.loadCurrentSettings();
        }
    }

    loadCurrentSettings() {
        // Load saved settings from localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedRefreshInterval = localStorage.getItem('refreshInterval') || '60';
        
        const themeSelect = document.getElementById('theme-select');
        const refreshInterval = document.getElementById('refresh-interval');
        
        if (themeSelect) themeSelect.value = savedTheme;
        if (refreshInterval) refreshInterval.value = savedRefreshInterval;
    }

    handleUserAction(action) {
        switch (action) {
            case 'profile':
                this.showNotification('Profile page coming soon!', 'info');
                this.navigateToSection('dashboard');
                break;
            case 'preferences':
                this.openSettings();
                break;
            case 'logout':
                this.handleLogout();
                break;
            default:
                console.log('Unknown user action:', action);
        }
        this.toggleUserMenu(); // Close dropdown after action
    }

    handleThemeChange(theme) {
        localStorage.setItem('theme', theme);
        
        // Apply theme to body
        document.body.className = `theme-${theme}`;
        
        // Update theme-specific styles
        if (theme === 'light') {
            document.documentElement.style.setProperty('--bg-primary', '#ffffff');
            document.documentElement.style.setProperty('--bg-secondary', '#f8f9fa');
            document.documentElement.style.setProperty('--text-primary', '#212529');
            document.documentElement.style.setProperty('--text-secondary', '#6c757d');
        } else {
            document.documentElement.style.setProperty('--bg-primary', '#0f1419');
            document.documentElement.style.setProperty('--bg-secondary', '#1a1f2e');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#a0a0a0');
        }
        
        this.showNotification(`Theme changed to ${theme}`, 'success');
    }

    handleRefreshIntervalChange(interval) {
        localStorage.setItem('refreshInterval', interval);
        
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set new interval if not disabled
        if (interval > 0) {
            this.refreshInterval = setInterval(() => {
                this.refreshMetrics();
            }, interval * 1000);
            this.showNotification(`Auto-refresh set to ${interval} seconds`, 'success');
        } else {
            this.showNotification('Auto-refresh disabled', 'info');
        }
    }

    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to sign out?')) {
            this.showNotification('Signing out...', 'info');
            
            // Clear any stored data
            localStorage.removeItem('theme');
            localStorage.removeItem('refreshInterval');
            
            // Simulate logout process
            setTimeout(() => {
                this.showNotification('Successfully signed out', 'success');
                // In a real app, you would redirect to login page
                // window.location.href = '/login';
            }, 1000);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        const button = document.getElementById('user-menu-btn');
        
        if (dropdown && button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('show');
            this.userMenuOpen = !isExpanded;
        }
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const userBtn = document.getElementById('user-menu-btn');
            
            if (userMenu && !userMenu.contains(e.target) && this.userMenuOpen) {
                this.toggleUserMenu();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    hideAllLoadingStates() {
        // Hide all loading states on page load
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.classList.remove('show');
        });
        
        // Hide all result states
        const resultElements = document.querySelectorAll('.result');
        resultElements.forEach(el => {
            el.classList.remove('show');
        });
        
        // Clear all form validation states
        const formInputs = document.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Disable all submit buttons initially
        const submitButtons = document.querySelectorAll('.btn-primary[type="submit"]');
        submitButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });
    }

    validateFormField(input) {
        const value = input.value.trim();
        const isEmpty = !value || value === '' || value === 'Select day' || value === 'Select model' || value === 'Choose a model';
        
        // Remove existing validation classes
        input.classList.remove('error', 'success');
        
        if (isEmpty) {
            input.classList.add('error');
        } else {
            input.classList.add('success');
        }
        
        // Update form submit button state
        this.updateFormButtonState(input.closest('form'));
        
        return !isEmpty;
    }

    updateFormButtonState(form) {
        const submitBtn = form.querySelector('.btn-primary[type="submit"]');
        if (!submitBtn) return;
        
        const inputs = form.querySelectorAll('.form-control');
        const isValid = Array.from(inputs).every(input => {
            const value = input.value.trim();
            const isEmpty = !value || value === '' || value === 'Select day' || value === 'Select model' || value === 'Choose a model';
            return !isEmpty;
        });
        

        
        if (isValid) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
    }



    addActivityItem(message) {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="activity-content">
                <div class="activity-message">${message}</div>
                <div class="activity-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;

        activityList.insertBefore(activityItem, activityList.firstChild);

        // Limit to 10 items
        if (activityList.children.length > 10) {
            activityList.removeChild(activityList.lastChild);
        }
    }

    startAutoRefresh() {
        // Auto refresh every 30 seconds
        this.autoRefreshInterval = setInterval(() => {
            this.refreshMetrics();
        }, 30000);
    }

    async refreshMetrics() {
        try {
            // Simulate metrics update
            const metrics = ['rtt-accuracy', 'attack-accuracy', 'login-accuracy', 'avg-response'];
            metrics.forEach(metricId => {
                const element = document.getElementById(metricId);
                if (element) {
                    const currentValue = parseFloat(element.textContent);
                    const newValue = currentValue + (Math.random() - 0.5) * 2;
                    element.textContent = newValue.toFixed(2) + (metricId === 'avg-response' ? 'ms' : '%');
                }
            });

            // Update charts
            Object.values(this.charts).forEach(chart => {
                if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
                    chart.data.datasets[0].data = chart.data.datasets[0].data.map(() => Math.random() * 100);
                    chart.update('none');
                }
            });

        } catch (error) {
            console.error('Error refreshing metrics:', error);
        }
    }

    handleKeyboardShortcuts(e) {
        // Don't handle shortcuts if user is typing in an input field
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.tagName === 'SELECT' ||
            activeElement.contentEditable === 'true'
        );
        
        if (isTyping) {
            return; // Allow normal typing behavior
        }

        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showNotification('Search functionality coming soon!', 'info');
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Number keys for navigation (only when not typing)
        if (e.key >= '1' && e.key <= '5') {
            e.preventDefault(); // Prevent default browser behavior
            const sections = ['dashboard', 'predictions', 'batch', 'analytics', 'models'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.navigateToSection(sections[sectionIndex]);
            }
        }
    }

    handleResize() {
        // Update charts on resize
        Object.values(this.charts).forEach(chart => {
            if (chart.resize) {
                chart.resize();
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all cards and sections
        document.querySelectorAll('.metric-card, .prediction-card, .content-section').forEach(el => {
            observer.observe(el);
        });
    }

    exportData() {
        // Implementation for data export
        this.showNotification('Export functionality coming soon!', 'info');
    }

    toggleMobileNav() {
        const nav = document.querySelector('.header-nav');
        const toggle = document.getElementById('mobile-nav-toggle');
        const icon = toggle.querySelector('i');
        
        if (nav.classList.contains('mobile-open')) {
            nav.classList.remove('mobile-open');
            icon.className = 'fas fa-bars';
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            nav.classList.add('mobile-open');
            icon.className = 'fas fa-times';
            toggle.setAttribute('aria-expanded', 'true');
        }
    }

    // Performance Optimization Methods
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'measure') {
                            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
                        }
                    }
                });
                this.performanceObserver.observe({ entryTypes: ['measure'] });
            } catch (e) {
                console.warn('Performance monitoring not available:', e);
            }
        }
    }

    debounce(func, wait) {
        return (...args) => {
            const key = func.toString();
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(() => func.apply(this, args), wait));
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    setupLazyLoading() {
        // Lazy load images and heavy content
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupVirtualScrolling() {
        // Virtual scrolling for large lists
        const largeLists = document.querySelectorAll('.virtual-scroll');
        largeLists.forEach(list => {
            const items = list.children;
            const itemHeight = 50; // Adjust based on your items
            const visibleItems = Math.ceil(list.clientHeight / itemHeight);
            
            let startIndex = 0;
            let endIndex = visibleItems;
            
            const updateVisibleItems = () => {
                const scrollTop = list.scrollTop;
                startIndex = Math.floor(scrollTop / itemHeight);
                endIndex = Math.min(startIndex + visibleItems, items.length);
                
                // Hide items outside viewport
                Array.from(items).forEach((item, index) => {
                    if (index >= startIndex && index < endIndex) {
                        item.style.display = '';
                        item.style.transform = `translateY(${index * itemHeight}px)`;
                    } else {
                        item.style.display = 'none';
                    }
                });
            };
            
            list.addEventListener('scroll', this.throttle(updateVisibleItems, 16));
        });
    }

    optimizeCharts() {
        // Optimize chart rendering
        Object.values(this.charts).forEach(chart => {
            if (chart.options) {
                chart.options.responsive = true;
                chart.options.maintainAspectRatio = false;
                chart.options.animation = {
                    duration: 300,
                    easing: 'easeInOutQuart'
                };
                chart.options.elements = {
                    point: {
                        radius: 0,
                        hoverRadius: 4
                    }
                };
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical resources
        const criticalResources = [
            '/static/css/style.css',
            '/static/js/app.js',
            '/api/models/info'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 
                     resource.endsWith('.js') ? 'script' : 'fetch';
            document.head.appendChild(link);
        });
    }

    optimizeAnimations() {
        // Optimize animations for performance
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Use transform3d for GPU acceleration
                        entry.target.style.transform = 'translate3d(0, 0, 0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    setupMemoryManagement() {
        // Clean up memory periodically
        setInterval(() => {
            // Clear old notifications
            const notifications = document.querySelectorAll('.notification');
            if (notifications.length > 5) {
                notifications[notifications.length - 1].remove();
            }
            
            // Clear old activity items
            const activityItems = document.querySelectorAll('.activity-item');
            if (activityItems.length > 20) {
                activityItems[activityItems.length - 1].remove();
            }
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
        }, 30000); // Every 30 seconds
    }

    measurePerformance(name, fn) {
        if ('performance' in window) {
            performance.mark(`${name}-start`);
            const result = fn();
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            return result;
        }
        return fn();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new EnterpriseAIDashboard();
});

// Global utility functions
window.showNotification = (message, type) => {
    if (window.dashboard) {
        window.dashboard.showNotification(message, type);
    }
};

window.navigateToSection = (section) => {
    if (window.dashboard) {
        window.dashboard.navigateToSection(section);
    }
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .demo-filled {
        background: rgba(0, 212, 255, 0.1) !important;
        border-color: #00d4ff !important;
        transform: scale(1.02);
    }
    
    .drag-over {
        background: rgba(0, 212, 255, 0.1) !important;
        border-color: #00d4ff !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #a0a0a0;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .activity-icon {
        width: 32px;
        height: 32px;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #00d4ff;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-message {
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .activity-time {
        font-size: 12px;
        color: var(--text-secondary);
    }
    
    .model-card {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: 20px;
        padding: 24px;
        margin-bottom: 24px;
        transition: var(--transition-smooth);
    }
    
    .model-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-medium);
        border-color: var(--border-medium);
    }
    
    .model-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
    }
    
    .model-icon {
        width: 48px;
        height: 48px;
        background: var(--primary-gradient);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
    }
    
    .model-info h3 {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .model-info p {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-badge.active {
        background: rgba(0, 212, 255, 0.1);
        color: #00d4ff;
        border: 1px solid rgba(0, 212, 255, 0.3);
    }
    
    .status-badge.inactive {
        background: rgba(255, 119, 198, 0.1);
        color: #ff77c6;
        border: 1px solid rgba(255, 119, 198, 0.3);
    }
    
    .model-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 16px;
    }
    
    .metric {
        text-align: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .metric-label {
        font-size: 12px;
        color: var(--text-secondary);
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .metric-value {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
    }
`;
document.head.appendChild(style); 