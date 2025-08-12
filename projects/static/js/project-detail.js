// Project Detail JavaScript for DataCollab Platform

document.addEventListener('DOMContentLoaded', function() {
    initializeRatingSystem();
    initializeNotebookActions();
    initializeCollaborationRequests();
    initializeComments();
});

// Initialize rating system
function initializeRatingSystem() {
    const ratingStars = document.querySelectorAll('.rating-input .fa-star');
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
    
    document.querySelector('.rating-input').addEventListener('mouseleave', function() {
        updateRatingDisplay(selectedRating);
    });
    
    function updateRatingDisplay(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f6c23e';
            } else {
                star.style.color = '#e3e6f0';
            }
        });
    }
}

// Initialize notebook actions
function initializeNotebookActions() {
    // View notebook buttons
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.textContent.includes('Voir')) {
            btn.addEventListener('click', function() {
                // Simulate opening notebook viewer
                showToast('Ouverture du notebook...', 'info');
                setTimeout(() => {
                    window.open('#', '_blank');
                }, 1000);
            });
        }
    });
    
    // Download notebook buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        if (btn.textContent.includes('Télécharger')) {
            btn.addEventListener('click', function() {
                // Simulate download
                showToast('Téléchargement en cours...', 'success');
            });
        }
    });
}

// Initialize collaboration requests
function initializeCollaborationRequests() {
    const joinBtn = document.querySelector('[data-bs-target="#joinProjectModal"]');
    const sendRequestBtn = document.querySelector('#joinProjectModal .btn-primary');
    
    if (sendRequestBtn) {
        sendRequestBtn.addEventListener('click', function() {
            const motivation = document.querySelector('#joinProjectModal textarea').value;
            const skills = document.querySelector('#joinProjectModal input').value;
            
            if (!motivation.trim()) {
                showAlert('Veuillez saisir un message de motivation', 'warning');
                return;
            }
            
            // Simulate sending request
            this.disabled = true;
            this.innerHTML = '<span class="loading-spinner me-2"></span>Envoi...';
            
            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('joinProjectModal')).hide();
                showToast('Demande de collaboration envoyée avec succès!', 'success');
                
                // Update join button
                joinBtn.innerHTML = '<i class="fas fa-clock me-1"></i>Demande envoyée';
                joinBtn.classList.remove('btn-primary');
                joinBtn.classList.add('btn-warning');
                joinBtn.disabled = true;
            }, 2000);
        });
    }
}

// Initialize comments system
function initializeComments() {
    const publishBtn = document.querySelector('.btn-primary[data-action="publish-comment"]') || 
                      document.querySelector('.card-body .btn-primary');
    
    if (publishBtn && publishBtn.textContent.includes('Publier')) {
        publishBtn.addEventListener('click', function() {
            const commentText = document.querySelector('textarea[placeholder*="avis"]').value;
            const rating = document.querySelectorAll('.rating-input .fa-star[style*="rgb(246, 194, 62)"]').length;
            
            if (!commentText.trim()) {
                showAlert('Veuillez saisir un commentaire', 'warning');
                return;
            }
            
            if (rating === 0) {
                showAlert('Veuillez donner une note', 'warning');
                return;
            }
            
            // Simulate posting comment
            this.disabled = true;
            this.innerHTML = '<span class="loading-spinner me-2"></span>Publication...';
            
            setTimeout(() => {
                addNewComment(commentText, rating);
                document.querySelector('textarea[placeholder*="avis"]').value = '';
                resetRating();
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Publier';
                showToast('Commentaire publié avec succès!', 'success');
            }, 1500);
        });
    }
}

// Add new comment to the list
function addNewComment(text, rating) {
    const commentsContainer = document.querySelector('.comment-item').parentNode;
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    
    const stars = Array(5).fill(0).map((_, i) => 
        i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join('');
    
    newComment.innerHTML = `
        <div class="d-flex align-items-start">
            <div class="comment-avatar me-3">MD</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0">Dr. Marie Dupont</h6>
                    <div class="rating">${stars}</div>
                </div>
                <small class="text-muted">Chercheur • À l'instant</small>
                <p class="mt-2 mb-0">${text}</p>
            </div>
        </div>
    `;
    
    // Insert after the comment form
    const commentForm = commentsContainer.querySelector('.mb-4');
    commentForm.parentNode.insertBefore(newComment, commentForm.nextSibling);
}

// Reset rating display
function resetRating() {
    document.querySelectorAll('.rating-input .fa-star').forEach(star => {
        star.style.color = '#e3e6f0';
    });
}

// Favorite button functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-outline-secondary') && e.target.textContent.includes('Favoris')) {
        const btn = e.target.closest('.btn-outline-secondary');
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('fa-star')) {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-outline-secondary');
            showToast('Retiré des favoris', 'info');
        } else {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-warning');
            showToast('Ajouté aux favoris', 'success');
        }
    }
});

// Share button functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-outline-secondary') && e.target.textContent.includes('Partager')) {
        // Simulate sharing
        if (navigator.share) {
            navigator.share({
                title: 'Prédiction de Churn Client - DataCollab',
                text: 'Découvrez ce projet de Data Science sur DataCollab',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Lien copié dans le presse-papiers', 'success');
            });
        }
    }
});

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
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
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}
