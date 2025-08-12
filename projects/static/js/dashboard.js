// Dashboard JavaScript for DataCollab Platform

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeNotifications();
    initializeThemeToggle();
    loadSavedTheme();
});

// Initialize Chart.js charts
function initializeCharts() {
    // Projects Activity Chart
    const projectsCtx = document.getElementById('projectsChart');
    if (projectsCtx) {
        new Chart(projectsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Projets Créés',
                    data: [2, 4, 3, 5, 7, 6, 8, 9, 7, 10, 8, 12],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Projets Terminés',
                    data: [1, 2, 2, 3, 4, 5, 6, 7, 5, 8, 6, 9],
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Analysis Types Pie Chart
    const analysisCtx = document.getElementById('analysisChart');
    if (analysisCtx) {
        new Chart(analysisCtx, {
            type: 'doughnut',
            data: {
                labels: ['Classification', 'Clustering', 'Régression', 'NLP', 'Computer Vision', 'Autres'],
                datasets: [{
                    data: [30, 25, 20, 15, 7, 3],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#f6c23e',
                        '#e74a3b',
                        '#858796'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Initialize notification system
function initializeNotifications() {
    // Simulate real-time notifications
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every interval
            showNotification();
        }
    }, 10000); // Check every 10 seconds
}

// Show notification toast
function showNotification() {
    const notifications = [
        'Nouveau commentaire sur votre projet',
        'Demande de collaboration reçue',
        'Notebook mis à jour par un collaborateur',
        'Votre projet a reçu une nouvelle étoile'
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-primary border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-bell me-2"></i>${randomNotification}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container (create if doesn't exist)
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add fade-in animation to cards
function addFadeInAnimation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Initialize animations when page loads
window.addEventListener('load', addFadeInAnimation);

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            setTheme(newTheme);
            updateThemeButton(newTheme);
            saveTheme(newTheme);
        });
    }
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update chart colors if they exist
    setTimeout(() => {
        updateChartColors(theme);
    }, 100);
}

// Update theme button appearance
function updateThemeButton(theme) {
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (themeIcon && themeText) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Mode Clair';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Mode Sombre';
        }
    }
}

// Save theme preference
function saveTheme(theme) {
    localStorage.setItem('datacollab-theme', theme);
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('datacollab-theme') || 'light';
    setTheme(savedTheme);
    updateThemeButton(savedTheme);
}

// Update chart colors based on theme
function updateChartColors(theme) {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#e3e6f0' : '#5a5c69';
    const gridColor = isDark ? '#3a3f5c' : 'rgba(0, 0, 0, 0.1)';
    
    // Update existing charts if they exist
    if (window.Chart && window.Chart.instances) {
        window.Chart.instances.forEach(chart => {
            if (chart.options.scales) {
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                }
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = textColor;
                }
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        });
    }
}
