const express = require('express');
const path = require('path');
const mockData = require('./mockData');

const app = express();

// Раздаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для обработки JSON
app.use(express.json());

// API endpoint
app.get('/api/cards', (req, res) => {
  res.json(mockData.cards);
});

// Добавление новой карточки
app.post('/api/cards', (req, res) => {
  const newCard = {
    id: mockData.cards.length + 1,
    title: req.body.title,
    description: req.body.description
  };
  mockData.cards.push(newCard);
  res.status(201).json(newCard);
});

// Обновление карточки
app.put('/api/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = mockData.cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Карточка не найдена' });
  }
  
  mockData.cards[cardIndex] = {
    ...mockData.cards[cardIndex],
    title: req.body.title,
    description: req.body.description
  };
  
  res.json(mockData.cards[cardIndex]);
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});