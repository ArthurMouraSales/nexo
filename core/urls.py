from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from users.views import CustomLoginView, SignUpView, InicioView
from nexo.views import DashboardView, CalendarioView, RelatorioPDFView
from django.contrib.auth.views import LogoutView 

urlpatterns = [
    #authentication routes
    path('', CustomLoginView.as_view(), name='login'), 
    path('cadastro/', SignUpView.as_view(), name='cadastro'), 
    path('inicio', InicioView.as_view(), name='inicio'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),

    #functional routes
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('calendario/', CalendarioView.as_view(), name='calendario'),
    path('relatorio/download/', RelatorioPDFView.as_view(), name='relatorio_pdf'),

    #Forgot Password route
    path('esqueci_senha/', TemplateView.as_view(template_name='nexo/esqueci_senha.html'), name='esqueci_senha'),
    
    #Admin
    path('admin/', admin.site.urls),
]

