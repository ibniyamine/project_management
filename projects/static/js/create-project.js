// // Create Project JavaScript for DataCollab Platform

// document.addEventListener('DOMContentLoaded', function() {
//     initializeForm();
//     initializeFileUpload();
//     initializeStepNavigation();
// });

// let currentStep = 1;
// const totalSteps = 4;

// // Initialize form functionality
// function initializeForm() {
//     const form = document.getElementById('createProjectForm');
    
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
//         submitProject();
//     });
    
//     // Real-time validation
//     const requiredFields = form.querySelectorAll('[required]');
//     requiredFields.forEach(field => {
//         field.addEventListener('blur', validateField);
//         field.addEventListener('input', clearFieldError);
//     });
    
//     // Auto-generate summary
//     const summaryFields = ['projectTitle', 'analysisType', 'projectDescription'];
//     summaryFields.forEach(fieldId => {
//         document.getElementById(fieldId).addEventListener('input', updateProjectSummary);
//     });
// }

// // Initialize file upload functionality
// function initializeFileUpload() {
//     const uploadArea = document.getElementById('notebookUpload');
//     const fileInput = document.getElementById('notebookFile');
//     const uploadedNotebook = document.getElementById('uploadedNotebook');
    
//     // Click to upload
//     uploadArea.addEventListener('click', () => fileInput.click());
    
//     // Drag and drop
//     uploadArea.addEventListener('dragover', function(e) {
//         e.preventDefault();
//         this.classList.add('dragover');
//     });
    
//     uploadArea.addEventListener('dragleave', function(e) {
//         e.preventDefault();
//         this.classList.remove('dragover');
//     });
    
//     uploadArea.addEventListener('drop', function(e) {
//         e.preventDefault();
//         this.classList.remove('dragover');
        
//         const files = e.dataTransfer.files;
//         if (files.length > 0) {
//             handleFileUpload(files[0]);
//         }
//     });
    
//     // File input change
//     fileInput.addEventListener('change', function() {
//         if (this.files.length > 0) {
//             handleFileUpload(this.files[0]);
//         }
//     });
    
//     // Remove notebook
//     document.getElementById('removeNotebook').addEventListener('click', function() {
//         fileInput.value = '';
//         uploadedNotebook.style.display = 'none';
//         uploadArea.style.display = 'block';
//     });
// }

// // Handle file upload
// function handleFileUpload(file) {
//     // Validate file type
//     if (!file.name.endsWith('.ipynb')) {
//         showAlert('Seuls les fichiers .ipynb sont acceptés', 'danger');
//         return;
//     }
    
//     // Validate file size (10MB max)
//     if (file.size > 10 * 1024 * 1024) {
//         showAlert('Le fichier ne peut pas dépasser 10MB', 'danger');
//         return;
//     }
    
//     // Show uploaded file info
//     document.getElementById('notebookName').textContent = file.name;
//     document.getElementById('notebookSize').textContent = formatFileSize(file.size);
    
//     document.getElementById('notebookUpload').style.display = 'none';
//     document.getElementById('uploadedNotebook').style.display = 'block';
    
//     showAlert('Notebook téléchargé avec succès', 'success');
// }

// // Initialize step navigation
// function initializeStepNavigation() {
//     const nextBtn = document.getElementById('nextStep');
//     const prevBtn = document.getElementById('prevStep');
//     const submitBtn = document.getElementById('submitProject');
    
//     nextBtn.addEventListener('click', nextStep);
//     prevBtn.addEventListener('click', prevStep);
    
//     updateStepDisplay();
// }

// // Navigate to next step
// function nextStep() {
//     if (!validateCurrentStep()) return;
    
//     if (currentStep < totalSteps) {
//         currentStep++;
//         updateStepDisplay();
//         scrollToTop();
//     }
// }

// // Navigate to previous step
// function prevStep() {
//     if (currentStep > 1) {
//         currentStep--;
//         updateStepDisplay();
//         scrollToTop();
//     }
// }

// // Update step display
// function updateStepDisplay() {
//     // Hide all steps
//     document.querySelectorAll('.step-section').forEach(step => {
//         step.style.display = 'none';
//     });
    
//     // Show current step
//     document.getElementById(`step${currentStep}`).style.display = 'block';
    
//     // Update navigation buttons
//     const nextBtn = document.getElementById('nextStep');
//     const prevBtn = document.getElementById('prevStep');
//     const submitBtn = document.getElementById('submitProject');
    
//     prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    
//     if (currentStep === totalSteps) {
//         nextBtn.style.display = 'none';
//         submitBtn.style.display = 'block';
//         updateProjectSummary();
//     } else {
//         nextBtn.style.display = 'block';
//         submitBtn.style.display = 'none';
//     }
// }

// // Validate current step
// function validateCurrentStep() {
//     const currentStepElement = document.getElementById(`step${currentStep}`);
//     const requiredFields = currentStepElement.querySelectorAll('[required]');
//     let isValid = true;
    
//     requiredFields.forEach(field => {
//         if (!validateField({ target: field })) {
//             isValid = false;
//         }
//     });
    
//     // Additional validation for step 1
//     if (currentStep === 1) {
//         const description = document.getElementById('projectDescription').value;
//         if (description.length < 100) {
//             showFieldError('projectDescription', 'La description doit contenir au moins 100 caractères');
//             isValid = false;
//         }
//     }
    
