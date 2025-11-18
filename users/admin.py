from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ['email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'status', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel')}),
        ('Permissões', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
        ('Status do Usuário', {'fields': ('status',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets +(
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    
admin.site.register(CustomUser, CustomUserAdmin)

