
/* ==========================================
   REPEATED NAVIGATION
========================================== */

const repeatedLinks = document.getElementById("repeatedLinks");

const repeatText = "DOES NOT EXIST AT THE MOMENT";
const repeatAmount = 20;

const redColors = [
    "#450000", // Dark blood red
    "#320000", // Deep red
    "#240000", // Very dark red
    "#3a0505", // Muted crimson
    "#180000", // Almost black
    "#2b0303", // Shadow red
    "#500808"  // Faded dark crimson
];

const glitchSymbols =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&/=?¤";

const letters = [];
const words = [];

const activeLetters = new Set();
const activeWords = new Set();


/* ==========================================
   CONFIGURATION
========================================== */

const glitchConfig = {
    interval: 100,
    minLetters: 1,
    maxLetters: 4,
    minDuration: 60,
    maxDuration: 180,
    distortion: 2,

    // Word corruption
    corruptionInterval: 350,
    corruptionChance: 0.35,
    minCorruptionDuration: 80,
    maxCorruptionDuration: 300,
    minCorruptionLength: 5,
    maxCorruptionLength: 18
};


/* ==========================================
   RANDOM HELPERS
========================================== */

function randomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomCharacter() {
    return glitchSymbols[
        randomNumber(0, glitchSymbols.length - 1)
    ];
}

function generateCorruptedText(length) {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += randomCharacter();
    }

    return result;
}


/* ==========================================
   CREATE REPEATED NAVIGATION LINKS
========================================== */

if (repeatedLinks) {
    for (let i = 0; i < repeatAmount; i++) {
        const link = document.createElement("a");

        link.href = "#";
        link.setAttribute("aria-label", repeatText);

        const textWords = repeatText.split(" ");

        textWords.forEach((wordText, index) => {
            const word = document.createElement("span");

            word.className = "glitch-word";

            const wordLetters = [];

            for (const character of wordText) {
                const letter = document.createElement("span");

                letter.className = "glitch-letter";
                letter.textContent = character;

                word.appendChild(letter);

                letters.push(letter);
                wordLetters.push(letter);
            }

            words.push({
                element: word,
                original: wordText,
                letters: wordLetters
            });

            link.appendChild(word);

            if (index < textWords.length - 1) {
                link.appendChild(
                    document.createTextNode(" ")
                );
            }
        });

        repeatedLinks.appendChild(link);
    }
}


/* ==========================================
   INDIVIDUAL LETTER GLITCH
========================================== */

function glitchLetter(letter) {
    if (activeLetters.has(letter)) return;

    const wordElement = letter.closest(".glitch-word");

    if (activeWords.has(wordElement)) return;

    activeLetters.add(letter);

    const color = redColors[
        randomNumber(0, redColors.length - 1)
    ];

    const offsetX =
        (Math.random() * 2 - 1) * glitchConfig.distortion;

    const offsetY =
        (Math.random() * 2 - 1) * glitchConfig.distortion;

    letter.style.color = color;

    letter.style.transform =
        `translate(${offsetX}px, ${offsetY}px)`;

    letter.style.textShadow =
        "1px 0 #450000, -1px 0 #180000";

    letter.classList.add("glitch-active");

    const duration = randomNumber(
        glitchConfig.minDuration,
        glitchConfig.maxDuration
    );

    setTimeout(() => {
        letter.style.color = "";
        letter.style.transform = "";
        letter.style.textShadow = "";

        letter.classList.remove("glitch-active");
        activeLetters.delete(letter);
    }, duration);
}


/* ==========================================
   RANDOM LETTER GLITCH
========================================== */

function randomGlitch() {
    if (letters.length === 0) return;

    const amount = randomNumber(
        glitchConfig.minLetters,
        glitchConfig.maxLetters
    );

    for (let i = 0; i < amount; i++) {
        const letter = letters[
            randomNumber(0, letters.length - 1)
        ];

        glitchLetter(letter);
    }
}


/* ==========================================
   WORD CORRUPTION
========================================== */

