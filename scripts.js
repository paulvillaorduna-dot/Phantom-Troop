const anvandarnamn = document.getElementById('anvandarnamn');
const losen = document.getElementById('losen');
const ghost = document.querySelector('.ghost');
const ghostLosen = document.querySelector('.ghost-lösen');

// Visa när man klickar i fältet, göm när man lämnar det
anvandarnamn.addEventListener('focus', () => ghost.classList.add('synlig'));
anvandarnamn.addEventListener('blur', () => ghost.classList.remove('synlig'));

losen.addEventListener('focus', () => ghostLosen.classList.add('synlig'));
losen.addEventListener('blur', () => ghostLosen.classList.remove('synlig'));