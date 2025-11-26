/* static/calendario.js - Versão Corrigida e Robusta */

let currentDate = new Date();
let selectedDate = new Date();
let activities = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema Nexo: Iniciando calendário...");
    
    try {
        initializeCalendar();
        initializeDailySummary();
        setupEventListeners();
        loadSavedData();
        updateStats();
        console.log("Sistema Nexo: Calendário carregado com sucesso!");
    } catch (error) {
        console.error("Sistema Nexo: Erro ao carregar calendário:", error);
    }
});

function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarDays || !currentMonthElement) return;

    calendarDays.innerHTML = '';
    
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    currentMonthElement.textContent = 
        `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const firstDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    // Dias do mês anterior
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day other-month';
        dayElement.textContent = prevMonthLastDay - i + 1;
        calendarDays.appendChild(dayElement);
    }
    
    // Dias atuais
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = i;
        dayElement.dataset.day = i;
        dayElement.dataset.month = currentDate.getMonth();
        dayElement.dataset.year = currentDate.getFullYear();
        
        if (i === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        if (i === selectedDate.getDate() && 
            currentDate.getMonth() === selectedDate.getMonth() && 
            currentDate.getFullYear() === selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', function() {
            selectDate(this);
        });
        
        calendarDays.appendChild(dayElement);
    }
    
    // Preencher resto da grade (total 42 células para manter altura fixa)
    const totalCells = 42; 
    const remainingCells = totalCells - (firstDayIndex + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day other-month';
        dayElement.textContent = i;
        calendarDays.appendChild(dayElement);
    }
}

function initializeDailySummary() {
    const timeSlots = ['9:00 AM', '14:00 PM', '18:00 PM'];
    
    timeSlots.forEach(time => {
        // Converte "9:00 AM" para "900AM" para bater com o ID do HTML
        const idFormatado = time.replace(':', '').replace(' ', '');
        const timeSlot = document.getElementById(idFormatado);
        
        if (timeSlot) {
            const activityList = timeSlot.querySelector('.activity-list');
            const addBtn = timeSlot.querySelector('.add-btn');
            
            if (addBtn) {
                // Remove listeners antigos clonando o botão (truque para evitar duplicação)
                const newBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newBtn, addBtn);
                
                newBtn.addEventListener('click', function() {
                    addActivity(time);
                });
            }
            
            if (activityList) {
                renderActivities(time, activityList);
            }
        } else {
            console.warn(`Elemento de horário não encontrado: ${idFormatado}`);
        }
    });
}

function setupEventListeners() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            currentDate = new Date();
            selectedDate = new Date();
            renderCalendar();
            updateDailySummaryTitle();
            loadActivitiesForDate(selectedDate);
        });
    }
    
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('activity-input')) {
            const timeSlot = e.target.closest('.time-slot');
            if (timeSlot) {
                const timeTitle = timeSlot.querySelector('.time-title');
                if (timeTitle) {
                    const time = timeTitle.textContent.trim();
                    addActivity(time);
                }
            }
        }
    });
}

function selectDate(dayElement) {
    document.querySelectorAll('.day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    dayElement.classList.add('selected');
    
    const day = parseInt(dayElement.dataset.day);
    const month = parseInt(dayElement.dataset.month);
    const year = parseInt(dayElement.dataset.year);
    
    selectedDate = new Date(year, month, day);
    
    updateDailySummaryTitle();
    loadActivitiesForDate(selectedDate);
    updateStats();
}

function updateDailySummaryTitle() {
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    const title = document.getElementById('dailySummaryTitle');
    if (title) {
        title.textContent = `Resumo Diário - ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`;
    }
}

function addActivity(time) {
    const idFormatado = time.replace(':', '').replace(' ', '');
    const timeSlot = document.getElementById(idFormatado);
    if (!timeSlot) return;

    const activityInput = timeSlot.querySelector('.activity-input');
    const activityText = activityInput.value.trim();
    
    if (activityText === '') return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    if (!activities[dateKey]) {
        activities[dateKey] = {};
    }
    
    if (!activities[dateKey][time]) {
        activities[dateKey][time] = [];
    }
    
    activities[dateKey][time].push({
        text: activityText,
        completed: false
    });
    
    const activityList = timeSlot.querySelector('.activity-list');
    renderActivities(time, activityList);
    
    activityInput.value = '';
    
    saveData();
    updateStats();
}

function renderActivities(time, activityList) {
    if (!activityList) return;
    activityList.innerHTML = '';
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    const timeActivities = activities[dateKey] && activities[dateKey][time] 
        ? activities[dateKey][time] 
        : [];
    
    if (timeActivities.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Nenhuma atividade adicionada';
        emptyMessage.style.opacity = '0.5';
        emptyMessage.style.fontSize = '0.9rem';
        emptyMessage.style.padding = '10px 0';
        activityList.appendChild(emptyMessage);
        return;
    }
    
    timeActivities.forEach((activity, index) => {
        const activityItem = document.createElement('li');
        activityItem.className = 'activity-item';
        
        if (activity.completed) {
            activityItem.style.opacity = '0.5';
            activityItem.style.textDecoration = 'line-through';
        }
        
        const activityText = document.createElement('span');
        activityText.className = 'activity-text';
        activityText.textContent = activity.text;
        activityText.style.flex = '1';
        activityText.style.marginLeft = '10px';
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'add-btn';
        completeBtn.innerHTML = activity.completed ? 'Desfazer' : 'Concluir';
        completeBtn.style.fontSize = '0.8rem';
        completeBtn.style.color = activity.completed ? '#f39c12' : '#2ecc71';
        completeBtn.addEventListener('click', function() {
            toggleActivityCompletion(time, index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = 'Excluir'; // Texto explícito é melhor que ícone que pode falhar
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.fontSize = '0.8rem';
        deleteBtn.addEventListener('click', function() {
            deleteActivity(time, index);
        });
        
        activityItem.appendChild(completeBtn);
        activityItem.appendChild(activityText);
        activityItem.appendChild(deleteBtn);
        activityList.appendChild(activityItem);
    });
}

function toggleActivityCompletion(time, index) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    if (activities[dateKey] && activities[dateKey][time]) {
        activities[dateKey][time][index].completed = !activities[dateKey][time][index].completed;
        
        const idFormatado = time.replace(':', '').replace(' ', '');
        const timeSlot = document.getElementById(idFormatado);
        const activityList = timeSlot.querySelector('.activity-list');
        renderActivities(time, activityList);
        
        saveData();
        updateStats();
    }
}

function deleteActivity(time, index) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    if (activities[dateKey] && activities[dateKey][time]) {
        activities[dateKey][time].splice(index, 1);
        
        const idFormatado = time.replace(':', '').replace(' ', '');
        const timeSlot = document.getElementById(idFormatado);
        const activityList = timeSlot.querySelector('.activity-list');
        renderActivities(time, activityList);
        
        saveData();
        updateStats();
    }
}

function loadActivitiesForDate(date) {
    const timeSlots = ['9:00 AM', '14:00 PM', '18:00 PM'];
    timeSlots.forEach(time => {
        const idFormatado = time.replace(':', '').replace(' ', '');
        const timeSlot = document.getElementById(idFormatado);
        if (timeSlot) {
            const activityList = timeSlot.querySelector('.activity-list');
            renderActivities(time, activityList);
        }
    });
    
    updateStats();
}

function updateStats() {
    const dateKey = selectedDate.toISOString().split('T')[0];
    let total = 0;
    let completed = 0;
    
    if (activities[dateKey]) {
        Object.values(activities[dateKey]).forEach(timeActivities => {
            total += timeActivities.length;
            completed += timeActivities.filter(a => a.completed).length;
        });
    }
    
    const totalEl = document.getElementById('totalActivities');
    const completedEl = document.getElementById('completedActivities');
    const rateEl = document.getElementById('productivityRate');

    if(totalEl) totalEl.textContent = total;
    if(completedEl) completedEl.textContent = completed;
    
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    if(rateEl) rateEl.textContent = `${rate}%`;
}

function saveData() {
    const data = {
        activities: activities,
        currentDate: currentDate.getTime(),
        selectedDate: selectedDate.getTime()
    };
    localStorage.setItem('calendarData', JSON.stringify(data));
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('calendarData');
        if (savedData) {
            const data = JSON.parse(savedData);
            activities = data.activities || {};
            
            if (data.currentDate) {
                currentDate = new Date(data.currentDate);
            }
            
            if (data.selectedDate) {
                selectedDate = new Date(data.selectedDate);
            }
            
            renderCalendar();
            updateDailySummaryTitle();
            loadActivitiesForDate(selectedDate);
        }
    } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
        // Se der erro, reinicia limpo para não travar o app
        activities = {};
    }
}