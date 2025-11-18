from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse
from django.urls import reverse_lazy
from django.contrib import messages


class CustomLoginView(LoginView):
    template_name = 'autenticacao_list.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('dashboard')
    
    def form_invalid(self, form=AuthenticationForm):
        messages.error(self.request, "Login inválido. Por favor, tente novamente.")
        return super().form_invalid(form)