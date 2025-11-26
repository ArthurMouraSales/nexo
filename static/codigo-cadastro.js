
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioCadastro');
    const senhaInput = document.getElementById('senha');
    const barraForca = document.querySelector('.barra-forca');
    const textoForca = document.querySelector('.texto-forca');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');


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


    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }

    senhaInput.addEventListener('input', function() {
        const senha = senhaInput.value;
        let forca = 0;
        let texto = 'Muito fraca';
        let cor = '#e74c3c';

        if (senha.length >= 8) forca += 25;
        if (/[A-Z]/.test(senha)) forca += 25;
        if (/[0-9]/.test(senha)) forca += 25;
        if (/[^A-Za-z0-9]/.test(senha)) forca += 25;

        if (forca >= 75) {
            texto = 'Forte';
            cor = '#27ae60';
        } else if (forca >= 50) {
            texto = 'Média';
            cor = '#f39c12';
        } else if (forca >= 25) {
            texto = 'Fraca';
            cor = '#e67e22';
        }

        barraForca.style.setProperty('--forca-width', forca + '%');
        barraForca.style.setProperty('--forca-cor', cor);
        textoForca.textContent = texto;
        textoForca.style.color = cor;
    });


    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto >= 10 ? 0 : resto;
        
        if (digito1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto >= 10 ? 0 : resto;
        
        return digito2 === parseInt(cpf.charAt(10));
    }


    function validarFormulario() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar_senha').value;
        const termos = document.getElementById('termos').checked;

        let valido = true;
        let mensagem = '';


        document.querySelectorAll('.mensagem').forEach(msg => msg.remove());
        document.querySelectorAll('.campo-invalido').forEach(campo => {
            campo.classList.remove('campo-invalido');
        });


        if (!nome) {
            marcarInvalido('nome');
            mensagem = 'Por favor, preencha seu nome completo.';
            valido = false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            marcarInvalido('email');
            mensagem = 'Por favor, insira um email válido.';
            valido = false;
        }

        if (!cpf || !validarCPF(cpf)) {
            marcarInvalido('cpf');
            mensagem = 'Por favor, insira um CPF válido.';
            valido = false;
        }

        if (senha.length < 8) {
            marcarInvalido('senha');
            mensagem = 'A senha deve ter pelo menos 8 caracteres.';
            valido = false;
        }

        if (senha !== confirmarSenha) {
            marcarInvalido('confirmar_senha');
            mensagem = 'As senhas não coincidem.';
            valido = false;
        }

        if (!termos) {
            mensagem = 'Você deve aceitar os Termos de Uso e Política de Privacidade.';
            valido = false;
        }

        if (!valido && mensagem) {
            mostrarMensagem(mensagem, 'erro');
        }

        return valido;
    }

    function marcarInvalido(id) {
        const campo = document.getElementById(id);
        campo.classList.add('campo-invalido');
    }

    function mostrarMensagem(texto, tipo) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = texto;
        
        formulario.insertBefore(mensagemDiv, formulario.firstChild);
        
        mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            mostrarMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    document.querySelectorAll('input, select').forEach(campo => {
        campo.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('campo-invalido');
                this.classList.add('campo-valido');
            }
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('campo-invalido')) {
                this.classList.remove('campo-invalido');
            }
        });
    });
});