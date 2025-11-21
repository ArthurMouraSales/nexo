document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.botao-mostrar').forEach(botao => {
        botao.addEventListener('click', function() {
            const inputSenha = this.previousElementSibling;
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                this.textContent = '🙈'; // Ou o ícone de olho fechado
            } else {
                inputSenha.type = 'password';
                this.textContent = '👁️'; // Ou o ícone de olho aberto
            }
        });
    });
});