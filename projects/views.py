from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.http import JsonResponse, HttpResponseForbidden
from django.core.paginator import Paginator
from django.db.models import Q, Avg
from django.utils import timezone
from .models import User, Project, Notebook, Collaboration, Rating, Comment
from .forms import ProjectForm, NotebookForm, CollaborationForm, RatingForm, CommentForm, UserRegistrationForm
import json
import nbformat
from nbconvert import HTMLExporter
from django.http import HttpResponse


def home(request):
    """Home page with recent projects"""
    recent_projects = Project.objects.filter(status='active').order_by('-created_at')[:6]
    context = {
        'recent_projects': recent_projects,
    }
    return render(request, 'projects/home.html', context)



def dashboard(request):
    """User dashboard"""
    # user_projects = Project.objects.filter(creator=request.user)
    user_projects = Project.objects.filter(status__in=['active', 'completed'])
    notebook = Notebook.objects.all()

    # collaborated_projects = Project.objects.filter(collaborators=request.user)
    collaborated_projects = Project.objects.all()
    

    pending_requests = Collaboration.objects.filter(
        project__creator=request.user, 
        status='pending'
    )
    
    context = {
        'user_projects': user_projects,
        'collaborated_projects': collaborated_projects,
        'pending_requests': pending_requests,
        'total_projects': user_projects.count(),
        'total_collaborations': collaborated_projects.count(),
        'pending_count': pending_requests.count(),
        'notebook': notebook.count()
    }
    return render(request, 'projects/index.html', context)

@login_required
def project_list(request):
    """List all projects with filtering and search"""
    projects = Project.objects.filter(creator=request.user)
    notebook = Notebook.objects.filter(author=request.user)
    projects_active = projects.filter(status='active')
    projects_complet = projects.filter(status='completed')
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        projects = projects.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Filter by analysis type
    analysis_type = request.GET.get('analysis_type', '')
    if analysis_type:
        projects = projects.filter(analysis_type=analysis_type)
    
    # Filter by status
    status = request.GET.get('status', '')
    if status:
        projects = projects.filter(status=status)
    
    # Pagination
    paginator = Paginator(projects, 9)  # 9 projects per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'analysis_type': analysis_type,
        'status': status,
        'analysis_types': Project.ANALYSIS_TYPES,
        'status_choices': Project.STATUS_CHOICES,
        'project' : projects.count(),
        'project_active' : projects_active.count(),
        'project_completer' : projects_complet.count(),
        'notebook': notebook.count(),
        'projects': projects
    }
    return render(request, 'projects/my-projects.html', context)


