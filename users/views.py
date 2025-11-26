from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib import messages
from .forms import CadastroUsuarioForm 

class InicioView(TemplateView):
    template_name = 'nexo/inicio.html'

class CadastroView(CreateView):
    form_class = CadastroUsuarioForm 
    success_url = reverse_lazy('cadastro_sucesso') 
    template_name = 'nexo/cadastro_list.html'

class CadastroSucessoView(TemplateView):
    template_name = 'nexo/cadastro_sucesso.html'

class LoginView(LoginView):
    form_class = AuthenticationForm
    template_name = 'nexo/autenticacao.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('dashboard') 
    
    def form_invalid(self, form):
        messages.error(self.request, "Login inválido. Verifique suas credenciais.")
        return super().form_invalid(form)