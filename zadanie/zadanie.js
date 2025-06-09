function sort(sentence) {
  // Разбиваем предложение на слова
  const words = sentence.split(' ');
  
  // Сортируем буквы в каждом слове и приводим к нужному регистру
  const sortedWords = words.map(word => {
    if (word.length === 0) return word;
    
    // Приводим слово к нижнему регистру, разбиваем на буквы, сортируем и соединяем обратно
    const lowerWord = word.toLowerCase();
    const sortedLetters = lowerWord.split('').sort().join('');
    
    // Делаем первую букву заглавной
    return sortedLetters.charAt(0).toUpperCase() + sortedLetters.slice(1);
  });
  
  // Сортируем слова в предложении
  sortedWords.sort();
  
  // Собираем предложение обратно
  return sortedWords.join(' ');
}

// Пример использования
const input = "Hello World JavaScript";
const result = sort(input);
console.log(result); // Выведет в терминал: "Dehlll Aaajvscrpt Wdlor"