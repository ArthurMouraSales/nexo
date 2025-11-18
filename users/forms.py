from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django import forms
from nexo.models import PacienteProfile 
from django.db import transaction

class CustomUserCreationForm(UserCreationForm):
    cep = forms.CharField(max_length=9, required=False)
    logradouro = forms.CharField(max_length=255, required=False)
    numero = forms.CharField(max_length=10, required=False)
    complemento = forms.CharField(max_length=255, required=False)
    bairro = forms.CharField(max_length=255, required=False)
    municipio = forms.CharField(max_length=255, required=False)
    uf = forms.CharField(max_length=2, required=False)

    contato = forms.CharField(max_length=15)
    nome_social = forms.CharField(max_length=100, required=False)
    genero = forms.CharField(max_length=50, required=False)
    nome_responsavel = forms.CharField(max_length=100, required=False)

    grau_tea_choices = [('nivel 1', 'Nível 1'), ('nivel 2', 'Nível 2'), ('nivel 3', 'Nível 3'), ("indefinido", 'Indefinido')]
    grau_tea = forms.ChoiceField(choices=grau_tea_choices)

    tipo_sanguineo_choices = [('A+', 'A+'), ('A-', 'A-'), ('B+', 'B-'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')]
    tipo_sanguineo = forms.ChoiceField(choices=tipo_sanguineo_choices)
    
    peso = forms.DecimalField(max_digits=5, decimal_places=2)
    altura = forms.DecimalField(max_digits=4, decimal_places=2)
    comorbidades = forms.CharField(widget=forms.Textarea, required=False)
    alergias = forms.CharField(widget=forms.Textarea, required=False)
    observacoes = forms.CharField(widget=forms.Textarea, required=False)

    #forms to create new users
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email', 'nome_completo', 'cpf', 'data_nascimento', 'contato', 'nome_social', 'genero', 'nome_responsavel')

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=False)
        user.contato = self.cleaned_data.get('contato')
        user.nome_social = self.cleaned_data.get('nome_social')
        user.genero = self.cleaned_data.get('genero')
        user.nome_responsavel = self.cleaned_data.get('nome_responsavel')

        if commit:
            user.save()
        
        profile = PacienteProfile(
            user=user,
            cep=self.cleaned_data.get('cep'),
            logradouro=self.cleaned_data.get('logradouro'),
            numero=self.cleaned_data.get('numero'),
            complemento=self.cleaned_data.get('complemento'),
            bairro=self.cleaned_data.get('bairro'),
            municipio=self.cleaned_data.get('municipio'),
            uf=self.cleaned_data.get('uf'),
            grau_tea=self.cleaned_data.get('grau_tea'),
            tipo_sanguineo=self.cleaned_data.get('tipo_sanguineo'),
            peso=self.cleaned_data.get('peso'),
            altura=self.cleaned_data.get('altura'),
            comorbidades=self.cleaned_data.get('comorbidades'),
            alergias=self.cleaned_data.get('alergias'),
            observacoes=self.cleaned_data.get('observacoes'),
            )
        if commit:
            profile.save()

        return user