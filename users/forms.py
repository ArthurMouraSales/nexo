from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    #forms to create new users
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel')

class CustomUserChangeForm(UserChangeForm):
    #forms to change user info on /admin
    class Meta:
        model = CustomUser
        fields = ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel')