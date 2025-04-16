document.addEventListener('DOMContentLoaded', function() {
    const reel1 = document.getElementById('slot-reel1');
    const reel2 = document.getElementById('slot-reel2');
    const reel3 = document.getElementById('slot-reel3');
    const spinBtn = document.querySelector('.spin-btn');
    const betDisplay = document.querySelector('.current-bet');
    const balanceDisplay = document.querySelector('.balance');
    const betButtons = document.querySelectorAll('.bet-btn');
    
    const symbols = ['🍒', '🍋', '🍊', '⭐', '💰', '7'];
    let balance = 1000;
    let currentBet = 10;
    let isSpinning = false;
    
    // Ініціалізація барабанів
    function initReels() {
        for (let i = 0; i < 10; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel1.appendChild(symbol.cloneNode(true));
            reel2.appendChild(symbol.cloneNode(true));
            reel3.appendChild(symbol.cloneNode(true));
        }
    }
    
    // Крутіння одного барабана
    function spinReel(reel) {
        return new Promise(resolve => {
            const symbols = reel.querySelectorAll('.symbol');
            const spinDuration = 2000 + Math.random() * 1000;
            const startTime = Date.now();
            
            const spin = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / spinDuration;
                
                if (progress >= 1) {
                    resolve();
                    return;
                }
                
                const offset = -progress * 1000 % 100;
                reel.style.transform = `translateY(${offset}px)`;
                
                requestAnimationFrame(spin);
            };
            
            spin();
        });
    }
    
    // Перевірка виграшної комбінації
    function checkWin() {
        const reels = [reel1, reel2, reel3];
        const centerSymbols = [];
        
        reels.forEach(reel => {
            const symbols = reel.querySelectorAll('.symbol');
            const centerPos = -parseInt(reel.style.transform || '0px') % 100;
            const centerIndex = Math.floor((symbols.length * 100 + centerPos) / 100) % symbols.length;
            centerSymbols.push(symbols[centerIndex].textContent);
        });
        
        // Виграшні комбінації
        if (centerSymbols[0] === centerSymbols[1] && centerSymbols[1] === centerSymbols[2]) {
            let multiplier = 0;
            
            switch(centerSymbols[0]) {
                case '🍒': multiplier = 2; break;
                case '🍋': multiplier = 3; break;
                case '🍊': multiplier = 5; break;
                case '⭐': multiplier = 10; break;
                case '💰': multiplier = 15; break;
                case '7': multiplier = 20; break;
            }
            
            const winAmount = currentBet * multiplier;
            balance += winAmount;
            balanceDisplay.textContent = balance;
            
            // Анімація виграшу
            reels.forEach(reel => {
                reel.style.boxShadow = '0 0 20px gold';
                setTimeout(() => {
                    reel.style.boxShadow = 'none';
                }, 2000);
            });
            
            alert(`Ви виграли ${winAmount}$! Комбінація: ${centerSymbols[0]} ${centerSymbols[1]} ${centerSymbols[2]}`);
        } else {
            balance -= currentBet;
            balanceDisplay.textContent = balance;
        }
    }
    
    // Обробник кнопки Spin
    spinBtn.addEventListener('click', async function() {
        if (isSpinning || balance < currentBet) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        
        // Анімація крутіння
        await Promise.all([
            spinReel(reel1),
            spinReel(reel2),
            spinReel(reel3)
        ]);
        
        checkWin();
        isSpinning = false;
        spinBtn.disabled = false;
    });
    
    // Зміна ставки
    betButtons.forEach(button => {
        button.addEventListener('click', function() {
            const change = parseInt(this.dataset.change);
            const newBet = currentBet + change;
            
            if (newBet >= 1 && newBet <= balance) {
                currentBet = newBet;
                betDisplay.textContent = currentBet;
                
                // Анімація зміни ставки
                betDisplay.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    betDisplay.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    initReels();
});