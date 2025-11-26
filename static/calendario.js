let currentDate = new Date();
let selectedDate = new Date();
let activities = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    initializeDailySummary();
    setupEventListeners();
    
    loadSavedData();
    updateStats();
});

function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
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
    const lastDayIndex = lastDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day other-month';
        dayElement.textContent = prevMonthLastDay - i + 1;
        calendarDays.appendChild(dayElement);
    }
    
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
        const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
        const activityList = timeSlot.querySelector('.activity-list');
        
        const addBtn = timeSlot.querySelector('.add-btn');
        addBtn.addEventListener('click', function() {
            addActivity(time);
        });
        
        renderActivities(time, activityList);
    });
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('todayBtn').addEventListener('click', function() {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();
        updateDailySummaryTitle();
        loadActivitiesForDate(selectedDate);
    });
    
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('activity-input')) {
            const timeSlot = e.target.closest('.time-slot');
            const time = timeSlot.querySelector('.time-title').textContent;
            addActivity(time);
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
    
    document.getElementById('dailySummaryTitle').textContent = 
        `Resumo Diário - ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`;
}

function addActivity(time) {
    const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
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
    activityList.innerHTML = '';
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    const timeActivities = activities[dateKey] && activities[dateKey][time] 
        ? activities[dateKey][time] 
        : [];
    
    if (timeActivities.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Nenhuma atividade adicionada';
        activityList.appendChild(emptyMessage);
        return;
    }
    
    timeActivities.forEach((activity, index) => {
        const activityItem = document.createElement('li');
        activityItem.className = 'activity-item';
        if (activity.completed) {
            activityItem.style.opacity = '0.7';
            activityItem.style.borderLeftColor = '#2ecc71';
        }
        
        const activityText = document.createElement('span');
        activityText.className = 'activity-text';
        activityText.textContent = activity.text;
        if (activity.completed) {
            activityText.style.textDecoration = 'line-through';
        }
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'add-btn';
        completeBtn.innerHTML = activity.completed ? '✓' : '○';
        completeBtn.style.marginRight = '10px';
        completeBtn.style.fontSize = '0.9rem';
        completeBtn.addEventListener('click', function() {
            toggleActivityCompletion(time, index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
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
    
    if (activities[dateKey] && activities[dateKey][time] && 
        activities[dateKey][time].length > index) {
        
        activities[dateKey][time][index].completed = !activities[dateKey][time][index].completed;
        
        const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
        const activityList = timeSlot.querySelector('.activity-list');
        renderActivities(time, activityList);
        
        saveData();
        updateStats();
    }
}

function deleteActivity(time, index) {
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    if (activities[dateKey] && activities[dateKey][time] && 
        activities[dateKey][time].length > index) {
        
        activities[dateKey][time].splice(index, 1);
        
        const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
        const activityList = timeSlot.querySelector('.activity-list');
        renderActivities(time, activityList);
        
        saveData();
        updateStats();
    }
}

function loadActivitiesForDate(date) {
    const timeSlots = ['9:00 AM', '14:00 PM', '18:00 PM'];
    timeSlots.forEach(time => {
        const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
        const activityList = timeSlot.querySelector('.activity-list');
        renderActivities(time, activityList);
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
    
    document.getElementById('totalActivities').textContent = total;
    document.getElementById('completedActivities').textContent = completed;
    
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('productivityRate').textContent = `${rate}%`;
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
        
        const timeSlots = ['9:00 AM', '14:00 PM', '18:00 PM'];
        timeSlots.forEach(time => {
            const timeSlot = document.querySelector(`#${time.replace(':', '').replace(' ', '')}`);
            const activityList = timeSlot.querySelector('.activity-list');
            renderActivities(time, activityList);
        });
    }
}