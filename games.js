document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    const gameScreen = document.getElementById('game-screen');
    const gameContainer = document.getElementById('game-container');
    const backButton = document.querySelector('.back-button');
    
    // Обробник вибору гри
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.dataset.game;
            showGame(gameType);
        });
    });
    
    // Кнопка "Назад"
    backButton.addEventListener('click', function() {
        gameScreen.classList.add('hidden');
        gameCards.forEach(card => card.style.display = 'flex');
    });
    
    function showGame(gameType) {
        gameCards.forEach(card => card.style.display = 'none');
        gameScreen.classList.remove('hidden');
        gameContainer.innerHTML = '';
        
        switch(gameType) {
            case 'space-race':
                initSpaceRace();
                break;
            case 'emoji-match':
                initEmojiMatch();
                break;
            case 'guess-number':
                initGuessNumber();
                break;
        }
    }
    
    // Гра "Космічні перегони"
    function initSpaceRace() {
        gameContainer.innerHTML = `
            <div class="space-game">
                <h2>Космічні перегони</h2>
                <p>Швидко натискай пробіл, щоб обігнати суперників!</p>
                <div class="race-track" id="race-track"></div>
                <div class="race-stats">
                    <p>Швидкість: <span id="speed">0</span> км/с</p>
                    <p>Пройдено: <span id="distance">0</span> км</p>
                </div>
                <div class="race-controls">
                    <button class="race-button" id="start-race">Почати гру</button>
                    <button class="race-button" id="boost" disabled>Буст (пробіл)</button>
                </div>
            </div>
        `;
        
        const raceTrack = document.getElementById('race-track');
        const startButton = document.getElementById('start-race');
        const boostButton = document.getElementById('boost');
        const speedDisplay = document.getElementById('speed');
        const distanceDisplay = document.getElementById('distance');
        
        let playerSpeed = 0;
        let playerDistance = 0;
        let raceInterval;
        let isRacing = false;
        let opponents = [];
        
        // Створюємо гравця
        const player = document.createElement('div');
        player.className = 'racer player';
        player.textContent = '🚀';
        player.style.top = '50%';
        raceTrack.appendChild(player);
        
        // Створюємо суперників
        function createOpponents() {
            opponents = [];
            const positions = ['20%', '40%', '60%', '80%'];
            
            positions.forEach(pos => {
                const opponent = document.createElement('div');
                opponent.className = 'racer';
                opponent.style.top = pos;
                opponent.textContent = ['🛸', '👽', '🛰️', '🌌'][Math.floor(Math.random() * 4)];
                raceTrack.appendChild(opponent);
                opponents.push({
                    element: opponent,
                    speed: Math.random() * 2 + 1,
                    distance: 0
                });
            });
            
            // Фінішна лінія
            const finishLine = document.createElement('div');
            finishLine.className = 'finish-line';
            raceTrack.appendChild(finishLine);
        }
        
        // Початок гри
        startButton.addEventListener('click', function() {
            if (isRacing) return;
            
            isRacing = true;
            startButton.disabled = true;
            boostButton.disabled = false;
            playerSpeed = 1;
            playerDistance = 0;
            
            // Очищаємо трек
            raceTrack.innerHTML = '';
            raceTrack.appendChild(player);
            createOpponents();
            
            // Запускаємо гру
            raceInterval = setInterval(updateRace, 50);
            
            // Обробник пробілу для бусту
            document.addEventListener('keydown', spaceBoost);
        });
        
        // Буст при натисканні пробілу
        function spaceBoost(e) {
            if (e.code === 'Space' && isRacing) {
                playerSpeed += 0.5;
                boostButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    boostButton.style.transform = 'scale(1)';
                }, 100);
            }
        }
        
        // Оновлення стану гри
        function updateRace() {
            // Рух гравця
            playerDistance += playerSpeed;
            player.style.left = `${20 + (playerDistance / 500) * 70}%`;
            
            // Рух суперників
            let allFinished = true;
            opponents.forEach(opp => {
                opp.distance += opp.speed;
                opp.element.style.left = `${20 + (opp.distance / 500) * 70}%`;
                
                if (opp.distance < 500) allFinished = false;
            });
            
            // Перевірка на фініш
            if (playerDistance >= 500 || allFinished) {
                endRace(playerDistance >= 500);
                return;
            }
            
            // Гальмування гравця
            playerSpeed = Math.max(1, playerSpeed * 0.99);
            
            // Оновлення статистики
            speedDisplay.textContent = Math.round(playerSpeed * 100);
            distanceDisplay.textContent = Math.round(playerDistance);
        }
        
        // Завершення гри
        function endRace(isWinner) {
            clearInterval(raceInterval);
            isRacing = false;
            startButton.disabled = false;
            boostButton.disabled = true;
            document.removeEventListener('keydown', spaceBoost);
            
            const score = Math.round(playerDistance * playerSpeed);
            
            if (isWinner) {
                alert(`Перемога! Твій рахунок: ${score}`);
            } else {
                alert(`Гру закінчено! Твій рахунок: ${score}`);
            }
            
            saveGameResult('space-race', score);
        }
    }
    
    // Гра "Емодзі-пазл"
    function initEmojiMatch() {
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const cards = [...emojis, ...emojis];
        
        // Перемішуємо картки
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        gameContainer.innerHTML = `
            <div class="emoji-game">
                <h2>Емодзі-пазл</h2>
                <p>Знайди всі пари однакових смайлів!</p>
                <div class="memory-game" id="memory-game"></div>
                <div class="memory-stats">
                    <p>Знайдено пар: <span id="pairs">0</span>/8</p>
                    <p>Ходи: <span id="moves">0</span></p>
                </div>
                <div class="memory-controls">
                    <button class="race-button" id="restart">Почати знову</button>
                </div>
            </div>
        `;
        
        const memoryGame = document.getElementById('memory-game');
        const pairsDisplay = document.getElementById('pairs');
        const movesDisplay = document.getElementById('moves');
        const restartButton = document.getElementById('restart');
        
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let canFlip = true;
        
        // Створюємо картки
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.addEventListener('click', flipCard);
            memoryGame.appendChild(card);
        });
        
        // Перевертання картки
        function flipCard() {
            if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) {
                return;
            }
            
            this.classList.add('flipped');
            this.textContent = this.dataset.emoji;
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                canFlip = false;
                moves++;
                movesDisplay.textContent = moves;
                
                // Перевіряємо чи це пара
                if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                    // Знайшли пару
                    flippedCards.forEach(card => {
                        card.classList.add('matched');
                        card.classList.remove('flipped');
                    });
                    
                    matchedPairs++;
                    pairsDisplay.textContent = matchedPairs;
                    flippedCards = [];
                    canFlip = true;
                    
                    // Перевіряємо чи гра закінчена
                    if (matchedPairs === emojis.length) {
                        setTimeout(() => {
                            const score = Math.max(1, Math.round(1000 / moves));
                            alert(`Вітаємо! Ви знайшли всі пари за ${moves} ходів! Рахунок: ${score}`);
                            saveGameResult('emoji-match', score);
                        }, 500);
                    }
                } else {
                    // Не пара - перевертаємо назад
                    setTimeout(() => {
                        flippedCards.forEach(card => {
                            card.classList.remove('flipped');
                            card.textContent = '';
                        });
                        
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        }
        
        // Кнопка перезапуску
        restartButton.addEventListener('click', function() {
            memoryGame.innerHTML = '';
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            pairsDisplay.textContent = '0';
            movesDisplay.textContent = '0';
            
            // Створюємо нові картки
            cards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.index = index;
                card.dataset.emoji = emoji;
                card.addEventListener('click', flipCard);
                memoryGame.appendChild(card);
            });
        });
    }
});

