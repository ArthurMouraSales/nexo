from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.views.generic import TemplateView, RedirectView
from users.views import LoginView, CadastroView, InicioView, CadastroSucessoView
from nexo.views import DashboardView, CalendarioView, RelatorioPDFView
from django.contrib.auth.views import LogoutView 

urlpatterns = [
    path('', LoginView.as_view(), name='login'), 
    path('cadastro/', CadastroView.as_view(), name='cadastro'), 
    path('cadastro_sucesso/', CadastroSucessoView.as_view(), name='cadastro_sucesso'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('esqueci_senha/', TemplateView.as_view(template_name='nexo/esqueci_senha.html'), name='esqueci_senha'),

    path('inicio', InicioView.as_view(), name='inicio'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('calendario/', CalendarioView.as_view(), name='calendario'),
    path('relatorio/download/', RelatorioPDFView.as_view(), name='relatorio_pdf'),
    
    path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'favicon.ico')),
    path('admin/', admin.site.urls),

]

