from django.db import models
from django.conf import settings
from simple_history.models import HistoricalRecords
from users.models import Usuario  

class PerfilPaciente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil')

    cep = models.CharField(max_length=10, null=False)
    logradouro = models.CharField(max_length=150, null=False)
    numero = models.CharField(max_length=10, null=False)
    complemento = models.CharField(max_length=150, blank=True)
    bairro = models.CharField(max_length=100, null=False)
    municipio = models.CharField(max_length=100, null=False)
    uf = models.CharField(max_length=2, null=False) 

    grau_tea_choices = [('nivel 1', 'Nível 1'), ('nivel 2', 'Nível 2'), ('nivel 3', 'Nível 3')]
    grau_tea = models.CharField(max_length=20, choices=grau_tea_choices, null=False)
    comorbidades = models.TextField(blank=True)
    tipo_sanguineo_choices = [('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')]
    tipo_sanguineo = models.CharField(max_length=3, choices=tipo_sanguineo_choices, null=False)
    alergias = models.TextField(blank=True)
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=False)  # em metros
    peso = models.DecimalField(max_digits=6, decimal_places=2, null=False)  # em kg
    medicacoes = models.TextField(blank=True)
    observacoes = models.TextField(blank=True)

    def __str__(self):
        return self.usuario.nome_completo


class RegistroCalendario(models.Model):
    paciente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registros_calendario')
    data_selecionada = models.DateField()
    
    resumo_diario = models.TextField(blank=True, null=True)
    descricao_matutino = models.TextField(blank=True, null=True)
    descricao_vespertino = models.TextField(blank=True, null=True)
    descricao_noturno = models.TextField(blank=True, null=True)
    
    status_dia = models.CharField(max_length=20, default='Não preenchido', editable=False)
    
    responsavel_registro = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='registros_criados')
    ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()

    class Meta:
        unique_together = ('paciente', 'data_selecionada')

    def save(self, *args, **kwargs):
        campos_preenchidos = 0
        if self.descricao_matutino:
            campos_preenchidos += 1
        if self.descricao_vespertino:
            campos_preenchidos += 1
        if self.descricao_noturno:
            campos_preenchidos += 1

        if campos_preenchidos == 3:
            self.status_dia = 'Preenchido'
        elif campos_preenchidos > 0:
            self.status_dia = 'Parcial'
        else:
            self.status_dia = 'Não preenchido'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.paciente} - {self.data_selecionada} ({self.status_dia})"