document.addEventListener('DOMContentLoaded', function() {
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    const form = document.getElementById('formularioLogin');
    const loginBtn = document.getElementById('login-btn');

    // Funcionalidade de Mostrar/Ocultar Senha
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordBtn.textContent = 'Ocultar';
            } else {
                passwordInput.type = 'password';
                togglePasswordBtn.textContent = 'Mostrar';
            }
        });
    }

    // Animação de carregamento ao enviar o formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            // NÃO usamos e.preventDefault() aqui, pois queremos que o Django processe o login
            
            const email = document.getElementById('login-email').value.trim();
            const password = passwordInput.value;
            
            if (email && password) {
                // Adiciona classe de loading apenas visualmente
                if(loginBtn) {
                    loginBtn.classList.add('loading');
                    loginBtn.textContent = 'Entrando...';
                }
            }
        });
    }
});