from django.contrib import admin
from django.urls import path
from users.views import CustomLoginView, SignUpView 
from nexo.views import DashboardView 
from django.contrib.auth.views import LogoutView 

urlpatterns = [
    #initial page is login
    path('', CustomLoginView.as_view(), name='login'), 
    #page to register new users
    path('cadastro/', SignUpView.as_view(), name='cadastro'), 
    #Logout route
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    #Dashboard route
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    #Admin
    path('admin/', admin.site.urls),
]