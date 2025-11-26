from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from .forms import CadastroUsuarioForm, EdicaoUsuarioAdminForm

class UsuarioAdmin(UserAdmin):
    add_form = CadastroUsuarioForm
    form = EdicaoUsuarioAdminForm
    model = Usuario

    list_display = ['email', 'nome_completo', 'cpf', 'is_staff']
    ordering = ('email',)
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'password', 'password2'),
        }),
    )

    fieldsets = (
        (None, {'fields': ('password',)}), 
        ('Informações Pessoais', {'fields': ( 
            'email', 'nome_completo', 'nome_social', 'cpf', 
            'data_nascimento', 'contato'
        )}),
        ('Permissões', {'fields': (
            'is_active', 'is_staff', 'is_superuser', 
            'groups', 'user_permissions'
        )}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    search_fields = ('email', 'nome_completo', 'cpf')

admin.site.register(Usuario, UsuarioAdmin)