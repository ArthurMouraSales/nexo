
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioRecuperacao');
    

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

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailRecuperacao').value.trim();
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarMensagem('Por favor, insira um email válido.', 'erro');
            return;
        }

        mostrarMensagem(`Email de recuperação enviado para ${email}! Verifique sua caixa de entrada.`, 'sucesso');
        

        setTimeout(() => {
            window.location.href = 'autenticacao_list.html';
        }, 3000);
    });

    function mostrarMensagem(texto, tipo) {
        document.querySelectorAll('.mensagem').forEach(msg => msg.remove());
        
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = texto;
        
        formulario.insertBefore(mensagemDiv, formulario.firstChild);
        
        mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});