const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// Логирование запросов
app.use(morgan('dev'));

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Парсинг данных форм
app.use(express.urlencoded({ extended: true }));

// API-маршрут
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Сервер работает корректно!',
    timestamp: new Date().toISOString()
  });
});

// Обработка формы
app.post('/api/submit', (req, res) => {
  res.json({
    message: `Привет, ${req.body.username || 'гость'}! Форма работает.`,
    status: 'success'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


app.post('/api/feedback', (req, res) => {
  res.json({ status: 'received', message: 'Спасибо за отзыв!' });
});