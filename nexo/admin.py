from django.contrib import admin
from .models import cadastro, autenticacao, recuperacao_senha, relatorio

admin.site.register(cadastro)
admin.site.register(autenticacao)
admin.site.register(recuperacao_senha)
admin.site.register(relatorio)

# Register your models here.
