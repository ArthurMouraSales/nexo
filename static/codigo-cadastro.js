document.addEventListener('DOMContentLoaded', function() {
    let passoAtual = 1;

    // MÁSCARAS
    const cpfInput = document.getElementById('cpf');
    const telInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    if(cpfInput) cpfInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if(v.length > 11) v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        e.target.value = v;
    });

    if(telInput) telInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if(v.length > 11) v = v.substring(0, 11);
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = v;
    });

    if(cepInput) cepInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if(v.length > 8) v = v.substring(0, 8);
        v = v.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = v;
    });

    // NAVEGAÇÃO
    window.proximoPasso = function(idAtual) {
        if(!validarPasso(idAtual)) return;
        document.getElementById(`step-${idAtual}`).classList.remove('active');
        passoAtual = idAtual + 1;
        document.getElementById(`step-${passoAtual}`).classList.add('active');
        atualizarTitulo();
    };

    window.voltarPasso = function(e) {
        e.preventDefault();
        if(passoAtual === 1) window.location.href = "/";
        else {
            document.getElementById(`step-${passoAtual}`).classList.remove('active');
            passoAtual--;
            document.getElementById(`step-${passoAtual}`).classList.add('active');
            atualizarTitulo();
        }
    };

    window.prepararEnvio = function() {
        // Copia a senha para o campo de confirmação oculto
        const s = document.getElementById('senha').value;
        document.getElementById('hidden_password2').value = s;
    };

    function validarPasso(id) {
        const div = document.getElementById(`step-${id}`);
        const inputs = div.querySelectorAll('input[required], select[required]');
        let valido = true;
        inputs.forEach(inpt => {
            if(!inpt.value.trim()) {
                inpt.parentElement.style.border = '2px solid red';
                setTimeout(() => inpt.parentElement.style.border = 'none', 2000);
                valido = false;
            }
        });
        return valido;
    }

    function atualizarTitulo() {
        document.getElementById('titulo-passo').innerText = `Cadastro 0${passoAtual}`;
    }
});