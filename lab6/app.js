document.addEventListener('DOMContentLoaded', () => {
  // ... (остальной код остается без изменений до функций работы с карточками)

  async function loadCards() {
    try {
      const response = await fetch('http://localhost:3000/api/cards');
      if (!response.ok) {
        throw new Error('Ошибка загрузки карточек');
      }
      const cards = await response.json();
      renderCards(cards);
      showToast('Карточки загружены', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function createCard(data) {
    try {
      const response = await fetch('http://localhost:3000/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка создания карточки');
      }
      
      showToast('Карточка создана', 'success');
      modal.style.display = 'none';
      loadCards();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function updateCard(id, data) {
    try {
      const response = await fetch(`http://localhost:3000/api/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка обновления карточки');
      }
      
      showToast('Карточка обновлена', 'success');
      modal.style.display = 'none';
      loadCards();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  renderGallery();
  loadCards();
});