document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formRecuperacao');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const btn = form.querySelector('button[type="submit"]');
            const input = form.querySelector('input[name="email_ou_cpf"]');
            
            // Se o campo estiver preenchido, muda o botão para loading
            if (input && input.value.trim() !== "") {
                if (btn) {
                    btn.classList.add('loading');
                    btn.textContent = 'Enviando...';
                    // Não usamos e.preventDefault(), deixamos o form ser enviado
                }
            }
        });
    }
});