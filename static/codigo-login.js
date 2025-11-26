
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

    const loginBtn = document.getElementById('login-btn');
        const togglePasswordBtn = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('login-password');

        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordBtn.textContent = 'Ocultar';
            } else {
                passwordInput.type = 'password';
                togglePasswordBtn.textContent = 'Mostrar';
            }
        });

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const emailError = document.getElementById('login-email-error');
            const passwordError = document.getElementById('login-password-error');
            const emailInput = document.getElementById('login-email');
            const passwordField = document.getElementById('login-password');
            
            let isValid = true;
            
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            emailInput.classList.remove('error-border');
            passwordField.classList.remove('error-border');
            
            if (!email) {
                emailError.textContent = 'Por favor, insira um email ou CPF';
                emailError.style.display = 'block';
                emailInput.classList.add('error-border');
                isValid = false;
            }
            
            if (!password) {
                passwordError.textContent = 'Por favor, insira sua senha';
                passwordError.style.display = 'block';
                passwordField.classList.add('error-border');
                isValid = false;
            } else if (password.length < 6) {
                passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres';
                passwordError.style.display = 'block';
                passwordField.classList.add('error-border');
                isValid = false;
            }
            
            if (isValid) {
                loginBtn.classList.add('loading');
                
                setTimeout(() => {
                    loginBtn.classList.remove('loading');
                    
                    window.location.href = 'inicio.html';
                    
                }, 1500);
            }
        });

        document.getElementById('login-email').addEventListener('input', function() {
            const errorElement = document.getElementById('login-email-error');
            if (this.value.trim()) {
                errorElement.style.display = 'none';
                this.classList.remove('error-border');
            }
        });

        document.getElementById('login-password').addEventListener('input', function() {
            const errorElement = document.getElementById('login-password-error');
            if (this.value && this.value.length >= 6) {
                errorElement.style.display = 'none';
                this.classList.remove('error-border');
            }
        });
});
