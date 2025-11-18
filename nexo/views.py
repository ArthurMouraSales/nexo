from django.shortcuts import render
from django.views.generic import ListView
from .models import cadastro, autenticacao

class CadastroListView(ListView):
    queryset = cadastro.objects.all()
    context_object_name = 'cadastros'

class AuthView(ListView):
    queryset = autenticacao.objects.all()
    context_object_name = 'autenticacoes'