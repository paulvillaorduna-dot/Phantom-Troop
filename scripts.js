const anvandarnamn = document.getElementById('anvandarnamn');
const losen = document.getElementById('losen');
const ghost = document.querySelector('.ghost');
const ghostLosen = document.querySelector('.ghost-losen');

// Visa när man klickar i fältet, göm när man lämnar det
anvandarnamn.addEventListener('focus', () => ghost.classList.add('synlig'));
anvandarnamn.addEventListener('blur', () => ghost.classList.remove('synlig'));

losen.addEventListener('focus', () => ghostLosen.classList.add('synlig'));
losen.addEventListener('blur', () => ghostLosen.classList.remove('synlig'));


const loginForm = document.getElementById('login-form');
const jumpscare = document.getElementById('jumpscare');
const errorMessage = document.getElementById('error-message');

let attempts = 0;
let scareActive = false;

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (scareActive) return;

    const command = anvandarnamn.value
        .trim()
        .toLocaleLowerCase('sv-SE');

    if (
        command === 'öppna dörren' ||
        command === 'logga in'
    ) {
        window.location.href = 'nasta-sida.html';
        return;
    }

    attempts++;

    const messages = [
        'ÅTKOMST NEKAD.',
        'VI KÄNNER INTE IGEN DIG.',
        'VARFÖR FÖRSÖKER DU IGEN?',
        'DU BORDE INTE VARA HÄR.'
    ];

    const message = messages[
        Math.min(attempts - 1, messages.length - 1)
    ];

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) {
        errorMessage.textContent = message;
        return;
    }

    scareActive = true;

    errorMessage.textContent = '';

    jumpscare.style.display = 'block';

    setTimeout(() => {
        jumpscare.style.display = 'none';

        errorMessage.textContent = message;

        scareActive = false;

    }, 1500);
});