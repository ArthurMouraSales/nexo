document.addEventListener('DOMContentLoaded', function() {
    const senhaInput = document.getElementById('senha');
    const barraForca = document.querySelector('.barra-forca');
    const textoForca = document.querySelector('.texto-forca');
    const cpfInput = document.getElementById('cpf');


    document.querySelectorAll('.botao-mostrar').forEach(botao => {
        botao.addEventListener('click', function() {
            const inputSenha = this.previousElementSibling;
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                this.textContent = '👁️';
            } else {
                inputSenha.type = 'password';
                this.textContent = '👁️';
            }
        });
    });


    if (cpfInput){ 
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            }
            
            e.target.value = value;
        });
    }

    if (senhaInput){
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
    }

    const contatoInput = document.getElementById('contato');
    if (contatoInput) {
        contatoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); 
            
            if (value.length > 11) value = value.substring(0, 11);
            
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            
            e.target.value = value;
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            value = value.replace(/^(\d{5})(\d)/, '$1-$2'); 
            e.target.value = value;
        });
    }

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