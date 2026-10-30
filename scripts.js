const anvandarnamn = document.getElementById('anvandarnamn');
const losen = document.getElementById('losen');
const ghost = document.querySelector('.ghost');
const ghostLosen = document.querySelector('.ghost-losen');

// Visa när man klickar i fältet, göm när man lämnar det
if (anvandarnamn && ghost) {
    anvandarnamn.addEventListener('focus', () => ghost.classList.add('synlig'));
    anvandarnamn.addEventListener('blur', () => ghost.classList.remove('synlig'));
}

if (losen && ghostLosen) {
    losen.addEventListener('focus', () => ghostLosen.classList.add('synlig'));
    losen.addEventListener('blur', () => ghostLosen.classList.remove('synlig'));
}

// ===== Login form / jumpscare =====
const loginForm = document.getElementById('login-form');
const jumpscare = document.getElementById('jumpscare');
const errorMessage = document.getElementById('error-message');
const scareLjud = document.getElementById('scare-ljud');

let attempts = 0;
let scareActive = false;

if (loginForm) {
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

        scareLjud.currentTime = 0;
        scareLjud.play();

        jumpscare.style.display = 'block';

        setTimeout(() => {
            jumpscare.style.display = 'none';

            scareLjud.pause();
            scareLjud.currentTime = 0;

            errorMessage.textContent = message;

            scareActive = false;

        }, 1500);
    });
}

// ===== Chat support =====
const chatInput = document.querySelector('.support-input input');
const chatButton = document.querySelector('.support-input button');
const chatMessages = document.querySelector('.support-messages');

const API_URL = 'http://localhost:5000/api/chat';

function addMessage(text, who) {
    const p = document.createElement('p');
    p.className = `msg ${who}`;
    p.textContent = text;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

let chatBusy = false;

async function sendChat() {
    const text = chatInput.value.trim();
    if (!text || chatBusy) return;

    chatInput.value = '';
    addMessage(text, 'user');

    chatBusy = true;
    addMessage('...', 'bot');
    const thinking = chatMessages.lastChild;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        thinking.textContent = data.reply ?? 'No Response';
    } catch (err) {
        thinking.textContent = 'Kunde inte nå servern.';
        console.error(err);
    } finally {
        chatBusy = false;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

if (chatInput && chatButton && chatMessages) {
    chatButton.addEventListener('click', sendChat);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendChat();
        }
    });
}