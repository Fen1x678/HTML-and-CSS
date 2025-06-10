document.addEventListener('DOMContentLoaded', () => {
  let balance = 0, income = 0, expenses = 0;

  const updateFinance = () => {
    document.getElementById('balance').textContent = `${balance} ₽`;
    document.getElementById('income').textContent = `${income} ₽`;
    document.getElementById('expenses').textContent = `${expenses} ₽`;
  };

  document.getElementById('add-income').addEventListener('click', () => {
    const amount = Math.floor(Math.random() * 4000 + 1000);
    income += amount;
    balance += amount;
    updateFinance();
    showToast(`Доход +${amount} ₽`, 'success');
  });

  document.getElementById('add-expense').addEventListener('click', () => {
    const amount = Math.floor(Math.random() * 2000 + 500);
    expenses += amount;
    balance -= amount;
    updateFinance();
    showToast(`Расход -${amount} ₽`, 'error');
  });

  function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    toast.style.backgroundColor = type === 'error' ? '#e74c3c' : '#4caf50';
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const cities = [
    { name: 'tokyo', title: 'Токио', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Tower_and_around_Skyscrapers.jpg', desc: 'Токио — столица Японии.' },
    { name: 'moscow', title: 'Москва', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Spasskaya_Tower%2C_Moscow_Kremlin_09-2016_img3.jpg', desc: 'Москва — столица России.' },
    { name: 'la', title: 'Лос-Анджелес', img: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Los_Angeles_Panorama.jpg', desc: 'Город Голливуда.' },
    { name: 'paris', title: 'Париж', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg', desc: 'Париж — город любви.' },
    { name: 'dubai', title: 'Дубай', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Dubai_skyline_2015.jpg', desc: 'Город небоскребов.' },
    { name: 'london', title: 'Лондон', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/London_Eye_Twilight_April_2006.jpg', desc: 'Лондон — столица Великобритании.' }
  ];

  const gallery = document.getElementById('gallery');

  function renderGallery(filter = 'all') {
    gallery.innerHTML = '';
    cities.filter(city => filter === 'all' || city.name === filter)
      .forEach(city => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `<img src="${city.img}" alt="${city.title}"><div class="photo-description">${city.desc}</div>`;
        card.addEventListener('click', () => {
          const desc = card.querySelector('.photo-description');
          desc.style.display = desc.style.display === 'block' ? 'none' : 'block';
        });
        gallery.appendChild(card);
      });
  }

  document.querySelectorAll('.button-group button').forEach(button => {
    button.addEventListener('click', () => {
      const city = button.getAttribute('data-city');
      renderGallery(city);
    });
  });

  // --- Карточки ---
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const cardForm = document.getElementById('card-form');
  const cardIdInput = document.getElementById('card-id');
  const cardTitleInput = document.getElementById('card-title');
  const cardDescInput = document.getElementById('card-desc');
  const closeBtn = document.querySelector('.close');
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';
  document.querySelector('.container').appendChild(cardsContainer);

  document.getElementById('add-card').addEventListener('click', () => {
    modalTitle.textContent = 'Добавить карточку';
    cardIdInput.value = '';
    cardTitleInput.value = '';
    cardDescInput.value = '';
    modal.style.display = 'block';
  });

  document.getElementById('edit-cards').addEventListener('click', () => {
    modalTitle.textContent = 'Редактировать карточки';
    modal.style.display = 'block';
    loadCardsXHR();
  });

  closeBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      title: cardTitleInput.value,
      description: cardDescInput.value
    };
    if (cardIdInput.value) {
      updateCardXHR(cardIdInput.value, data);
    } else {
      createCardXHR(data);
    }
  });

  function loadCardsXHR() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/api/cards');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const cards = JSON.parse(xhr.responseText);
        renderCards(cards);
        showToast('Карточки загружены', 'success');
      } else {
        showToast('Ошибка загрузки карточек', 'error');
      }
    };
    xhr.onerror = () => showToast('Сетевая ошибка', 'error');
    xhr.send();
  }

  function renderCards(cards) {
    cardsContainer.innerHTML = '<h2>Карточки</h2>';
    const cardsList = document.createElement('div');
    cardsList.className = 'cards-list';

    if (cards.length === 0) {
      cardsContainer.innerHTML += '<p>Нет карточек для отображения</p>';
      return;
    }

    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.innerHTML = `
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        <button class="edit-card" data-id="${card.id}">Редактировать</button>
      `;
      cardsList.appendChild(cardElement);
    });

    cardsContainer.appendChild(cardsList);

    document.querySelectorAll('.edit-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const card = cards.find(c => c.id == id);
        if (card) {
          modalTitle.textContent = 'Редактировать карточку';
          cardIdInput.value = card.id;
          cardTitleInput.value = card.title;
          cardDescInput.value = card.description;
          modal.style.display = 'block';
        }
      });
    });
  }

  function createCardXHR(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/api/cards');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 201) {
        showToast('Карточка создана', 'success');
        modal.style.display = 'none';
        loadCardsXHR();
      } else {
        showToast('Ошибка создания карточки', 'error');
      }
    };
    xhr.send(JSON.stringify(data));
  }

  function updateCardXHR(id, data) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/api/cards/${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        showToast('Карточка обновлена', 'success');
        modal.style.display = 'none';
        loadCardsXHR();
      } else {
        showToast('Ошибка обновления карточки', 'error');
      }
    };
    xhr.send(JSON.stringify(data));
  }

  renderGallery();
  loadCardsXHR();
});
