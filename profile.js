document.addEventListener('DOMContentLoaded', function() {
    // Завантажуємо дані гравця
    const username = localStorage.getItem('gamezone_username') || "Гравець";
    const avatar = localStorage.getItem('gamezone_avatar') || "👤";
    const regDate = localStorage.getItem('gamezone_regdate') || new Date().toISOString();
    
    // Встановлюємо поточні значення
    document.getElementById('username-input').value = username;
    document.getElementById('current-avatar').textContent = avatar;
    document.getElementById('reg-date').textContent = new Date(regDate).toLocaleDateString();
    
    // Завантажуємо статистику
    loadStats();
    
    // Обробник вибору аватара
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            document.getElementById('current-avatar').textContent = emoji;
        });
    });
    
    // Обробник збереження профілю
    document.getElementById('save-profile').addEventListener('click', function() {
        const newUsername = document.getElementById('username-input').value.trim();
        const newAvatar = document.getElementById('current-avatar').textContent;
        
        if (newUsername.length < 2 || newUsername.length > 20) {
            alert("Ім'я повинно містити від 2 до 20 символів");
            return;
        }
        
        // Зберігаємо зміни
        localStorage.setItem('gamezone_username', newUsername);
        localStorage.setItem('gamezone_avatar', newAvatar);
        
        // Якщо це перше збереження, встановлюємо дату реєстрації
        if (!localStorage.getItem('gamezone_regdate')) {
            localStorage.setItem('gamezone_regdate', new Date().toISOString());
        }
        
        // Оновлюємо хедер
        document.getElementById('username').textContent = newUsername;
        document.getElementById('user-avatar').textContent = newAvatar;
        
        alert("Зміни збережено!");
    });
    
    // Завантажуємо досягнення
    loadAchievements();
});

function loadStats() {
    const username = localStorage.getItem('gamezone_username');
    
    // Космічні перегони
    let spaceRatings = JSON.parse(localStorage.getItem('gamezone_space-race_ratings')) || [];
    let spaceBest = spaceRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('space-stat').textContent = spaceBest ? spaceBest.score : '0';
    
    // Емодзі-пазл
    let emojiRatings = JSON.parse(localStorage.getItem('gamezone_emoji-match_ratings')) || [];
    let emojiBest = emojiRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('emoji-stat').textContent = emojiBest ? emojiBest.score : '0';
    
    // Загальна кількість ігор
    let totalGames = spaceRatings.filter(r => r.name === username).length + 
                    emojiRatings.filter(r => r.name === username).length;
    document.getElementById('total-games').textContent = totalGames;

    let guessRatings = JSON.parse(localStorage.getItem('gamezone_guess-number_ratings')) || [];
    let guessBest = guessRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('guess-stat').textContent = guessBest ? guessBest.score : '0';
    
    // Оновлюємо загальну кількість ігор
    totalGames += guessRatings.filter(r => r.name === username).length;
    document.getElementById('total-games').textContent = totalGames;
}

function loadAchievements() {
    const username = localStorage.getItem('gamezone_username');
    const achievementsGrid = document.getElementById('achievements-grid');
    
    const achievements = [
        {
            id: 'first-game',
            name: 'Перша гра',
            emoji: '🎮',
            desc: 'Зіграйте свою першу гру',
            check: () => localStorage.getItem('gamezone_regdate') !== null
        },
        {
            id: 'space-pro',
            name: 'Космічний ас',
            emoji: '🚀',
            desc: 'Наберіть 500+ балів у космічних перегонах',
            check: () => {
                const ratings = JSON.parse(localStorage.getItem('gamezone_space-race_ratings')) || [];
                return ratings.some(r => r.name === username && r.score >= 500);
            }
        },
        {
            id: 'memory-master',
            name: 'Майстер пам\'яті',
            emoji: '🧠',
            desc: 'Знайдіть всі пари менш ніж за 20 ходів',
            check: () => {
                const ratings = JSON.parse(localStorage.getItem('gamezone_emoji-match_ratings')) || [];
                return ratings.some(r => r.name === username && r.score >= 50);
            }
        },
        {
            id: 'regular-player',
            name: 'Постійний гравець',
            emoji: '🏆',
            desc: 'Зіграйте 10+ ігор',
            check: () => {
                const space = JSON.parse(localStorage.getItem('gamezone_space-race_ratings')) || [];
                const emoji = JSON.parse(localStorage.getItem('gamezone_emoji-match_ratings')) || [];
                return (space.filter(r => r.name === username).length + 
                        emoji.filter(r => r.name === username).length) >= 10;
            }
        }
    ];
    
    achievements.push(
        {
            id: 'number-master',
            name: 'Математик',
            emoji: '🧮',
            desc: 'Вгадайте число з різницею не більше 5',
            check: () => {
                const ratings = JSON.parse(localStorage.getItem('gamezone_guess-number_ratings')) || [];
                return ratings.some(r => r.name === username && r.score >= 95);
            }
        },
        {
            id: 'perfect-guess',
            name: 'Телепат',
            emoji: '🔮',
            desc: 'Вгадайте число точно',
            check: () => {
                const ratings = JSON.parse(localStorage.getItem('gamezone_guess-number_ratings')) || [];
                return ratings.some(r => r.name === username && r.score === 100);
            }
        }
    );
    
    achievements.forEach(ach => {
        const isUnlocked = ach.check();
        
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
        achievementEl.innerHTML = `
            <div class="achievement-icon">${ach.emoji}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
        `;
        
        achievementsGrid.appendChild(achievementEl);
    });
}