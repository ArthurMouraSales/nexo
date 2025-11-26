let dataAtual = new Date();
let dataSelecionada = new Date();
let eventos = JSON.parse(localStorage.getItem('nexo_eventos')) || {};

document.addEventListener('DOMContentLoaded', function() {
    inicializarCalendario();
    configurarEventos();
    atualizarResumoDiario();
});

function inicializarCalendario() {
    atualizarCalendario();
    
    const hoje = new Date();
    if (hoje.getMonth() === dataAtual.getMonth() && hoje.getFullYear() === dataAtual.getFullYear()) {
        selecionarDia(hoje.getDate());
    }
}

function configurarEventos() {
    document.getElementById('prev-month').addEventListener('click', mesAnterior);
    document.getElementById('next-month').addEventListener('click', proximoMes);
    
    document.getElementById('event-form').addEventListener('submit', salvarEvento);
    
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('event-modal');
        if (event.target === modal) {
            fecharModalEvento();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fecharModalEvento();
        }
    });
}

function atualizarCalendario() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    currentMonthElement.textContent = `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;
    
    calendarGrid.innerHTML = '';
    
    const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
    
    const diaDaSemana = primeiroDia.getDay();
    
    for (let i = 0; i < diaDaSemana; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    const hoje = new Date();
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = dia;
        
        if (dia === hoje.getDate() && 
            dataAtual.getMonth() === hoje.getMonth() && 
            dataAtual.getFullYear() === hoje.getFullYear()) {
            dayElement.classList.add('current-day');
        }
        
        const dataKey = formatarData(new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dia));
        if (eventos[dataKey] && Object.keys(eventos[dataKey]).length > 0) {
            dayElement.classList.add('has-event');
        }
        
        if (dia === dataSelecionada.getDate() && 
            dataAtual.getMonth() === dataSelecionada.getMonth() && 
            dataAtual.getFullYear() === dataSelecionada.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', () => selecionarDia(dia));
        calendarGrid.appendChild(dayElement);
    }
}

function selecionarDia(dia) {
    dataSelecionada = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dia);
    atualizarCalendario();
    atualizarResumoDiario();
}

function mesAnterior() {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    atualizarCalendario();
}

function proximoMes() {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    atualizarCalendario();
}

function atualizarResumoDiario() {
    const selectedDateElement = document.getElementById('selected-date');
    const dataKey = formatarData(dataSelecionada);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateElement.textContent = dataSelecionada.toLocaleDateString('pt-BR', options);
    
    const horarios = ['9:00 AM', '14:00 PM', '18:00 PM'];
    
    horarios.forEach(horario => {
        const eventsList = document.getElementById(`events-${horario.replace(':', '').toLowerCase()}`);
        eventsList.innerHTML = '';
        
        if (eventos[dataKey] && eventos[dataKey][horario]) {
            eventos[dataKey][horario].forEach((evento, index) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                eventElement.innerHTML = `
                    <div class="event-icon">📝</div>
                    <div class="event-content">
                        <div class="event-title">${evento.titulo}</div>
                        ${evento.descricao ? `<div class="event-description">${evento.descricao}</div>` : ''}
                    </div>
                    <div class="event-actions">
                        <button class="btn-icon" onclick="removerEvento('${dataKey}', '${horario}', ${index})">🗑️</button>
                    </div>
                `;
                eventsList.appendChild(eventElement);
            });
        }
    });
}

function adicionarEvento(horario) {
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('event-modal-title');
    const modalSubtitle = document.getElementById('event-modal-subtitle');
    const eventTime = document.getElementById('event-time');
    
    modalTitle.textContent = 'Adicionar Evento';
    modalSubtitle.textContent = `Data: ${dataSelecionada.toLocaleDateString('pt-BR')}`;
    eventTime.value = horario;
    
    document.getElementById('event-title').value = '';
    document.getElementById('event-description').value = '';
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fecharModalEvento() {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function salvarEvento(event) {
    event.preventDefault();
    
    const dataKey = formatarData(dataSelecionada);
    const horario = document.getElementById('event-time').value;
    const titulo = document.getElementById('event-title').value;
    const descricao = document.getElementById('event-description').value;
    
    if (!eventos[dataKey]) {
        eventos[dataKey] = {};
    }
    if (!eventos[dataKey][horario]) {
        eventos[dataKey][horario] = [];
    }
    
    eventos[dataKey][horario].push({
        titulo: titulo,
        descricao: descricao,
        dataCriacao: new Date().toISOString()
    });
    
    localStorage.setItem('nexo_eventos', JSON.stringify(eventos));
    
    fecharModalEvento();
    atualizarCalendario();
    atualizarResumoDiario();
    
    alert('Evento adicionado com sucesso!');
}

function removerEvento(dataKey, horario, index) {
    if (confirm('Tem certeza que deseja remover este evento?')) {
        eventos[dataKey][horario].splice(index, 1);
        
        if (eventos[dataKey][horario].length === 0) {
            delete eventos[dataKey][horario];
        }
        if (Object.keys(eventos[dataKey]).length === 0) {
            delete eventos[dataKey];
        }
        
        localStorage.setItem('nexo_eventos', JSON.stringify(eventos));
        
        atualizarCalendario();
        atualizarResumoDiario();
    }
}

function formatarData(data) {
    return data.toISOString().split('T')[0];
}

function voltarParaDashboard() {

    alert('Redirecionando para o Dashboard...');

}

function inicializarDadosExemplo() {
    const hoje = formatarData(new Date());
    if (!eventos[hoje]) {
        eventos[hoje] = {
            '9:00 AM': [
                {
                    titulo: 'Sessão de Terapia',
                    descricao: 'Sessão com Dr. Silva',
                    dataCriacao: new Date().toISOString()
                }
            ]
        };
        localStorage.setItem('nexo_eventos', JSON.stringify(eventos));
    }
}

if (Object.keys(eventos).length === 0) {
    inicializarDadosExemplo();
}