// Анімація слотів на головній сторінці
document.addEventListener('DOMContentLoaded', function() {
    // Анімація головних слотів
    if (document.getElementById('reel1')) {
        const reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];
        
        const symbols = ['7', '🍒', '🍋', '🍊', '⭐', '💰'];
        
        function spinReel(reel) {
            let spins = 0;
            const maxSpins = 10 + Math.floor(Math.random() * 10);
            const spinInterval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                spins++;
                
                if (spins >= maxSpins) {
                    clearInterval(spinInterval);
                    // 30% шанс на виграшну комбінацію
                    if (Math.random() < 0.3) {
                        reel.textContent = '7';
                    }
                }
            }, 100);
        }
        
        // Автоматичне крутіння кожні 5 секунд
        setInterval(() => {
            reels.forEach(reel => spinReel(reel));
        }, 5000);
        
        // Початкове крутіння
        setTimeout(() => {
            reels.forEach(reel => spinReel(reel));
        }, 1000);
    }
    
    // Анімація джекпоту
    if (document.getElementById('jackpot')) {
        const jackpotElement = document.getElementById('jackpot');
        let jackpotValue = 1234567;
        
        setInterval(() => {
            // Випадкове збільшення джекпоту
            const increase = Math.floor(Math.random() * 100);
            jackpotValue += increase;
            
            // Форматування з комами
            jackpotElement.textContent = jackpotValue.toLocaleString('en-US') + ' $';
            
            // Випадкова анімація
            if (Math.random() < 0.1) {
                jackpotElement.style.animation = 'none';
                void jackpotElement.offsetWidth; // Trigger reflow
                jackpotElement.style.animation = 'pulse 0.5s, glow 1s';
            }
        }, 3000);
    }
    
    // Плавний скрол для навігаційних посилань
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            } else {
                window.location.href = targetId;
            }
        });
    });
    
    // FAQ акордеон
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.toggle-icon');
            
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.textContent = '+';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '-';
            }
        });
    });
});