function corruptWord(wordData) {
    const word = wordData.element;

    if (activeWords.has(word)) return;

    activeWords.add(word);

    // Hide original letters
    wordData.letters.forEach(letter => {
        letter.style.visibility = "hidden";
    });

    // Create corrupted text
    const corrupted = document.createElement("span");

    corrupted.className = "corrupted-text";

    const length = randomNumber(
        glitchConfig.minCorruptionLength,
        glitchConfig.maxCorruptionLength
    );

    corrupted.textContent = generateCorruptedText(length);

    word.appendChild(corrupted);
    word.classList.add("word-corrupted");

    // Continuously scramble the characters
    const scrambleInterval = setInterval(() => {
        corrupted.textContent =
            generateCorruptedText(length);
    }, 45);

    const duration = randomNumber(
        glitchConfig.minCorruptionDuration,
        glitchConfig.maxCorruptionDuration
    );

    // Restore original text
    setTimeout(() => {
        clearInterval(scrambleInterval);

        corrupted.remove();

        wordData.letters.forEach(letter => {
            letter.style.visibility = "";
        });

        word.classList.remove("word-corrupted");
        activeWords.delete(word);
    }, duration);
}


/* ==========================================
   RANDOM WORD CORRUPTION
========================================== */

function randomCorruption() {
    if (words.length === 0) return;

    if (Math.random() > glitchConfig.corruptionChance) {
        return;
    }

    const wordData = words[
        randomNumber(0, words.length - 1)
    ];

    corruptWord(wordData);
}


/* ==========================================
   START NAVIGATION EFFECTS
========================================== */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (!reducedMotion.matches) {
    setInterval(
        randomGlitch,
        glitchConfig.interval
    );

    setInterval(
        randomCorruption,
        glitchConfig.corruptionInterval
    );
}


/* ==========================================
   CONTACT FORM
========================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        alert("Message received.");
    });
}


/* ==========================================
   BACKGROUND MUSIC & HOME SOUND
========================================== */

const backgroundMusic =
    document.getElementById("backgroundMusic");

const homeSound =
    document.getElementById("homeSound");

// Sound volumes
if (backgroundMusic) {
    backgroundMusic.volume = 0.45;
}

if (homeSound) {
    homeSound.volume = 0.7;
    homeSound.loop = false;
    homeSound.load();
}

// Track music initialization
let backgroundMusicStarted = false;

// HOME state
let homeActive = false;


/* ==========================================
   START BACKGROUND MUSIC
========================================== */

function startBackgroundMusic() {
    if (!backgroundMusic) return;

    // Never start the ambience during HOME
    if (homeActive) return;

    // Only start automatically once
    if (backgroundMusicStarted) return;

    backgroundMusic.play()
        .then(() => {
            backgroundMusicStarted = true;
        })
        .catch(error => {
            console.warn(
                "Background music could not play:",
                error
            );
        });
}

// Start on the first valid interaction
document.addEventListener("click", startBackgroundMusic);
document.addEventListener("keydown", startBackgroundMusic);


/* ==========================================
   DO NOT OPEN EVENT
========================================== */

const doNotOpen = document.getElementById("doNotOpen");

const darkScreen = document.getElementById("darkScreen");
const darkMessage = document.getElementById("darkMessage");

let darkTimeout = null;
let darkActive = false;


/* OPEN DARK SCREEN */

function openDarkScreen(event) {
    event.preventDefault();

    if (darkActive || homeActive || !darkScreen) return;

    darkActive = true;

    // Slowly fade into darkness
    darkScreen.classList.add("active");

    darkScreen.setAttribute("aria-hidden", "false");

    // Reveal the white text after darkness
    darkTimeout = setTimeout(() => {
        if (!darkActive) return;

        darkScreen.classList.add("show-message");
    }, 3500);
}


/* CLOSE DARK SCREEN */

function closeDarkScreen() {
    if (!darkActive || !darkScreen) return;

    clearTimeout(darkTimeout);
    darkTimeout = null;

    darkScreen.classList.remove(
        "show-message",
        "active"
    );

    darkScreen.setAttribute("aria-hidden", "true");

    darkActive = false;
}


/* DO NOT OPEN EVENTS */

