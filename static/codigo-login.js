
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

    formularioLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;
        
    
        if (!email || !senha) {
            mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
            return;
        }
        
    
        mostrarMensagem('Login realizado com sucesso!', 'sucesso');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });

    function mostrarMensagem(texto, tipo) {

        document.querySelectorAll('.mensagem').forEach(msg => msg.remove());
        
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = texto;
        
        formularioLogin.insertBefore(mensagemDiv, formularioLogin.firstChild);
        

        mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});