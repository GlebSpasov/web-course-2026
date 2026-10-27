const buttons = document.querySelectorAll('.simon-btn');
const startBtn = document.getElementById('start-btn');
const statusEl = document.getElementById('game-status');
const levelCountEl = document.getElementById('level-count');

let sequence = [];
let playerSequence = [];
let level = 0;
let isPlaying = false;
let isGameStarted = false;
let roundTimeoutId = null;

const delay = (ms) => new Promise((resolve) => {
    roundTimeoutId = setTimeout(resolve, ms);
});

function activateButton(index) {
    return new Promise(async (resolve) => {
        const btn = buttons[index];
        btn.classList.add('active');
        await delay(450); // Время горения подсветки
        btn.classList.remove('active');
        await delay(200); // Пауза между кнопками
        resolve();
    });
}

async function playSequence() {
    isPlaying = true;
    statusEl.textContent = 'Запомните последовательность...';
    buttons.forEach((btn) => (btn.disabled = true));

    for (let i = 0; i < sequence.length; i++) {
        if (!isGameStarted) return; // Прерывание, если игра была перезапущена
        await activateButton(sequence[i]);
    }

    isPlaying = false;
    statusEl.textContent = 'Ваша очередь повторять!';
    buttons.forEach((btn) => (btn.disabled = false));
}

async function nextRound() {
    playerSequence = [];
    level++;
    levelCountEl.textContent = level;

    const randomColor = Math.floor(Math.random() * 4);
    sequence.push(randomColor);

    await delay(500);
    playSequence();
}

function startGame() {
    if (roundTimeoutId) {
        clearTimeout(roundTimeoutId);
    }
    sequence = [];
    playerSequence = [];
    level = 0;
    isGameStarted = true;
    statusEl.textContent = 'Игра началась!';
    startBtn.textContent = 'Заново';
    nextRound();
}

function handleButtonPress(e) {
    if (!isGameStarted || isPlaying) return;

    const index = parseInt(e.currentTarget.dataset.index);
    playerSequence.push(index);

    activateButtonQuick(index);

    const currentIndex = playerSequence.length - 1;

    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        gameOver();
        return;
    }

    if (playerSequence.length === sequence.length) {
        buttons.forEach((btn) => (btn.disabled = true));
        statusEl.textContent = 'Верно! Следующий раунд...';
        setTimeout(nextRound, 1000);
    }
}

function activateButtonQuick(index) {
    const btn = buttons[index];
    btn.classList.add('active');
    setTimeout(() => {
        btn.classList.remove('active');
    }, 200);
}

function gameOver() {
    isGameStarted = false;
    isPlaying = false;
    if (roundTimeoutId) {
        clearTimeout(roundTimeoutId);
    }
    statusEl.textContent = `Ошибка! Вы дошли до уровня ${level}.`;
    startBtn.textContent = 'Старт';
    buttons.forEach((btn) => (btn.disabled = true));
}

startBtn.addEventListener('click', startGame);

buttons.forEach((btn) => {
    btn.addEventListener('click', handleButtonPress);
});