if (doNotOpen) {
    doNotOpen.addEventListener("click", openDarkScreen);
}

if (darkScreen) {
    darkScreen.addEventListener("click", closeDarkScreen);
}


/* ==========================================
   HOME HORROR EVENT
========================================== */

const homeButton = document.getElementById("homeButton");

const homeScreen = document.getElementById("homeScreen");
const homeImage = document.getElementById("homeImage");

let homeTimeouts = [];
let glitchTimer = null;


/* ==========================================
   HOME CONFIGURATION
========================================== */

const homeConfig = {
    blackDuration: 5000,     // 5 seconds black
    glitchDuration: 3000,    // 3 seconds glitching
    imageDelay: 500,         // Wait before revealing image

    minFlashTime: 40,
    maxFlashTime: 180,

    stopMusic: true,
    playSound: true,
    soundVolume: 0.7
};


/* ==========================================
   HOME TIMER HELPERS
========================================== */

function homeRandom(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function homeSchedule(callback, delay) {
    const timeout = setTimeout(callback, delay);

    homeTimeouts.push(timeout);

    return timeout;
}


/* ==========================================
   PLAY HOME SOUND
========================================== */

function playHomeSound() {
    if (!homeSound || !homeConfig.playSound) return;

    homeSound.pause();

    homeSound.currentTime = 0;
    homeSound.volume = homeConfig.soundVolume;

    homeSound.play().catch(error => {
        console.warn(
            "HOME sound could not play:",
            error
        );
    });
}


/* ==========================================
   REVEAL HOME IMAGE
========================================== */

function revealHomeImage() {
    if (!homeActive || !homeScreen) return;

    // Ensure the background stays black
    homeScreen.classList.remove("white-flash");

    // Show the horror image
    homeScreen.classList.add("show-image");

    // Trigger sound at the same moment
    playHomeSound();
}


/* ==========================================
   BLACK AND WHITE GLITCH
========================================== */

function startHomeGlitch() {
    if (!homeActive || !homeScreen) return;

    // Skip flashing if reduced motion is enabled
    if (reducedMotion.matches) {
        homeSchedule(
            revealHomeImage,
            homeConfig.glitchDuration +
            homeConfig.imageDelay
        );

        return;
    }

    const endTime =
        performance.now() + homeConfig.glitchDuration;

    function flash() {
        if (!homeActive) return;

        // End the glitch sequence
        if (performance.now() >= endTime) {
            homeScreen.classList.remove("white-flash");

            homeSchedule(
                revealHomeImage,
                homeConfig.imageDelay
            );

            return;
        }

        // Random black/white screen
        const white = Math.random() > 0.5;

        homeScreen.classList.toggle(
            "white-flash",
            white
        );

        // Random delay between flashes
        const nextFlash = homeRandom(
            homeConfig.minFlashTime,
            homeConfig.maxFlashTime
        );

        glitchTimer = setTimeout(
            flash,
            nextFlash
        );
    }

    flash();
}


/* ==========================================
   OPEN HOME SCREEN
========================================== */

function openHomeScreen(event) {
    event.preventDefault();

    if (homeActive || darkActive || !homeScreen) return;

    homeActive = true;

    // Prevent delayed ambience from restarting
    backgroundMusicStarted = true;

    // Clear any old effect state
    homeScreen.classList.remove(
        "white-flash",
        "show-image"
    );

    // Immediately turn the screen black
    homeScreen.classList.add("active");

    homeScreen.setAttribute("aria-hidden", "false");

    // Stop the background music
    if (homeConfig.stopMusic && backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    // Prepare sound effect
    if (homeSound) {
        homeSound.pause();
        homeSound.currentTime = 0;
    }

    // Stay completely black before glitching
    homeSchedule(() => {
        if (homeActive) {
            startHomeGlitch();
        }
    }, homeConfig.blackDuration);
}


/* ==========================================
   CLOSE HOME SCREEN
========================================== */

function closeHomeScreen() {
    if (!homeActive) return;

    homeActive = false;

    // Cancel scheduled effects
    homeTimeouts.forEach(clearTimeout);
    homeTimeouts = [];

    // Stop flashing
    clearTimeout(glitchTimer);
    glitchTimer = null;

    // Hide the HOME screen
    if (homeScreen) {
        homeScreen.classList.remove(
            "active",
            "white-flash",
            "show-image"
        );

        homeScreen.setAttribute("aria-hidden", "true");
    }

    // Stop and reset the horror sound
    if (homeSound) {
        homeSound.pause();
        homeSound.currentTime = 0;
    }

    // Background ambience remains stopped
}


/* ==========================================
   HOME EVENTS
========================================== */

if (homeButton) {
    homeButton.addEventListener("click", openHomeScreen);
}


/* ==========================================
   KEYBOARD EVENTS
========================================== */

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (homeActive) {
        closeHomeScreen();
        return;
    }

    if (darkActive) {
        closeDarkScreen();
    }
});


