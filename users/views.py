from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib import messages
from .forms import CustomUserCreationForm 

class InicioView(TemplateView):
    template_name = 'nexo/inicio.html'

class SignUpView(CreateView):
    #view to register new users
    form_class = CustomUserCreationForm
    #redirect to login page
    success_url = reverse_lazy('login') 
    #use custom template
    template_name = 'nexo/cadastro_list.html'

class CustomLoginView(LoginView):
    #custom login view
    form_class = AuthenticationForm
    template_name = 'nexo/autenticacao_list.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        #redirect to dashboard after login
        return reverse_lazy('dashboard') 
    
    def form_invalid(self, form):
        messages.error(self.request, "Login inválido. Por favor, tente novamente.")
        return super().form_invalid(form)