def project_detail(request, pk):
    """Project detail view"""
    project = get_object_or_404(Project, pk=pk)
    notebooks = project.notebooks.all()
    # collaborators = project.collaborators.all()
    collaborators = User.objects.filter(
    collaboration_requests__project=project,
    collaboration_requests__status='approved'
    ).distinct()
    comments = project.comments.all()[:10]
    notes = Rating.objects.filter(project=project)
    total_notes = notes.count()
    note_moyenne = notes.aggregate(Avg('rating'))['rating__avg'] or 0
    note_moyenne = round(note_moyenne, 1)
    note_entier = int(note_moyenne)
    
    # Check if user can view this project
    can_view = (
        project.status in ['active', 'completed'] or
        request.user == project.creator or
        request.user in project.collaborators.all()
    )
    
    if not can_view:
        return HttpResponseForbidden("Vous n'avez pas l'autorisation de voir ce projet.")
    
    # verifier le status de la collaboration
    collaboration_status = None
    if request.user.is_authenticated and request.user != project.creator:
        try:
            collaboration = Collaboration.objects.get(project=project, user=request.user)
            collaboration_status = collaboration.status
        except Collaboration.DoesNotExist:
            pass
    
    # vierifier si l'utilisateur a noter ce projet
    user_rating = None
    if request.user.is_authenticated:
        try:
            user_rating = Rating.objects.get(project=project, user=request.user)
        except Rating.DoesNotExist:
            pass
    



    # Gestion des  commentaires
    if request.method == 'POST':
        action = request.POST.get("action")

        if request.user == project.creator:
            messages.error(request, "Vous ne pouvez pas noter votre propre projet.")
            return redirect('project_detail', pk=project.pk)
        
        if action == "add_comment":
            formCommente = CommentForm(request.POST)
            if formCommente.is_valid():
                comment = formCommente.save(commit=False)
                comment.project = project
                comment.author = request.user
                comment.save()
                messages.success(request, 'Commentaire ajouté!')
                return redirect('project_detail', pk=project.pk)
            
                
        
        elif action == "rate_project":
            formNote = RatingForm(request.POST)
            if formNote.is_valid():
                rating, created = Rating.objects.get_or_create(
                    project=project,
                    user=request.user,
                    defaults={'rating': formNote.cleaned_data['rating']}
                )
                if not created:
                    rating.rating = formNote.cleaned_data['rating']
                    rating.save()
                
                messages.success(request, 'Note ajoutée avec succès!')
                return redirect('project_detail', pk=project.pk)
    else:
        formNote = RatingForm()
        formCommente = CommentForm()


    
    #Gestion des nototations
    # if project.status != 'completed':
    #     messages.error(request, "Vous ne pouvez noter que les projets terminés.")
    #     return redirect('project_detail', pk=project.pk)
    
    



    
    context = {
        'note_entier': range(note_entier),
        'note_moyenne':note_moyenne,
        'total_notes':total_notes,
        'project': project,
        'notebooks': notebooks,
        'notebook_count': notebooks.count(),
        'comments_count': comments.count(),
        'collaborators' : collaborators,
        'comments': comments,
        'formC': formCommente,
        'formN': formNote,
        'collaboration_status': collaboration_status,
        'user_rating': user_rating,
        'collaboration': collaborators.count(),
        'can_collaborate': (
            request.user.is_authenticated and 
            request.user != project.creator and 
            collaboration_status != 'approved'
        ),
        'can_rate': (
            request.user.is_authenticated and 
            project.status == 'completed' and
            request.user != project.creator
        ),
    }

    return render(request, 'projects/project-detail.html', context)


    

#@login_required
def create_project(request):
    """Create a new project"""
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        print("le project n'est pas enregistrer")
        if form.is_valid():
            print("le project est enregistrer")
            project = form.save(commit=False)
            project.creator = request.user
            project.save()
            messages.success(request, 'Projet créé avec succès!')
            # return redirect('project_detail', pk=project.pk)
            return redirect('project_list')
    else:
        form = ProjectForm()
       
    
    return render(request, 'projects/create-project.html', {'form': form})


