
document.addEventListener('DOMContentLoaded', function() {
    const formularioLogin = document.getElementById('formularioLogin');


    document.querySelectorAll('.botao-mostrar').forEach(botao => {
        botao.addEventListener('click', function() {
            const inputSenha = this.previousElementSibling;
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                this.textContent = '🙈';
            } else {
                inputSenha.type = 'password';
                this.textContent = '👁️';
            }
        });
    });

});