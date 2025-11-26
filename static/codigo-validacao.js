document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formValidacao');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const btn = form.querySelector('button[type="submit"]');
            const input = form.querySelector('input[name="codigo"]');
            
            // Se o campo de código estiver preenchido
            if (input && input.value.trim() !== "") {
                if (btn) {
                    btn.classList.add('loading'); // Adiciona o spinner CSS
                    btn.textContent = 'Validando...';
                    // Deixamos o evento seguir (sem preventDefault) para o Django processar
                }
            }
        });
    }
});