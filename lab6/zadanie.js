function sort(sentence) {
  const words = sentence.split(' ');
  
  const sortedWords = words.map(word => {
    if (word.length === 0) return word;
    
    const lowerWord = word.toLowerCase();
    const sortedLetters = lowerWord.split('').sort().join('');
    
    return sortedLetters.charAt(0).toUpperCase() + sortedLetters.slice(1);
  });
  
  sortedWords.sort();
  
  return sortedWords.join(' ');
}

const input = "Hello World JavaScript";
const result = sort(input);
console.log(result); 
