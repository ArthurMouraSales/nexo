import os
from django.views.generic import View, TemplateView 
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.shortcuts import render, redirect
from datetime import date
from .models import RegistroCalendario
from .forms import FormularioCalendario

gtk3_folder = r"C:\Program Files\GTK3-Runtime Win64\bin"

if os.name == 'nt':
    if os.path.exists(gtk3_folder):
        try:
            os.add_dll_directory(gtk3_folder)
            os.environ['PATH'] = gtk3_folder + ';' + os.environ['PATH']
        except Exception as e:
            print(f"Aviso: Erro ao carregar GTK3: {e}")
    else:
        print("Aviso: Pasta do GTK3 não encontrada. O PDF pode falhar.")

try:
    from weasyprint import HTML
except OSError:
    print("Erro crítico: WeasyPrint não conseguiu carregar as bibliotecas GTK3.")



class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'nexo/dashboard.html'

class CalendarioView(LoginRequiredMixin, View):
    template_name = 'nexo/calendario.html'

    def get(self, request, *args, **kwargs):
        registros = RegistroCalendario.objects.filter(paciente=request.user).order_by('-data_selecionada')
        form = FormularioCalendario(initial={'data_selecionada': date.today()})
        context = {'form': form, 'meus_registros': registros}
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        form = FormularioCalendario(request.POST)
        if form.is_valid():
            data = form.cleaned_data['data_selecionada']
            registro, created = RegistroCalendario.objects.get_or_create(
                paciente=request.user,
                data_selecionada=data,
                defaults={'responsavel_pelo_registro': request.user, 'status_dia': 'Parcial'}
            )
            registro.descricao_matutino = form.cleaned_data['descricao_matutino']
            registro.descricao_vespertino = form.cleaned_data['descricao_vespertino']
            registro.descricao_noturno = form.cleaned_data['descricao_noturno']
            registro.resumo_diario = form.cleaned_data['resumo_diario']
            
            if not created:
                registro.responsavel_pelo_registro = request.user
            
            registro.save()
            return redirect('calendario')
            
        registros = RegistroCalendario.objects.filter(paciente=request.user).order_by('-data_selecionada')
        return render(request, self.template_name, {'form': form, 'meus_registros': registros})

class RelatorioPDFView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        
        try:
            perfil = user.perfil
        except AttributeError:
            perfil = None

        registros_calendario = RegistroCalendario.objects.filter(paciente=user)
        total_dias_registrados = registros_calendario.count()

        contexto = {
            'usuario': user,
            'perfil': perfil,
            'total_dias_registrados': total_dias_registrados,
            'registros': registros_calendario.order_by('-data_selecionada')[:10] 
        }

        html_string = render_to_string('nexo/relatorio_template.html', contexto)
        
        pdf_file = HTML(string=html_string, base_url=request.build_absolute_uri()).write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="relatorio_nexo_{user.cpf}.pdf"'
            
        return response