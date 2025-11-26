import random
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib import messages
from .forms import CadastroUsuarioForm
from .models import Usuario

class InicioView(TemplateView):
    template_name = 'nexo/inicio.html'

class CadastroView(CreateView):
    form_class = CadastroUsuarioForm 
    success_url = reverse_lazy('cadastro_sucesso') 
    template_name = 'nexo/cadastro_completo.html'

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
    
class RecuperacaoSolicitarView(View):
    template_name = 'nexo/recuperacao.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        email_ou_cpf = request.POST.get('email_ou_cpf')
        try:
            # Tenta achar por email ou CPF
            user = Usuario.objects.get(models.Q(email=email_ou_cpf) | models.Q(cpf=email_ou_cpf))
            
            # Gera código de 6 dígitos
            codigo = str(random.randint(100000, 999999))
            
            # Salva na sessão (simples e funcional para protótipo)
            request.session['recuperacao_codigo'] = codigo
            request.session['recuperacao_user_id'] = user.id
            
            # Envia e-mail (vai aparecer no seu terminal)
            send_mail(
                'Código de Recuperação - Nexo',
                f'Seu código de verificação é: {codigo}',
                'sistema@nexo.app',
                [user.email],
                fail_silently=False,
            )
            
            return redirect('recuperacao_validar')
            
        except Usuario.DoesNotExist:
            messages.error(request, "Usuário não encontrado.")
            return render(request, self.template_name)

class RecuperacaoValidarView(View):
    template_name = 'nexo/validacao.html'

    def get(self, request):
        if 'recuperacao_codigo' not in request.session:
            return redirect('recuperacao_solicitar')
        return render(request, self.template_name)

    def post(self, request):
        codigo_digitado = request.POST.get('codigo')
        codigo_real = request.session.get('recuperacao_codigo')
        
        if codigo_digitado == codigo_real:
            return redirect('recuperacao_senha')
        else:
            messages.error(request, "Código inválido.")
            return render(request, self.template_name)

class RecuperacaoNovaSenhaView(View):
    template_name = 'nexo/esqueci-senha.html' # Note que este é o nome do seu arquivo de "Nova Senha"

    def get(self, request):
        if 'recuperacao_user_id' not in request.session:
            return redirect('recuperacao_solicitar')
        return render(request, self.template_name)

    def post(self, request):
        senha1 = request.POST.get('senha1')
        senha2 = request.POST.get('senha2')
        user_id = request.session.get('recuperacao_user_id')
        
        if senha1 and senha1 == senha2:
            user = Usuario.objects.get(id=user_id)
            user.set_password(senha1)
            user.save()
            
            del request.session['recuperacao_codigo']
            del request.session['recuperacao_user_id']
            
            messages.success(request, "Senha alterada com sucesso!")
            return redirect('autenticacao') # Redireciona para Login
        else:
            messages.error(request, "As senhas não coincidem.")
            return render(request, self.template_name)