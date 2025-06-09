const express = require('express');
const path = require('path');
const mockData = require('./mockData');

const app = express();

// Раздаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.get('/api/cards', (req, res) => {
  res.json(mockData.cards);
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});