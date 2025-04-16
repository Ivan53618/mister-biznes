document.addEventListener('DOMContentLoaded', function() {
    const wheel = document.getElementById('wheel');
    const ball = document.querySelector('.ball');
    const spinBtn = document.querySelector('.spin-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const balanceDisplay = document.querySelector('.balance');
    const numberGrid = document.querySelector('.numbers-grid');
    const outsideBets = document.querySelector('.outside-bets');
    const chips = document.querySelectorAll('.chip');
    
    let balance = 1000;
    let currentChipValue = 1;
    let bets = {};
    let isSpinning = false;
    
    // Номери рулетки (0, 00, 1-36)
    const numbers = [
        { number: '0', color: 'green' },
        { number: '32', color: 'red' },
        { number: '15', color: 'black' },
        // ... додати всі номери рулетки
    ];
    
    // Обробник вибору фішки
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            currentChipValue = parseInt(this.dataset.value);
            
            // Підсвітка обраної фішки
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Ставка на число
    numberGrid.addEventListener('click', function(e) {
        if (isSpinning) return;
        
        const numberElement = e.target.closest('.number');
        if (!numberElement) return;
        
        placeBet(numberElement.dataset.number, currentChipValue, numberElement);
    });
    
    // Ставка на зовнішнє поле
    outsideBets.addEventListener('click', function(e) {
        if (isSpinning) return;
        
        const betOption = e.target.closest('.bet-option');
        if (!betOption) return;
        
        placeBet(betOption.dataset.bet, currentChipValue, betOption);
    });
    
    // Розміщення ставки
    function placeBet(betType, amount, element) {
        if (balance < amount) {
            alert('Недостатньо коштів!');
            return;
        }
        
        if (!bets[betType]) bets[betType] = 0;
        bets[betType] += amount;
        balance -= amount;
        balanceDisplay.textContent = balance;
        
        // Відображення ставки
        const chip = document.createElement('div');
        chip.className = `placed-chip chip-${currentChipValue}`;
        chip.textContent = currentChipValue;
        chip.style.position = 'absolute';
        chip.style.left = '50%';
        chip.style.top = '50%';
        chip.style.transform = 'translate(-50%, -50%)';
        element.appendChild(chip);
        
        // Анімація
        chip.style.animation = 'chip-drop 0.5s forwards';
    }
    
    // Крутіння рулетки
    spinBtn.addEventListener('click', function() {
        if (isSpinning || Object.keys(bets).length === 0) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        clearBtn.disabled = true;
        
        // Випадковий вибір числа (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        const winningNumberObj = numbers.find(n => n.number === winningNumber.toString());
        
        // Анімація крутіння
        const spinDuration = 5000;
        const startTime = Date.now();
        const rotations = 5 + Math.random() * 3;
        
        const spin = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / spinDuration;
            
            if (progress >= 1) {
                // Зупинка на виграшному номері
                const winningAngle = (winningNumber / 37) * 360;
                wheel.style.transform = `rotate(${rotations * 360 + winningAngle}deg)`;
                
                // Положення кульки
                const ballAngle = (winningAngle + 180) % 360;
                ball.style.transform = `rotate(${ballAngle}deg) translateX(100px) rotate(-${ballAngle}deg)`;
                
                setTimeout(() => {
                    calculateWinnings(winningNumber, winningNumberObj.color);
                    isSpinning = false;
                    spinBtn.disabled = false;
                    clearBtn.disabled = false;
                }, 1000);
                
                return;
            }
            
            // Плавне уповільнення
            const easeOut = 1 - Math.pow(1 - progress, 3);
            wheel.style.transform = `rotate(${easeOut * rotations * 360}deg)`;
            
            // Анімація кульки
            const ballAngle = (easeOut * rotations * 360 + 180) % 360;
            ball.style.transform = `rotate(${ballAngle}deg) translateX(100px) rotate(-${ballAngle}deg)`;
            
            requestAnimationFrame(spin);
        };
        
        spin();
    });
    
    // Розрахунок виграшу
    function calculateWinnings(number, color) {
        let winnings = 0;
        
        for (const [betType, amount] of Object.entries(bets)) {
            if (betType === number) {
                winnings += amount * 35; // Ставка на число 35:1
            } else if (betType === color) {
                winnings += amount * 1; // Ставка на колір 1:1
            } else if (betType === 'even' && number % 2 === 0 && number !== 0) {
                winnings += amount * 1; // Ставка на парні 1:1
            } else if (betType === 'odd' && number % 2 === 1) {
                winnings += amount * 1; // Ставка на непарні 1:1
            } else if (betType === '1-18' && number >= 1 && number <= 18) {
                winnings += amount * 1; // Ставка на 1-18 1:1
            } else if (betType === '19-36' && number >= 19 && number <= 36) {
                winnings += amount * 1; // Ставка на 19-36 1:1
            }
        }
        
        if (winnings > 0) {
            balance += winnings;
            balanceDisplay.textContent = balance;
            alert(`Виграшний номер: ${number}. Ви виграли ${winnings}$!`);
        } else {
            alert(`Виграшний номер: ${number}. Спробуйте ще!`);
        }
        
        // Очищення ставок
        clearBets();
    }
    
    // Очищення ставок
    clearBtn.addEventListener('click', clearBets);
    
    function clearBets() {
        if (isSpinning) return;
        
        document.querySelectorAll('.placed-chip').forEach(chip => chip.remove());
        bets = {};
    }
});