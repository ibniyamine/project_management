// Projects page JavaScript for DataCollab Platform

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializeViewToggle();
    initializeProjectCards();
});

// Initialize filter functionality
function initializeFilters() {
    const filterSelects = document.querySelectorAll('.card select');
    const filterButton = document.querySelector('.btn-primary');
    
    filterButton.addEventListener('click', applyFilters);
    
    // Rating filter
    const ratingStars = document.querySelectorAll('.rating-filter .fa-star');
    let selectedRating = 0;
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            updateRatingDisplay(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateRatingDisplay(index + 1);
        });
    });
    
    document.querySelector('.rating-filter').addEventListener('mouseleave', function() {
        updateRatingDisplay(selectedRating);
    });
    
    function updateRatingDisplay(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.style.color = '#f6c23e';
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.style.color = '#858796';
            }
        });
    }
}

// Apply filters to project list
function applyFilters() {
    const analysisType = document.querySelector('select').value;
    const status = document.querySelectorAll('select')[1].value;
    const role = document.querySelectorAll('select')[2].value;
    
    // Show loading state
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.style.opacity = '0.5';
    
    // Simulate API call
    setTimeout(() => {
        // Filter logic would go here
        projectsGrid.style.opacity = '1';
        showToast('Filtres appliqués avec succès', 'success');
    }, 500);
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder="Rechercher un projet..."]');
    const searchButton = document.querySelector('.btn-outline-secondary');
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
}

// Perform search
function performSearch(query) {
    if (query.length < 2) return;
    
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;
    
    projectCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        const author = card.querySelector('small').textContent.toLowerCase();
        
        const matches = title.includes(query.toLowerCase()) || 
                       description.includes(query.toLowerCase()) || 
                       author.includes(query.toLowerCase());
        
        if (matches) {
            card.closest('.col-lg-4').style.display = 'block';
            visibleCount++;
        } else {
            card.closest('.col-lg-4').style.display = 'none';
        }
    });
    
    // Update results count
    document.querySelector('.text-muted').textContent = `${visibleCount} projets trouvés`;
}

// Initialize view toggle (grid/list)
function initializeViewToggle() {
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const projectsGrid = document.getElementById('projectsGrid');
    
    gridViewBtn.addEventListener('change', function() {
        if (this.checked) {
            projectsGrid.className = 'row';
            document.querySelectorAll('.col-lg-4').forEach(col => {
                col.className = 'col-lg-4 col-md-6 mb-4';
            });
        }
    });
    
    listViewBtn.addEventListener('change', function() {
        if (this.checked) {
            projectsGrid.className = 'row';
            document.querySelectorAll('.col-lg-4').forEach(col => {
                col.className = 'col-12 mb-3';
            });
            // Add list-specific styling
            document.querySelectorAll('.project-card').forEach(card => {
                card.classList.add('list-view');
            });
        }
    });
}

// Initialize project card interactions
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add click handler to navigate to project detail
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons or links
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            // Navigate to project detail page
            window.location.href = 'project-detail.html';
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 0.5rem 2rem 0 rgba(58, 59, 69, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)';
        });
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Utility function to format dates
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `il y a ${minutes} min`;
    } else if (hours < 24) {
        return `il y a ${hours}h`;
    } else {
        return `il y a ${days}j`;
    }
}
