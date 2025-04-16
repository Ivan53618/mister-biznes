// Ініціалізація даних гравця
document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи є збережені дані гравця
    if (!localStorage.getItem('gamezone_username')) {
        const username = prompt("Привіт! Як до тебе звертатися?", "Гравець");
        if (username) {
            localStorage.setItem('gamezone_username', username.trim());
        } else {
            localStorage.setItem('gamezone_username', "Гравець");
        }
    }

    // Встановлюємо ім'я та аватар
    document.getElementById('username').textContent = localStorage.getItem('gamezone_username');
    
    // Генеруємо випадковий аватар
    const avatars = ['👦', '👧', '🧑', '👩', '🤓', '🎮', '🕹️', '👾'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    document.getElementById('user-avatar').textContent = randomAvatar;
    
    // Завантажуємо рейтинг на сторінці рейтингу
    if (document.querySelector('.leaderboard')) {
        loadLeaderboard('space-race');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadLeaderboard(this.dataset.game);
            });
        });
        
        // Завантажуємо особисті рекорди
        loadPersonalBests();
    }
    
    // Завантажуємо статистику на сторінці ігор
    if (document.querySelector('.games-grid')) {
        loadGameStats();
    }

    // Встановлюємо ім'я та аватар
document.getElementById('username').textContent = localStorage.getItem('gamezone_username') || "Гравець";
const savedAvatar = localStorage.getItem('gamezone_avatar');
if (savedAvatar) {
    document.getElementById('user-avatar').textContent = savedAvatar;
} else {
    const avatars = ['👦', '👧', '🧑', '👩', '🤓', '🎮', '🕹️', '👾'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    document.getElementById('user-avatar').textContent = randomAvatar;
    localStorage.setItem('gamezone_avatar', randomAvatar);
}

});

function loadLeaderboard(gameType) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';
    
    // Отримуємо рейтинг з localStorage
    let ratings = JSON.parse(localStorage.getItem(`gamezone_${gameType}_ratings`)) || [];
    
    // Сортуємо за спаданням
    ratings.sort((a, b) => b.score - a.score);
    
    // Додаємо до таблиці
    ratings.slice(0, 10).forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-item';
        
        row.innerHTML = `
            <span>${index + 1}</span>
            <span>${item.name}</span>
            <span>${item.score}</span>
            <span>${new Date(item.date).toLocaleDateString()}</span>
        `;
        
        leaderboardBody.appendChild(row);
    });
    
    // Якщо немає результатів
    if (ratings.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'leaderboard-item';
        noResults.innerHTML = '<span colspan="4" style="grid-column: 1 / -1; text-align: center;">Ще немає результатів. Будь першим!</span>';
        leaderboardBody.appendChild(noResults);
    }
}

function loadPersonalBests() {
    const username = localStorage.getItem('gamezone_username');
    
    // Космічні перегони
    let spaceRatings = JSON.parse(localStorage.getItem('gamezone_space-race_ratings')) || [];
    let userSpaceBest = spaceRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('user-space').textContent = userSpaceBest ? userSpaceBest.score : '0';
    
    // Емодзі-пазл
    let emojiRatings = JSON.parse(localStorage.getItem('gamezone_emoji-match_ratings')) || [];
    let userEmojiBest = emojiRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('user-emoji').textContent = userEmojiBest ? userEmojiBest.score : '0';
}

function loadGameStats() {
    const username = localStorage.getItem('gamezone_username');
    
    // Космічні перегони
    let spaceRatings = JSON.parse(localStorage.getItem('gamezone_space-race_ratings')) || [];
    let spaceTop = spaceRatings.sort((a, b) => b.score - a.score)[0];
    document.getElementById('space-top').textContent = spaceTop ? spaceTop.score : '0';
    
    let userSpaceBest = spaceRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('space-user').textContent = userSpaceBest ? userSpaceBest.score : '0';
    
    // Емодзі-пазл
    let emojiRatings = JSON.parse(localStorage.getItem('gamezone_emoji-match_ratings')) || [];
    let emojiTop = emojiRatings.sort((a, b) => b.score - a.score)[0];
    document.getElementById('emoji-top').textContent = emojiTop ? emojiTop.score : '0';
    
    let userEmojiBest = emojiRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('emoji-user').textContent = userEmojiBest ? userEmojiBest.score : '0';
    // Вгадай число
    let guessRatings = JSON.parse(localStorage.getItem('gamezone_guess-number_ratings')) || [];
    let guessTop = guessRatings.sort((a, b) => b.score - a.score)[0];
    document.getElementById('guess-top').textContent = guessTop ? guessTop.score : '0';
    
    let userGuessBest = guessRatings.filter(r => r.name === username).sort((a, b) => b.score - a.score)[0];
    document.getElementById('guess-user').textContent = userGuessBest ? userGuessBest.score : '0';
}

function saveGameResult(gameType, score) {
    const username = localStorage.getItem('gamezone_username') || "Гравець";
    let ratings = JSON.parse(localStorage.getItem(`gamezone_${gameType}_ratings`)) || [];
    
    ratings.push({
        name: username,
        score: score,
        date: new Date().toISOString()
    });
    
    localStorage.setItem(`gamezone_${gameType}_ratings`, JSON.stringify(ratings));
    
    // Оновлюємо статистику на сторінках
    if (document.querySelector('.leaderboard')) {
        loadLeaderboard(gameType);
        loadPersonalBests();
    }
    
    if (document.querySelector('.games-grid')) {
        loadGameStats();
    }
}