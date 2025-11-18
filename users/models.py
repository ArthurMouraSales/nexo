from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    nome_completo = models.CharField(max_length=150, null=False)
    cpf = models.CharField(max_length=11, unique=True, null=False)
    data_nascimento = models.DateField(null=False)
    contato = models.CharField(max_length=15, null=False)

    nome_social = models.CharField(max_length=150, blank=True)
    genero = models.CharField(max_length=50, blank=True, null=False)
    nome_responsavel = models.CharField(max_length=150, blank=True, null=False)

    status_choices = [ ('ativo', 'Ativo'), ('desativado', 'Desativado'), ('suspenso', 'Suspenso'), ('cancelado', 'Cancelado'),]
    status = models.CharField(max_length=20, choices=status_choices, default='ativo')

    #email is the login field
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel']
