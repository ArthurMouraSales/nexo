from django.db import models
from users.models import CustomUser

class PacienteProfile(models.Model):

    #sync with CustomUser
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='paciente_profile')

    #endereço fields
    cep = models.CharField(max_length=10, null=False)
    logradouro = models.CharField(max_length=150, null=False)
    numero = models.CharField(max_length=10, null=False)
    complemento = models.CharField(max_length=150, blank=True)
    bairro = models.CharField(max_length=100, null=False)
    municipio = models.CharField(max_length=100, null=False)
    uf = models.CharField(max_length=2, null=False)  # Estado

    #medical fields
    grau_tea_choices = [('nivel 1', 'Nível 1'), ('nivel 2', 'Nível 2'), ('nivel 3', 'Nível 3')]
    grau_tea = models.CharField(max_length=20, choices=grau_tea_choices, null=False)
    comorbidades = models.TextField(blank=True)
    tipo_sanguineo_choices = [ ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B-'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),]
    tipo_sanguineo = models.CharField(max_length=3, choices=tipo_sanguineo_choices, null=False)
    alergias = models.TextField(blank=True)
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=False)  # in cm
    peso = models.DecimalField(max_digits=6, decimal_places=2, null=False)  # in kg
    medicacoes = models.TextField(blank=True)
    observacoes = models.TextField(blank=True)

    #chamar nome completo do usuário ao inves do user (admin functionality)
    def __str__(self):
        return self.user.nome_completo


class relatorio(models.Model):
    nome_completo = models.CharField(max_length=100, null=False)
    email = models.EmailField(unique=True, null=False)
    telefone = models.CharField(max_length=15, null=False)
    data_nascimento = models.DateField(null=False)
    senha = models.CharField(max_length=128, null=False)
    nome_social = models.CharField(max_length=100)
    genero = models.CharField(max_length=50)
    cpf = models.CharField(max_length=14, unique=True, null=False)
    nome_responsavel = models.CharField(max_length=100)

    status_choices = [('ativo', 'Ativo'), ('desativado', 'Desativado'), ('suspenso', 'Suspenso'), ('cancelado', 'Cancelado')]
    status = models.CharField(max_length=20, choices=status_choices, default='ativo')
    observacoes = models.TextField(blank=True)
    
    grau_tea = [('nivel 1', 'Nível 1'), ('nivel 2', 'Nível 2'), ('nivel 3', 'Nível 3')]
    grau_tea = models.CharField(max_length=20, choices=grau_tea, null=False)
    comorbidades = models.TextField(blank=True)
    tipo_sanguineo = [('A+', 'A+'), ('A-', 'A-'), ('B+', 'B-'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')]
    tipo_sanguineo = models.CharField(max_length=3, choices=tipo_sanguineo, null=False)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=False)
    altura = models.DecimalField(max_digits=4, decimal_places=2, null=False)
    alergias = models.TextField(blank=True)

    total_tarefas_criadas = models.IntegerField("Total de tarefas criadas", default=0)
    total_tarefas_concluidas = models.IntegerField("Total de tarefas concluídas", default=0)
    total_tarefas_pendentes = models.IntegerField("Total de tarefas pendentes", default=0)
    total_tarefas_em_atraso = models.IntegerField("Total de tarefas em atraso", default=0)
    dias_maior_produtividade = models.TextField("Dias de maior produtividade", blank=True, null=True)
    total_situacoes_apresentadas = models.IntegerField("Total de situações apresentadas", default=0)
    total_acertos = models.IntegerField("Total de acertos", default=0)
    total_erros = models.IntegerField("Total de erros", default=0)
    acerto_por_categoria = models.TextField("Acerto por categoria", blank=True, null=True)
    evolucao_temporal = models.TextField("Evolução temporal", blank=True, null=True)
    conquistas_obtidas = models.TextField("Conquistas Obtidas", blank=True, null=True)
    pontuacao_acumulada = models.FloatField("Pontuação Acumulada", default=0.0)
    estatisticas_engajamento = models.TextField("Estatísticas de Engajamento (Frequência de Uso)", blank=True, null=True)