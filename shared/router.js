/* =============================================
   BanglaKids — Router
   Hash-based: #home, #game/<id>
   ============================================= */

let currentUnmount = null;

function navigate(hash) {
    if (currentUnmount) {
        currentUnmount();
        currentUnmount = null;
    }

    const app = document.getElementById('app');

    if (hash.startsWith('#game/')) {
        const gameId = hash.slice(6);
        const game = REGISTRY.find(g => g.id === gameId);
        if (game) {
            const data = window[game.dataVar];
            if (game.engine === 'letter') {
                currentUnmount = mountLetterGame(app, data);
            } else if (game.engine === 'daily') {
                currentUnmount = mountDailyWordsGame(app, data, game.subtitle);
            } else if (game.engine === 'match') {
                currentUnmount = mountMatchGame(app, data, game.subtitle);
            } else if (game.engine === 'word-quiz') {
                currentUnmount = mountWordQuizGame(app, data, game.subtitle);
            } else {
                currentUnmount = mountWordGame(app, data, game.subtitle);
            }
            return;
        }
    }

    currentUnmount = renderHome(app);
}

function renderHome(container) {
    const fullCards = REGISTRY.filter(g => g.layout === 'full');
    const halfCards = REGISTRY.filter(g => g.layout === 'half');

    const rows = [];
    for (let i = 0; i < halfCards.length; i += 2) {
        rows.push(halfCards.slice(i, i + 2));
    }

    function cardHTML(game) {
        return `
            <a href="#game/${game.id}" class="game-card ${game.colorClass}">
                <div class="card-letter">${game.letter}</div>
                <div class="card-info">
                    <div class="card-title">${game.title}</div>
                    <div class="card-title-en">${game.titleEn}</div>
                    <div class="card-badge">${game.badge}</div>
                </div>
                <div class="card-arrow">➜</div>
            </a>
        `;
    }

    container.innerHTML = `
        <div class="home-container">
            <div class="app-header">
                <div class="app-logo">📚</div>
                <div class="app-title">বাংলাকিডস</div>
                <div class="app-subtitle">Learn Bangla Alphabets — Pick a module!</div>
            </div>
            <div class="cards-grid">
                ${fullCards.map(cardHTML).join('')}
                ${rows.map(row => `
                    <div class="row-grid">
                        ${row.map(cardHTML).join('')}
                    </div>
                `).join('')}
            </div>
            <div class="footer">Tap a card to start!</div>
        </div>
    `;

    return function unmount() {
        container.innerHTML = '';
    };
}

window.addEventListener('hashchange', () => navigate(location.hash));
document.addEventListener('DOMContentLoaded', () => navigate(location.hash || '#home'));
