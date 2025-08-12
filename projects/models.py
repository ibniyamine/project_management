from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import os


class User(AbstractUser):
    """Extended user model with roles"""
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('chercheur', 'Chercheur'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='etudiant')
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Project(models.Model):
    """Data Science project model"""
    ANALYSIS_TYPES = [
        ('classification', 'Classification'),
        ('clustering', 'Clustering'),
        ('regression', 'Régression'),
        ('nlp', 'Traitement du langage naturel'),
        ('computer_vision', 'Vision par ordinateur'),
        ('time_series', 'Séries temporelles'),
        ('other', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('active', 'Actif'),
        ('completed', 'Terminé'),
        ('archived', 'Archivé'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    analysis_type = models.CharField(max_length=50, choices=ANALYSIS_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    collaborators = models.ManyToManyField(User, through='Collaboration', related_name='collaborated_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title
    
    @property
    def average_rating(self):
        ratings = self.ratings.all()
        if ratings:
            return sum(r.rating for r in ratings) / len(ratings)
        return 0
    
    @property
    def total_notebooks(self):
        return self.notebooks.count()


class Notebook(models.Model):
    """Jupyter notebook model"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='notebooks')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notebooks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='notebooks/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"
    
    @property
    def file_size(self):
        if self.file:
            return self.file.size
        return 0
    
    @property
    def filename(self):
        if self.file:
            return os.path.basename(self.file.name)
        return ''


class Collaboration(models.Model):
    """Collaboration request and management"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='collaboration_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collaboration_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, help_text="Message de demande de collaboration")
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        unique_together = ['project', 'user']
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user.username} -> {self.project.title} ({self.status})"


class Rating(models.Model):
    """Project rating model"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.project.title}: {self.rating}/5"


class Comment(models.Model):
    """Project comment model"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.username} on {self.project.title}"
