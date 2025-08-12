from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Project, Notebook, Collaboration, Rating, Comment


class UserRegistrationForm(UserCreationForm):
    """User registration form with role selection"""
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    role = forms.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'role', 'bio', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add CSS classes to form fields
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
        
        # Customize labels
        self.fields['username'].label = "Nom d'utilisateur"
        self.fields['first_name'].label = "Prénom"
        self.fields['last_name'].label = "Nom"
        self.fields['email'].label = "Adresse email"
        self.fields['role'].label = "Rôle"
        self.fields['bio'].label = "Biographie (optionnel)"
        self.fields['password1'].label = "Mot de passe"
        self.fields['password2'].label = "Confirmer le mot de passe"

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.role = self.cleaned_data['role']
        user.bio = self.cleaned_data['bio']
        if commit:
            user.save()
        return user


class ProjectForm(forms.ModelForm):
    """Project creation and editing form"""
    
    class Meta:
        model = Project
        fields = ('title', 'description', 'analysis_type', 'status')
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Titre du projet'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Description détaillée du projet'}),
            'analysis_type': forms.Select(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'title': 'Titre',
            'description': 'Description',
            'analysis_type': 'Type d\'analyse',
            'status': 'Statut',
        }


class NotebookForm(forms.ModelForm):
    """Notebook upload form"""
    
    class Meta:
        model = Notebook
        fields = ('title', 'description', 'file')
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Titre du notebook'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Description du notebook (optionnel)'}),
            'file': forms.FileInput(attrs={'class': 'form-control', 'accept': '.ipynb'}),
        }
        labels = {
            'title': 'Titre',
            'description': 'Description',
            'file': 'Fichier Jupyter Notebook (.ipynb)',
        }

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            if not file.name.endswith('.ipynb'):
                raise forms.ValidationError("Seuls les fichiers .ipynb sont acceptés.")
            if file.size > 10 * 1024 * 1024:  # 10MB limit
                raise forms.ValidationError("Le fichier ne peut pas dépasser 10MB.")
        return file


class CollaborationForm(forms.ModelForm):
    """Collaboration request form"""
    
    class Meta:
        model = Collaboration
        fields = ('message',)
        widgets = {
            'message': forms.Textarea(attrs={
                'class': 'form-control', 
                'rows': 4, 
                'placeholder': 'Expliquez pourquoi vous souhaitez collaborer sur ce projet...'
            }),
        }
        labels = {
            'message': 'Message de demande',
        }


class RatingForm(forms.ModelForm):
    """Project rating form"""
    
    class Meta:
        model = Rating
        fields = ('rating',)
        widgets = {
            'rating': forms.Select(
                choices=[(i, f'{i} étoile{"s" if i > 1 else ""}') for i in range(1, 6)],
                attrs={'class': 'form-control'}
            ),
        }
        labels = {
            'rating': 'Note',
        }


class CommentForm(forms.ModelForm):
    """Comment form"""
    
    class Meta:
        model = Comment
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control', 
                'rows': 3, 
                'placeholder': 'Votre commentaire...'
            }),
        }
        labels = {
            'content': 'Commentaire',
        }


class ProjectFilterForm(forms.Form):
    """Project filtering form"""
    search = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Rechercher des projets...'
        }),
        label='Recherche'
    )
    
    analysis_type = forms.ChoiceField(
        required=False,
        choices=[('', 'Tous les types')] + Project.ANALYSIS_TYPES,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Type d\'analyse'
    )
    
    status = forms.ChoiceField(
        required=False,
        choices=[('', 'Tous les statuts')] + Project.STATUS_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Statut'
    )
