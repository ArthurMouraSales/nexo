document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!validateEmail(email)) {
        showToast("E-mail inválido. Verifique e tente novamente.", "error");
        return;
    }

    if (senha.length < 6) {
        showToast("A senha deve ter pelo menos 6 caracteres.", "error");
        return;
    }

    showToast("Login realizado com sucesso!", "success");
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}

function validateEmail(email) {
    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return pattern.test(email);
}

function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("visible"), 100);
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const style = document.createElement("style");
style.innerHTML = `
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: #222;
  color: white;
  padding: 0.9rem 1.3rem;
  border-radius: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
}
.toast.success { background: #00bcd4; color: #000; }
.toast.error { background: #ff5252; }
.toast.visible {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
`;
document.head.appendChild(style);