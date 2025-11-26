document.addEventListener('DOMContentLoaded', function() {
    // Função para navegar entre os passos
    window.nextStep = function(step) {
        // Esconde todos os passos
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        // Mostra o passo atual
        const currentStep = document.getElementById('step' + step);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    // Lógica do ViaCEP
    const cepInput = document.getElementById('id_cep');
    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            var cep = this.value.replace(/\D/g, '');
            if (cep != "") {
                var validacep = /^[0-9]{8}$/;
                if(validacep.test(cep)) {
                    // Feedback visual de carregamento (opcional)
                    document.getElementById('id_logradouro').value = "...";
                    
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!("erro" in data)) {
                                document.getElementById('id_logradouro').value = data.logradouro;
                                document.getElementById('id_bairro').value = data.bairro;
                                document.getElementById('id_municipio').value = data.localidade;
                                document.getElementById('id_uf').value = data.uf;
                                // Focar no número após preencher
                                document.getElementById('id_numero').focus();
                            } else {
                                alert("CEP não encontrado.");
                                document.getElementById('id_logradouro').value = "";
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar CEP:', error);
                            alert("Erro ao buscar CEP.");
                        });
                } else {
                    alert("Formato de CEP inválido.");
                }
            }
        });
    }
});