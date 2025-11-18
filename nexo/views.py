from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from .models import RegistroCalendario

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'nexo/dashboard.html'  

class RelatorioPDFView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.perfil
        registros = RegistroCalendario.objects.filter(paciente=user)
        total_dias_registrados = registros_calendario.count()

    contexto = {
            'usuario': user,
            'perfil': profile,
            'total_dias_registrados': total_dias_registrados,
            'registros': registros_calendario[:10] 
        }

    html_string = render_to_string('nexo/relatorio_template.html', contexto)
    pdf = HTML(string=html_string).write_pdf()

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="relatorio_{user.email}.pdf"'

    return response