const anvandarnamn = document.getElementById('anvandarnamn');
const losen = document.getElementById('losen');
const ghost = document.querySelector('.ghost');
const ghostLosen = document.querySelector('.ghost-lösen');

// Visa när man klickar i fältet, göm när man lämnar det
if (anvandarnamn && ghost) {
    anvandarnamn.addEventListener('focus', () => ghost.classList.add('synlig'));
    anvandarnamn.addEventListener('blur', () => ghost.classList.remove('synlig'));
}

if (losen && ghostLosen) {
    losen.addEventListener('focus', () => ghostLosen.classList.add('synlig'));
    losen.addEventListener('blur', () => ghostLosen.classList.remove('synlig'));
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