/* ==========================================
   DENNIS SECRET EVENT
========================================== */

const fullnameInput =
    document.getElementById("fullnameInput");

const dennisScreen =
    document.getElementById("dennisScreen");

const dennisSound =
    document.getElementById("dennisSound");

let dennisActive = false;
let dennisTimeout = null;

/* CONFIGURATION */

const dennisConfig = {
    triggerName: "dennis",
    numberDelay: 1500,
    soundVolume: 0.75,
    stopBackgroundMusic: true
};

/* OPEN SECRET SCREEN */

function openDennisScreen() {
    if (dennisActive || homeActive || darkActive) return;
    if (!dennisScreen) return;

    dennisActive = true;

    // Immediately cover the website
    dennisScreen.classList.add("active");

    dennisScreen.setAttribute("aria-hidden", "false");

    // Stop background music
    if (dennisConfig.stopBackgroundMusic && backgroundMusic) {
        backgroundMusic.pause();
    }

    // Play the horror sound
    if (dennisSound) {
        dennisSound.volume = dennisConfig.soundVolume;
        dennisSound.currentTime = 0;

        dennisSound.play().catch(error => {
            console.warn("Dennis sound could not play:", error);
        });
    }

    dennisScreen.classList.add("show-number");
}

/* CLOSE SECRET SCREEN */

function closeDennisScreen() {
    if (!dennisActive) return;

    clearTimeout(dennisMouseTimeout);
dennisMouseTimeout = null;

// Hide background image
dennisScreen.classList.remove("mouse-moving");

    dennisScreen.classList.remove(
        "active",
        "show-number"
    );

    dennisScreen.setAttribute("aria-hidden", "true");

    if (dennisSound) {
        dennisSound.pause();
        dennisSound.currentTime = 0;
    }

    dennisActive = false;

    // Clear input so the secret can be triggered again
    if (fullnameInput) {
        fullnameInput.value = "";
    }
}

/* WATCH FULLNAME INPUT */

if (fullnameInput) {
    fullnameInput.addEventListener("input", function() {
        const enteredName =
            fullnameInput.value.trim().toLowerCase();

        if (enteredName === dennisConfig.triggerName) {
            openDennisScreen();
        }
    });
}

/* PRESS ESC TO RETURN */

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && dennisActive) {
        closeDennisScreen();
    }
});


/* ==========================================
   DENNIS MOUSE MOVEMENT EFFECT
========================================== */

let dennisMouseTimeout = null;

const dennisMouseConfig = {
    hideDelay: 100 // Time before image disappears (ms)
};

/* MOUSE MOVEMENT */

function handleDennisMouseMove() {
    // Only work while Dennis screen is active
    if (!dennisActive || !dennisScreen) return;

    // Show background image immediately
    dennisScreen.classList.add("mouse-moving");

    // Reset the inactivity timer
    clearTimeout(dennisMouseTimeout);

    // Hide image when the mouse stops
    dennisMouseTimeout = setTimeout(() => {
        dennisScreen.classList.remove("mouse-moving");
    }, dennisMouseConfig.hideDelay);
}

/* LISTEN FOR CURSOR MOVEMENT */

document.addEventListener(
    "pointermove",
    handleDennisMouseMove
);
