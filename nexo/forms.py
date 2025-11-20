from django import forms
from .models import RegistroCalendario

class RegistroCalendarioForm(forms.ModelForm):
    data_selecionada = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        label="Selecione o dia"
    )
    
    class Meta:
        model = RegistroCalendario
        fields = [
            'data_selecionada', 
            'descricao_matutino', 
            'descricao_vespertino', 
            'descricao_noturno',
            'resumo_diario'
        ]
        labels = {
            'descricao_matutino': 'Atividades da Manhã',
            'descricao_vespertino': 'Atividades da Tarde',
            'descricao_noturno': 'Atividades da Noite',
            'resumo_diario': 'Resumo do Dia'
        }