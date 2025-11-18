from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ['email', 'nome_completo', 'cpf', 'is_staff']
    
    #fields used in the user creation page
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'password', 'password2'),
        }),
    )

    #fiels used in the user edit page
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
        ('Permissões', {'fields': ( #permissions section
            'is_active', 
            'is_staff', 
            'is_superuser', 
            'groups', 
            'user_permissions'
        )}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}), # Seção de datas (padrão)
    )

    #fields using to filter users in admin
    search_fields = ('email', 'nome_completo', 'cpf')
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)