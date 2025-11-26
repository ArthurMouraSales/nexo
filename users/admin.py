from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import FormCadastro, FormEdicaoAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    add_form = FormCadastro
    form = FormEdicaoAdmin
    model = Usuario

    list_display = ['email', 'nome_completo', 'cpf', 'is_staff']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'password', 'password2'),
        }),
    )

    fieldsets = (

        (None, {'fields': ('password',)}), 
        ('Informações Pessoais', {'fields': ( 
            'email', 
            'nome_completo', 
            'nome_social',
            'cpf', 
            'data_nascimento', 
            'contato'
        )}),
        ('Permissões', {'fields': (
            'is_active', 
            'is_staff', 
            'is_superuser', 
            'groups', 
            'user_permissions'
        )}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    search_fields = ('email', 'nome_completo', 'cpf')
    ordering = ('email',)


admin.site.register(Usuario, UsuarioAdmin)