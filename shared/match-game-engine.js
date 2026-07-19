/* =============================================
   BanglaKids — Match Game Engine
   mountMatchGame(container, words, subtitle) → unmount()
   Tap a Bangla word, then tap its English match to draw a connecting line.
   ============================================= */

function mountMatchGame(container, words, subtitle) {
    // Two rounds of 5 words each
    const rounds = [words.slice(0, 5), words.slice(5, 10)];
    let roundIdx    = 0;
    let selLeft     = null;   // currently selected left index (or null)
    let matchCount  = 0;      // correct matches in current round
    let matchedLeft = new Set();
    let matchedRight = new Set();
    let shuffled    = [];     // shuffled right-side items for current round

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">✖</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator">${subtitle || 'Match the Words'}</div>
            <div id="gameContent" class="screen active"
                 style="justify-content:flex-start; padding: 12px 10px; overflow:hidden;"></div>
            <button class="btn-main" id="nextBtn" style="display:none;">Next ➜</button>
        </div>
        <style>
            .match-area {
                position: relative;
                display: flex;
                gap: 0;
                width: 100%;
                align-items: stretch;
            }
            .match-col {
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex: 1;
            }
            .match-col-left  { padding-right: 28px; }
            .match-col-right { padding-left: 28px; }
            .match-svg {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                pointer-events: none;
                overflow: visible;
            }
            .match-item {
                border-radius: 12px;
                padding: 8px 6px;
                cursor: pointer;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 56px;
                transition: transform 0.12s, box-shadow 0.12s, background 0.2s, border-color 0.2s;
                user-select: none;
            }
            .match-item:active { transform: scale(0.95); }
            .match-item-left {
                background: #f1f8e9;
                border: 2.5px solid #43a047;
            }
            .match-item-right {
                background: #e0f7fa;
                border: 2.5px solid #4ecdc4;
                font-size: 1rem;
                font-weight: bold;
                color: #00796b;
            }
            .match-item.selected {
                background: #fff3e0;
                border-color: #ff9800;
                box-shadow: 0 0 0 3px rgba(255,152,0,0.25);
                transform: scale(1.04);
            }
            .match-item.matched-ok {
                background: #e8f5e9;
                border-color: #4CAF50;
                opacity: 0.7;
                pointer-events: none;
            }
            .match-item.wrong-flash {
                background: #ffebee;
                border-color: #F44336;
            }
            .match-emoji-lg  { font-size: 1.8rem; line-height: 1; }
            .match-bangla    { font-size: 1.1rem; font-weight: bold; color: #2e7d32; }
            .match-translit  { font-size: 0.7rem; color: #888; }
            .round-complete-overlay {
                position: absolute; inset: 0;
                background: rgba(255,255,255,0.92);
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                border-radius: 16px;
                animation: fadeIn 0.2s ease-out;
                z-index: 10;
            }
            .round-complete-overlay .tick { font-size: 3.5rem; }
            .round-complete-overlay .msg  { font-size: 1.4rem; font-weight: bold; color: #43a047; margin-top: 8px; }
            @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        </style>
    `;

    const nextBtn = container.querySelector('#nextBtn');

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function updateProgress() {
        const total = rounds.length + 1; // rounds + reward
        const pct = (roundIdx / total) * 100;
        container.querySelector('#progressFill').style.width = pct + '%';
    }

    function startRound(idx) {
        roundIdx   = idx;
        selLeft    = null;
        matchCount = 0;
        matchedLeft.clear();
        matchedRight.clear();

        const round = rounds[idx];
        shuffled = shuffle(round.map((w, i) => ({ ...w, origIdx: i })));

        container.querySelector('#levelIndicator').textContent =
            `Match the Words — Round ${idx + 1} of ${rounds.length}`;
        updateProgress();
        nextBtn.style.display = 'none';

        const content = container.querySelector('#gameContent');
        content.innerHTML = `
            <div class="match-area" id="matchArea">
                <svg class="match-svg" id="matchSvg"></svg>
                <div class="match-col match-col-left" id="matchLeft">
                    ${round.map((w, i) => `
                        <div class="match-item match-item-left" data-li="${i}">
                            <span class="match-emoji-lg">${w.emoji}</span>
                            <span class="match-bangla">${w.bangla}</span>
                            <span class="match-translit">(${w.translit})</span>
                        </div>
                    `).join('')}
                </div>
                <div class="match-col match-col-right" id="matchRight">
                    ${shuffled.map((w, i) => `
                        <div class="match-item match-item-right" data-ri="${i}" data-orig="${w.origIdx}">
                            ${w.english}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Size SVG to match area
        const area = content.querySelector('#matchArea');
        const svg  = content.querySelector('#matchSvg');
        requestAnimationFrame(() => {
            svg.setAttribute('viewBox', `0 0 ${area.offsetWidth} ${area.offsetHeight}`);
        });

        content.querySelectorAll('.match-item-left').forEach(el =>
            el.addEventListener('click', onLeftClick));
        content.querySelectorAll('.match-item-right').forEach(el =>
            el.addEventListener('click', onRightClick));
    }

    function onLeftClick(e) {
        const el  = e.currentTarget;
        const idx = +el.dataset.li;
        if (matchedLeft.has(idx)) return;

        container.querySelectorAll('.match-item-left').forEach(e => e.classList.remove('selected'));
        selLeft = idx;
        el.classList.add('selected');
        Voice.bangla(rounds[roundIdx][idx].bangla, rounds[roundIdx][idx].translit);
    }

    function onRightClick(e) {
        if (selLeft === null) return;
        const el      = e.currentTarget;
        const ri      = +el.dataset.ri;
        const origIdx = +el.dataset.orig;
        if (matchedRight.has(ri)) return;

        if (origIdx === selLeft) {
            // Correct match
            const leftEl = container.querySelector(`.match-item-left[data-li="${selLeft}"]`);
            leftEl.classList.remove('selected');
            leftEl.classList.add('matched-ok');
            el.classList.add('matched-ok');
            matchedLeft.add(selLeft);
            matchedRight.add(ri);
            drawLine(leftEl, el);
            Voice.correct();
            selLeft = null;
            matchCount++;
            if (matchCount === rounds[roundIdx].length) {
                setTimeout(onRoundComplete, 700);
            }
        } else {
            // Wrong
            el.classList.add('wrong-flash');
            const leftEl = container.querySelector(`.match-item-left[data-li="${selLeft}"]`);
            leftEl.classList.add('wrong-flash');
            Voice.english('Oops');
            setTimeout(() => {
                el.classList.remove('wrong-flash');
                leftEl.classList.remove('wrong-flash');
            }, 500);
        }
    }

    function drawLine(leftEl, rightEl) {
        const svg     = container.querySelector('#matchSvg');
        const svgRect = svg.getBoundingClientRect();
        const lRect   = leftEl.getBoundingClientRect();
        const rRect   = rightEl.getBoundingClientRect();

        const x1 = lRect.right  - svgRect.left;
        const y1 = lRect.top    + lRect.height  / 2 - svgRect.top;
        const x2 = rRect.left   - svgRect.left;
        const y2 = rRect.top    + rRect.height  / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#4CAF50');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0.7');
        svg.appendChild(line);
    }

    function onRoundComplete() {
        Voice.confetti();
        const area = container.querySelector('#matchArea');
        const overlay = document.createElement('div');
        overlay.className = 'round-complete-overlay';
        overlay.innerHTML = `<div class="tick">✅</div><div class="msg">Round ${roundIdx + 1} done!</div>`;
        area.appendChild(overlay);

        setTimeout(() => {
            if (roundIdx + 1 < rounds.length) {
                startRound(roundIdx + 1);
            } else {
                showReward();
            }
        }, 1200);
    }

    function showReward() {
        container.querySelector('#progressFill').style.width = '100%';
        container.querySelector('#levelIndicator').textContent = 'Finished!';
        nextBtn.innerText = 'Back to Home ➜';
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => { location.hash = '#home'; };

        const content = container.querySelector('#gameContent');
        content.innerHTML = `
            <div class="star-container" style="margin-top:40px;">
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
            </div>
            <div class="reward-text">শাবাশ!</div>
            <div class="sub-text">You matched all the words! 🎉</div>
        `;
        createConfetti(container.querySelector('#gameBox'));
        Voice.confetti();
    }

    startRound(0);

    return function unmount() { container.innerHTML = ''; };
}