//     return isValid;
// }

// // Validate individual field
// function validateField(e) {
//     const field = e.target;
//     const value = field.value.trim();
    
//     clearFieldError(field);
    
//     if (field.hasAttribute('required') && !value) {
//         showFieldError(field.id, 'Ce champ est obligatoire');
//         return false;
//     }
    
//     // Email validation
//     if (field.type === 'email' && value && !isValidEmail(value)) {
//         showFieldError(field.id, 'Adresse email invalide');
//         return false;
//     }
    
//     return true;
// }

// // Show field error
// function showFieldError(fieldId, message) {
//     const field = document.getElementById(fieldId);
//     field.classList.add('is-invalid');
    
//     // Remove existing error message
//     const existingError = field.parentNode.querySelector('.invalid-feedback');
//     if (existingError) {
//         existingError.remove();
//     }
    
//     // Add error message
//     const errorDiv = document.createElement('div');
//     errorDiv.className = 'invalid-feedback';
//     errorDiv.textContent = message;
//     field.parentNode.appendChild(errorDiv);
// }

// // Clear field error
// function clearFieldError(field) {
//     if (typeof field === 'object' && field.target) {
//         field = field.target;
//     }
    
//     field.classList.remove('is-invalid');
//     const errorMessage = field.parentNode.querySelector('.invalid-feedback');
//     if (errorMessage) {
//         errorMessage.remove();
//     }
// }

// // Update project summary
// function updateProjectSummary() {
//     const title = document.getElementById('projectTitle').value;
//     const type = document.getElementById('analysisType').value;
//     const description = document.getElementById('projectDescription').value;
//     const visibility = document.getElementById('projectVisibility').value;
//     const openCollab = document.getElementById('openCollaboration').checked;
//     const maxCollabs = document.getElementById('maxCollaborators').value;
    
//     const summaryDiv = document.getElementById('projectSummary');
    
//     summaryDiv.innerHTML = `
//         <div class="row">
//             <div class="col-md-6">
//                 <p><strong>Titre:</strong> ${title || 'Non défini'}</p>
//                 <p><strong>Type d'analyse:</strong> ${getAnalysisTypeLabel(type)}</p>
//                 <p><strong>Visibilité:</strong> ${getVisibilityLabel(visibility)}</p>
//             </div>
//             <div class="col-md-6">
//                 <p><strong>Collaboration ouverte:</strong> ${openCollab ? 'Oui' : 'Non'}</p>
//                 <p><strong>Max. collaborateurs:</strong> ${maxCollabs}</p>
//                 <p><strong>Notebook initial:</strong> ${document.getElementById('notebookFile').files.length > 0 ? 'Oui' : 'Non'}</p>
//             </div>
//         </div>
//         ${description ? `<p><strong>Description:</strong> ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}</p>` : ''}
//     `;
// }

// // Submit project
// function submitProject() {
//     if (!validateCurrentStep()) return;
    
//     const submitBtn = document.getElementById('submitProject');
//     const originalText = submitBtn.innerHTML;
    
//     // Show loading state
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>Création en cours...';
    
//     // Simulate API call
//     setTimeout(() => {
//         // Reset button
//         submitBtn.disabled = false;
//         submitBtn.innerHTML = originalText;
        
//         // Show success modal
//         const successModal = new bootstrap.Modal(document.getElementById('successModal'));
//         successModal.show();
        
//         // Save to memory (simulate)
//         saveProjectToMemory();
        
//     }, 2000);
// }

// // Save project data to memory (simulation)
// function saveProjectToMemory() {
//     const projectData = {
//         title: document.getElementById('projectTitle').value,
//         type: document.getElementById('analysisType').value,
//         description: document.getElementById('projectDescription').value,
//         visibility: document.getElementById('projectVisibility').value,
//         createdAt: new Date().toISOString()
//     };
    
//     // In a real app, this would be sent to the server
//     console.log('Project created:', projectData);
// }

// // Utility functions
// function formatFileSize(bytes) {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }

// function getAnalysisTypeLabel(value) {
//     const types = {
//         'classification': 'Classification',
//         'clustering': 'Clustering',
//         'regression': 'Régression',
//         'nlp': 'Traitement du langage naturel',
//         'computer-vision': 'Computer Vision',
//         'time-series': 'Séries temporelles',
//         'deep-learning': 'Deep Learning',
//         'reinforcement-learning': 'Apprentissage par renforcement',
//         'other': 'Autre'
//     };
//     return types[value] || 'Non défini';
// }

// function getVisibilityLabel(value) {
//     const labels = {
//         'public': 'Public',
//         'private': 'Privé',
//         'restricted': 'Restreint'
//     };
//     return labels[value] || 'Non défini';
// }

// function isValidEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }

// function scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }

// function showAlert(message, type = 'info') {
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
//     alertDiv.innerHTML = `
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//     `;
    
//     // Insert at top of form
//     const form = document.getElementById('createProjectForm');
//     form.insertBefore(alertDiv, form.firstChild);
    
//     // Auto-dismiss after 5 seconds
//     setTimeout(() => {
//         if (alertDiv.parentNode) {
//             alertDiv.remove();
//         }
//     }, 5000);
// }
