let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = 3; 
let autoSlideInterval;

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); 
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', function() {
    updateCarousel();
    startAutoSlide();
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
});

function openModal(modalType) {
    document.getElementById(`modal-${modalType}`).style.display = 'flex';
}

function closeModal(modalType) {
    document.getElementById(`modal-${modalType}`).style.display = 'none';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function generateReport() {
    const btn = event.target.closest('.btn');
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Gerando...';
    
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-download"></i> Gerar Relatório';
        showSuccess('Relatório gerado com sucesso! Em breve estará disponível para download.');
        closeModal('relatorios');
    }, 2000);
}

function viewSchedule() {
    const btn = event.target.closest('.btn');
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Carregando...';
    
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-eye"></i> Ver Agenda';
        showSuccess('Agenda carregada com sucesso!');
        closeModal('calendario');
    }, 1500);
}

function contactSupport() {
    const btn = event.target.closest('.btn');
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Conectando...';
    
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-headset"></i> Falar com Suporte';
        showSuccess('Conectando você com nosso time de suporte...');
        closeModal('suporte');
    }, 1000);
}

function showSuccess(message) {

    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successMsg.style.display = 'block';
    
    document.body.appendChild(successMsg);
    
    successMsg.style.position = 'fixed';
    successMsg.style.top = '20px';
    successMsg.style.left = '50%';
    successMsg.style.transform = 'translateX(-50%)';
    successMsg.style.zIndex = '1001';
    successMsg.style.maxWidth = '90%';
    successMsg.style.width = 'auto';
    
    setTimeout(() => {
        if (successMsg.parentNode) {
            successMsg.parentNode.removeChild(successMsg);
        }
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    const elements = document.querySelectorAll('.carousel-section, .user-section, .quick-access, .motto');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

carouselContainer.addEventListener('mouseleave', () => {
    startAutoSlide();
});