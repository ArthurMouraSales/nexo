from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nome_completo, cpf, data_nascimento, contato, password=None, **extra_fields):
        if not email:
            raise ValueError('O email deve ser fornecido')
        email = self.normalize_email(email)
        user = self.model(email=email, nome_completo=nome_completo, cpf=cpf, data_nascimento=data_nascimento, contato=contato, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nome_completo, cpf, data_nascimento, contato, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, nome_completo, cpf, data_nascimento, contato, password, **extra_fields)

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

    objects = CustomUserManager()

    #email is the login field
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel']

    def __str__(self):
        return self.email
