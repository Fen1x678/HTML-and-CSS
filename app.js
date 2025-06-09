document.addEventListener('DOMContentLoaded', function() {
  // Начальные данные
  let cards = [
    {
      id: 1,
      title: "Зарплата",
      description: "+50000 руб",
      type: "income"
    },
    {
      id: 2,
      title: "Аренда квартиры",
      description: "-30000 руб",
      type: "expense"
    },
    {
      id: 3,
      title: "Фриланс",
      description: "+15000 руб",
      type: "income"
    }
  ];

  let balanceChart = null;

  // Инициализация
  renderCards();
  updateInformers();
  setupEventListeners();

  // Отрисовка карточек
  function renderCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    
    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = `card ${card.type}`;
      cardElement.innerHTML = `
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        <button class="delete-btn" data-id="${card.id}">
          <i class="fas fa-trash"></i> Удалить
        </button>
      `;
      container.appendChild(cardElement);
    });
  }

  // Обновление информеров
  function updateInformers() {
    let income = 0;
    let expense = 0;
    
    cards.forEach(card => {
      const amount = parseInt(card.description.replace(/[^0-9]/g, ''));
      if (card.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });
    
    const balance = income - expense;
    
    document.querySelectorAll('.informer-value')[0].textContent = `${balance.toLocaleString()} ₽`;
    document.querySelectorAll('.informer-value')[1].textContent = `${income.toLocaleString()} ₽`;
    document.querySelectorAll('.informer-value')[2].textContent = `${expense.toLocaleString()} ₽`;
    
    updateChart(balance, income, expense);
  }

  // Обновление графика
  function updateChart(balance, income, expense) {
    const ctx = document.getElementById('balance-history').getContext('2d');
    
    if (balanceChart) {
      balanceChart.destroy();
    }
    
    const labels = [];
    const balanceData = [];
    const now = new Date();
    
    // Генерация данных за последние 7 дней
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('ru-RU', { weekday: 'short' }));
      
      if (i === 0) {
        balanceData.push(balance);
      } else {
        balanceData.push(Math.max(0, balance - Math.floor(Math.random() * 20000) + 10000));
      }
    }
    
    balanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Баланс',
          data: balanceData,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
          }
        }
      }
    });
  }

  // Добавление новой операции
  function addNewOperation() {
    const types = ['income', 'expense'];
    const incomeTitles = ['Зарплата', 'Фриланс', 'Дивиденды', 'Проценты по вкладу'];
    const expenseTitles = ['Продукты', 'Транспорт', 'Коммуналка', 'Развлечения'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 40000) + 5000;
    const title = type === 'income' 
      ? incomeTitles[Math.floor(Math.random() * incomeTitles.length)]
      : expenseTitles[Math.floor(Math.random() * expenseTitles.length)];
    
    const newCard = {
      id: Date.now(),
      title: title,
      description: `${type === 'income' ? '+' : '-'}${amount} руб`,
      type: type
    };
    
    cards.push(newCard);
    renderCards();
    updateInformers();
    showToast(`Добавлена новая операция: ${title}`, 'success');
  }

  // Удаление операции
  function deleteOperation(id) {
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex !== -1) {
      const deletedCard = cards.splice(cardIndex, 1)[0];
      renderCards();
      updateInformers();
      showToast(`Удалена операция: ${deletedCard.title}`, 'info');
    }
  }

  // Показать уведомление
  function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeIn 0.3s reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Настройка обработчиков событий
  function setupEventListeners() {
    // Кнопка добавления операции
    document.getElementById('add-card').addEventListener('click', addNewOperation);
    
    // Удаление операции (делегирование событий)
    document.getElementById('cards-container').addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
        const id = parseInt(btn.dataset.id);
        deleteOperation(id);
      }
    });
    
    // Переключение истории баланса
    document.querySelector('.history-toggle').addEventListener('click', function() {
      const container = document.querySelector('.history-container');
      const icon = this.querySelector('i');
      
      container.classList.toggle('hidden');
      
      if (container.classList.contains('hidden')) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    });
    
    // Кнопки покупки
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const productName = this.closest('.product-card').querySelector('h3').textContent;
        showToast(`Товар "${productName}" добавлен в корзину`, 'success');
      });
    });
  }
});