#@login_required
def edit_project(request, pk):
    """Edit project (only creator or chercheur collaborators)"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions
    can_edit = (
        request.user == project.creator or
        (request.user in project.collaborators.all() and request.user.role == 'chercheur')
    )
    
    if not can_edit:
        return HttpResponseForbidden("Vous n'avez pas l'autorisation de modifier ce projet.")
    
    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            messages.success(request, 'Projet modifié avec succès!')
            return redirect('project_detail', pk=project.pk)
    else:
        form = ProjectForm(instance=project)
    
    return render(request, 'projects/edit_project.html', {'form': form, 'project': project})


#@login_required
def upload_notebook(request, project_pk):
    """Upload notebook to project"""
    project = get_object_or_404(Project, pk=project_pk)
    
    # Check permissions
    can_upload = (
        request.user == project.creator or
        request.user in project.collaborators.all()
    )
    
    if not can_upload:
        print("vous avez pas la permission")
        return HttpResponseForbidden("Vous n'avez pas l'autorisation d'ajouter des notebooks à ce projet.")
    
    
    if request.method == 'POST':
        form = NotebookForm(request.POST, request.FILES)
        if form.is_valid():
            print(" le project n'est pas encore charger")
            notebook = form.save(commit=False)
            notebook.project = project
            notebook.author = request.user
            notebook.save()
            messages.success(request, 'Notebook ajouté avec succès!')
            return redirect('project_detail', pk=project.pk)
    else:
        form = NotebookForm()
    
    return render(request, 'projects/upload-notebook.html', {'form': form, 'project': project})

#@login_required
def request_collaboration(request, project_pk):
    """Request to collaborate on a project"""
    project = get_object_or_404(Project, pk=project_pk)
    
    if request.user == project.creator:
        messages.error(request, "Vous ne pouvez pas demander à collaborer sur votre propre projet.")
        return redirect('project_detail', pk=project.pk)
    
    # Check if already requested
    existing_request = Collaboration.objects.filter(project=project, user=request.user).first()
    if existing_request:
        messages.warning(request, "Vous avez déjà fait une demande pour ce projet.")
        return redirect('project_detail', pk=project.pk)
    
    if request.method == 'POST':
        form = CollaborationForm(request.POST)
        if form.is_valid():
            collaboration = form.save(commit=False)
            collaboration.project = project
            collaboration.user = request.user
            collaboration.save()
            messages.success(request, 'Demande de collaboration envoyée!')
            return redirect('project_detail', pk=project.pk)
    else:
        form = CollaborationForm()
    
    return render(request, 'projects/collaboration.html', {'form': form, 'project': project})


#@login_required
def manage_collaborations(request):
    """Manage collaboration requests for user's projects"""
    collaboration_en_attente = Collaboration.objects.filter(
        project__creator=request.user,
        status='pending'
    )
    if request.method == 'POST':
        collaboration_id = request.POST.get('collaboration_id')
        action = request.POST.get('action')
       
        collaboration = get_object_or_404(Collaboration, id=collaboration_id, project__creator=request.user)
        
        if action == 'approve':
            print("la collaboration est prouver")
            collaboration.status = 'approved'
            collaboration.responded_at = timezone.now()
            collaboration.save()
            messages.success(request, f'Collaboration avec {collaboration.user.username} approuvée!')
        elif action == 'reject':
            collaboration.status = 'rejected'
            collaboration.responded_at = timezone.now()
            collaboration.save()
            messages.info(request, f'Collaboration avec {collaboration.user.username} rejetée.')
        
        return redirect('manage_collaborations')
    
    return render(request, 'projects/collaborations_attente.html', {'collaboration_en_attentes': collaboration_en_attente})


#@login_required
def rate_project(request, project_pk):
    """Rate a completed project"""
    project = get_object_or_404(Project, pk=project_pk)
    
    if project.status != 'completed':
        messages.error(request, "Vous ne pouvez noter que les projets terminés.")
        return redirect('project_detail', pk=project.pk)
    
    if request.user == project.creator:
        messages.error(request, "Vous ne pouvez pas noter votre propre projet.")
        return redirect('project_detail', pk=project.pk)
    
    if request.method == 'POST':
        form = RatingForm(request.POST)
        if form.is_valid():
            rating, created = Rating.objects.get_or_create(
                project=project,
                user=request.user,
                defaults={'rating': form.cleaned_data['rating']}
            )
            if not created:
                rating.rating = form.cleaned_data['rating']
                rating.save()
            
            messages.success(request, 'Note ajoutée avec succès!')
            return redirect('project_detail', pk=project.pk)
    else:
        try:
            existing_rating = Rating.objects.get(project=project, user=request.user)
            form = RatingForm(initial={'rating': existing_rating.rating})
        except Rating.DoesNotExist:
            form = RatingForm()
    
    return render(request, 'projects/rate_project.html', {'form': form, 'project': project})

def register(request):
    """User registration"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Compte créé pour {username}!')
            return redirect('login')
    else:
        form = UserRegistrationForm()
    
    return render(request, 'projects/register.html', {'form': form})




def notebook_html_view(request, notebook_pk):
    # Récupérer le notebook
    notebook = get_object_or_404(Notebook, pk=notebook_pk)
    
    # Charger le fichier .ipynb
    with open(notebook.file.path, 'r', encoding='utf-8') as f:
        nb_node = nbformat.read(f, as_version=4)
    
    # Convertir en HTML
    html_exporter = HTMLExporter()
    body, _ = html_exporter.from_notebook_node(nb_node)

    # Retourner le HTML directement
    return HttpResponse(body)