from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Project, Notebook, Collaboration, Rating, Comment


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'first_name', 'last_name', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('role', 'bio', 'avatar')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {'fields': ('role', 'bio')}),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'analysis_type', 'status', 'created_at', 'total_notebooks')
    list_filter = ('analysis_type', 'status', 'created_at')
    search_fields = ('title', 'description', 'creator__username')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('collaborators',)


@admin.register(Notebook)
class NotebookAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'author', 'created_at', 'file_size')
    list_filter = ('created_at', 'project__analysis_type')
    search_fields = ('title', 'description', 'project__title', 'author__username')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Collaboration)
class CollaborationAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'status', 'requested_at', 'responded_at')
    list_filter = ('status', 'requested_at')
    search_fields = ('user__username', 'project__title')
    readonly_fields = ('requested_at',)


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'project__title')
    readonly_fields = ('created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'project', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('author__username', 'project__title', 'content')
    readonly_fields = ('created_at', 'updated_at')
