let secretNumber = '';
let attemptsHistory = [];
let isGameOver = false;

const form = document.getElementById('game-form');
const input = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const errorMessage = document.getElementById('error-message');
const attemptsCountEl = document.getElementById('attempts-count');
const historyList = document.getElementById('history-list');

//генерация случайного 4-значного числа с неповторяющимися цифрами
function generateSecretNumber() {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, 4).join('');
}

//валидация ввода пользователя
function validateInput(value) {
    if (!/^\d{4}$/.test(value)) {
        return { isValid: false, message: 'Введите ровно 4 цифры!' };
    }
    const uniqueDigits = new Set(value);
    if (uniqueDigits.size !== 4) {
        return { isValid: false, message: 'Все 4 цифры должны быть разными!' };
    }
    return { isValid: true, message: '' };
}

//подсчёт быков и коров
function calculateBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }
    return { bulls, cows };
}

function getDeclension(number, textForms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return textForms[2];
    if (n1 > 1 && n1 < 5) return textForms[1];
    if (n1 === 1) return textForms[0];
    return textForms[2];
}

function formatResultText(bulls, cows) {
    const bullStr = bulls > 0 ? `${bulls} ${getDeclension(bulls, ['бык', 'быка', 'быков'])}` : '';
    const cowStr = cows > 0 ? `${cows} ${getDeclension(cows, ['корова', 'коровы', 'коров'])}` : '';
    
    if (bulls === 0 && cows === 0) return 'нет совпадений';
    return [bullStr, cowStr].filter(Boolean).join(', ');
}

function initGame() {
    secretNumber = generateSecretNumber();
    attemptsHistory = [];
    isGameOver = false;
    errorMessage.textContent = '';
    input.value = '';
    input.disabled = false;
    checkBtn.disabled = false;
    render();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isGameOver) return;

    const guess = input.value.trim();
    const validation = validateInput(guess);

    if (!validation.isValid) {
        errorMessage.textContent = validation.message;
        return; // Попытка не засчитывается
    }

    errorMessage.textContent = '';
    const { bulls, cows } = calculateBullsAndCows(secretNumber, guess);

    const attemptRecord = {
        id: Date.now(),
        guess: guess,
        bulls: bulls,
        cows: cows,
        isWin: bulls === 4
    };

    attemptsHistory.push(attemptRecord);
    input.value = '';
    input.focus();

    if (bulls === 4) {
        isGameOver = true;
        input.disabled = true;
        checkBtn.disabled = true;
    }

    render();
});

input.addEventListener('input', () => {
    if (errorMessage.textContent) {
        errorMessage.textContent = '';
    }
});

newGameBtn.addEventListener('click', () => {
    initGame();
});

//рендеринг истории попыток из массива данных
function render() {
    historyList.innerHTML = '';

    attemptsHistory.forEach((attempt) => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const guessSpan = document.createElement('span');
        guessSpan.className = 'history-guess';
        guessSpan.textContent = attempt.guess;

        const resultSpan = document.createElement('span');
        resultSpan.className = 'history-result';

        if (attempt.isWin) {
            resultSpan.className = 'history-result win-message';
            resultSpan.textContent = `Победа! Угадано за ${attemptsHistory.length} попыток`;
        } else {
            resultSpan.textContent = formatResultText(attempt.bulls, attempt.cows);
        }

        li.appendChild(guessSpan);
        li.appendChild(resultSpan);
        historyList.appendChild(li);
    });

    attemptsCountEl.textContent = attemptsHistory.length;
}

initGame(); // запуск 
