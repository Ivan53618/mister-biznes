document.addEventListener('DOMContentLoaded', function() {
    const joinButtons = document.querySelectorAll('.join-btn');
    const registerButtons = document.querySelectorAll('.register-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Обробник кнопок приєднання до столу
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const table = this.closest('.poker-table');
            const blinds = table.querySelector('p').textContent;
            
            if (confirm(`Приєднатися до столу з ${blinds}?`)) {
                // Імітація завантаження гри
                this.textContent = 'Завантаження...';
                this.disabled = true;
                
                setTimeout(() => {
                    alert('Гра завантажена! Приємної гри!');
                    this.textContent = 'Грати';
                    this.disabled = false;
                }, 2000);
            }
        });
    });
    
    // Обробник кнопок реєстрації на турнір
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tournament = this.closest('.poker-table');
            const buyIn = tournament.querySelector('p').textContent;
            const prizePool = tournament.querySelectorAll('p')[1].textContent;
            
            if (confirm(`Зареєструватися на турнір з ${buyIn}? ${prizePool}`)) {
                // Імітація реєстрації
                this.textContent = 'Зареєстровано';
                this.disabled = true;
                this.style.backgroundColor = '#4CAF50';
            }
        });
    });
    
    // Переключення вкладок з правилами
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Видалення активного класу з усіх кнопок і вмісту
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Додавання активного класу до обраної кнопки і вмісту
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Імітація живого чату турніру
    if (document.querySelector('.tournament-chat')) {
        const chatMessages = [
            "Гравець1: Я йду all-in!",
            "Гравець2: Викликаю!",
            "Гравець3: Фолдую...",
            "Гравець1: Туз-король, не погано!",
            "Гравець2: У мене сет!",
            "Гравець1: Невіроятно! Вітаю!"
        ];
        
        const chatContainer = document.querySelector('.tournament-chat');
        
        setInterval(() => {
            const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
            const messageElement = document.createElement('div');
            messageElement.textContent = randomMessage;
            messageElement.style.animation = 'fadeIn 0.5s';
            
            chatContainer.appendChild(messageElement);
            
            // Обмеження кількості повідомлень
            if (chatContainer.children.length > 5) {
                chatContainer.removeChild(chatContainer.children[0]);
            }
        }, 3000);
    }
});