function initGuessNumber() {
    gameContainer.innerHTML = `
        <div class="guess-game">
            <h2>Вгадай число</h2>
            <p>Загадай число від 0 до 100 і спробуй вгадати!</p>
            
            <div class="guess-container">
                <div class="guess-input">
                    <input type="number" id="number-input" min="0" max="100" placeholder="0-100">
                    <button id="guess-button">Спробувати</button>
                </div>
                
                <div class="guess-result" id="guess-result">
                    <div class="guess-message">Введіть число та натисніть "Спробувати"</div>
                    <div class="guess-score">Можливий виграш: <span id="possible-score">0</span> балів</div>
                </div>
                
                <div class="guess-history" id="guess-history"></div>
            </div>
            
            <div class="guess-stats">
                <p>Спроби: <span id="attempts">0</span></p>
                <p>Найкращий результат: <span id="best-score">0</span></p>
            </div>
        </div>
    `;
    
    const numberInput = document.getElementById('number-input');
    const guessButton = document.getElementById('guess-button');
    const guessResult = document.getElementById('guess-result');
    const guessHistory = document.getElementById('guess-history');
    const attemptsDisplay = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('best-score');
    const possibleScoreDisplay = document.getElementById('possible-score');
    
    let secretNumber = Math.floor(Math.random() * 101);
    let attempts = 0;
    let bestScore = 0;
    
    // Оновлюємо можливий виграш при зміні числа
    numberInput.addEventListener('input', function() {
        const num = parseInt(this.value);
        if (isNaN(num) || num < 0 || num > 100) {
            possibleScoreDisplay.textContent = '0';
            return;
        }
        
        // Розраховуємо можливий виграш (100 балів за точне вгадування)
        const diff = Math.abs(num - secretNumber);
        const score = diff === 0 ? 100 : Math.max(0, 100 - diff);
        possibleScoreDisplay.textContent = score;
    });
    
    // Обробник кнопки спроби
    guessButton.addEventListener('click', function() {
        const num = parseInt(numberInput.value);
        
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Будь ласка, введіть число від 0 до 100");
            return;
        }
        
        attempts++;
        attemptsDisplay.textContent = attempts;
        
        // Розраховуємо результат
        const diff = Math.abs(num - secretNumber);
        const score = diff === 0 ? 100 : Math.max(0, 100 - diff);
        
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
        }
        
        // Відображаємо результат
        let message = '';
        if (diff === 0) {
            message = `Вітаємо! Ви вгадали число ${secretNumber} і отримали 100 балів!`;
            guessResult.style.backgroundColor = 'rgba(0, 184, 148, 0.2)';
        } else if (diff <= 5) {
            message = `Дуже гарно! Ви близько (${num}). Різниця: ${diff}. Виграш: ${score} балів`;
            guessResult.style.backgroundColor = 'rgba(0, 184, 148, 0.1)';
        } else if (diff <= 15) {
            message = `Непогано! Ваше число (${num}). Різниця: ${diff}. Виграш: ${score} балів`;
            guessResult.style.backgroundColor = 'rgba(253, 203, 110, 0.1)';
        } else {
            message = `Спробуйте ще! Ваше число (${num}). Різниця: ${diff}. Виграш: ${score} балів`;
            guessResult.style.backgroundColor = 'rgba(255, 118, 117, 0.1)';
        }
        
        guessResult.querySelector('.guess-message').textContent = message;
        
        // Додаємо спробу в історію
        const attemptItem = document.createElement('div');
        attemptItem.className = 'attempt-item';
        attemptItem.innerHTML = `
            <span>Спроба ${attempts}:</span>
            <span>${num}</span>
            <span>Різниця: ${diff}</span>
            <span>Бали: ${score}</span>
        `;
        guessHistory.prepend(attemptItem);
        
        // Якщо вгадали - пропонуємо нову гру
        if (diff === 0) {
            setTimeout(() => {
                if (confirm("Вітаємо! Хочете зіграти ще раз?")) {
                    startNewGame();
                } else {
                    saveGameResult('guess-number', score);
                }
            }, 500);
        }
    });
    
    function startNewGame() {
        secretNumber = Math.floor(Math.random() * 101);
        attempts = 0;
        attemptsDisplay.textContent = '0';
        guessHistory.innerHTML = '';
        numberInput.value = '';
        possibleScoreDisplay.textContent = '0';
        guessResult.querySelector('.guess-message').textContent = 'Введіть число та натисніть "Спробувати"';
        guessResult.style.backgroundColor = 'transparent';
    }
}