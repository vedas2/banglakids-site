/* =============================================
   BanglaKids — Story Engine
   mountStoryGame(container, data, subtitle) → unmount()

   Each page provides either an `emoji` (+ optional `bg` gradient)
   or a `color` (gradient standing in for a future real photo) —
   the engine renders whichever the page supplies.
   ============================================= */

function mountStoryGame(container, data, subtitle) {
    const pages = data.pages;
    let currentPage = 0;

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">✖</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator">${subtitle || data.title || ''}</div>
            <div id="gameContent" class="screen active" style="padding: 0;"></div>
            <div class="story-nav" id="storyNav">
                <button class="btn-secondary" id="prevBtn" style="display:none;">◀ Back</button>
                <button class="btn-main" id="nextBtn" style="margin: 0; width: auto; flex: 1;">Next ➜</button>
            </div>
        </div>
        <style>
            .story-nav { display: flex; gap: 10px; padding: 0 18px 20px; align-items: center; }
            .story-page { display: flex; flex-direction: column; width: 100%; height: 100%; }
            .story-visual {
                position: relative;
                flex: 1;
                min-height: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 5.5rem;
                cursor: pointer;
            }
            .story-photo-note {
                position: absolute;
                bottom: 10px;
                right: 14px;
                font-size: 0.7rem;
                font-style: italic;
                color: rgba(255,255,255,0.75);
            }
            .story-text-box {
                background: white;
                padding: 16px 20px 20px;
                text-align: center;
                cursor: pointer;
            }
            .story-bangla { font-size: 1.6rem; font-weight: bold; color: #333; line-height: 1.3; }
            .story-translit { font-size: 1rem; color: #888; margin-top: 4px; }
            .story-english { font-size: 0.95rem; color: #aaa; margin-top: 6px; }
        </style>
    `;

    const content = container.querySelector('#gameContent');
    const gameBox = container.querySelector('#gameBox');
    const nextBtn = container.querySelector('#nextBtn');
    const prevBtn = container.querySelector('#prevBtn');

    function renderVisual(page) {
        if (page.color) {
            return `
                <div class="story-visual" style="background:${page.color};">
                    <span class="story-photo-note">photo coming soon</span>
                </div>`;
        }
        return `
            <div class="story-visual" style="background:${page.bg || 'linear-gradient(160deg, #e0f7fa, #b2ebf2)'};">
                ${page.emoji || ''}
            </div>`;
    }

    function playPage(page) {
        Voice.playBanglaText(page.bangla, page.translit);
    }

    function renderPage() {
        const page = pages[currentPage];
        container.querySelector('#progressFill').style.width = (currentPage / pages.length) * 100 + '%';

        content.innerHTML = `
            <div class="story-page">
                ${renderVisual(page)}
                <div class="story-text-box">
                    <div class="story-bangla">${page.bangla}</div>
                    <div class="story-translit">(${page.translit})</div>
                    <div class="story-english">${page.english}</div>
                </div>
            </div>
        `;
        content.querySelector('.story-visual').addEventListener('click', () => playPage(page));
        content.querySelector('.story-text-box').addEventListener('click', () => playPage(page));
        playPage(page);

        prevBtn.style.display = currentPage > 0 ? 'inline-block' : 'none';
        nextBtn.innerText = currentPage === pages.length - 1 ? 'The End ⭐' : 'Next ➜';
    }

    function showReward() {
        container.querySelector('#progressFill').style.width = '100%';
        container.querySelector('#storyNav').style.display = 'none';
        content.innerHTML = `
            <div class="star-container" style="margin-top: 40px;">
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
            </div>
            <div class="reward-text">শাবাশ!</div>
            <div class="sub-text">${data.title ? `You finished "${data.title}"!` : 'You finished the story!'}</div>
            <button class="btn-main" id="homeBtn">Back to Home ➜</button>
        `;
        content.querySelector('#homeBtn').addEventListener('click', () => { location.hash = '#home'; });
        createConfetti(gameBox);
        Voice.confetti();
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            renderPage();
        } else {
            showReward();
        }
    });
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage();
        }
    });

    renderPage();

    return function unmount() {
        container.innerHTML = '';
    };
}
