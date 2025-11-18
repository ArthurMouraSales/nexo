from django.contrib import admin
from django.urls import path
from nexo.views import CadastroListView, AuthView


urlpatterns = [
    path('', AuthView.as_view()),
    path('cadastro', CadastroListView.as_view()),
    path('admin/', admin.site.urls),
]
