from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Home and dashboard
    path('', views.home, name='home'),
    path('login/', auth_views.LoginView.as_view(template_name='projects/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Authentication
    path('register/', views.register, name='register'),
    
    # Project management
    path('projects/', views.project_list, name='project_list'),
    path('projects/<int:pk>/', views.project_detail, name='project_detail'),
    path('projects/create/', views.create_project, name='create_project'),
    path('projects/<int:pk>/edit/', views.edit_project, name='edit_project'),
    
    # Notebook management
    path('projects/<int:project_pk>/upload-notebook/', views.upload_notebook, name='upload_notebook'),
    
    # Collaboration management
    path('projects/<int:project_pk>/request-collaboration/', views.request_collaboration, name='request_collaboration'),
    path('collaborations/', views.manage_collaborations, name='manage_collaborations'),
    
    # Rating and comments
    path('projects/<int:project_pk>/rate/', views.rate_project, name='rate_project'),

    # voir le notebook
    path('projects/<int:notebook_pk>/notebook/', views.notebook_html_view, name='notebook_view')

    
]
