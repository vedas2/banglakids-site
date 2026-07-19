/* =============================================
   BanglaKids — Word Quiz Engine
   No picture hints; hint revealed after 3 wrong tries
   ============================================= */

function mountWordQuizGame(container, words, subtitle) {
    let currentIdx = 0;
    let failCount  = 0;
    let hintShown  = false;
    let answered   = false;

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">✖</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator">${subtitle || ''}</div>
            <div id="gameContent" class="screen active wq-screen"></div>
        </div>
    `;

    const gameBox      = document.getElementById('gameBox');
    const progressFill = document.getElementById('progressFill');
    const levelInd     = document.getElementById('levelIndicator');
    const gameContent  = document.getElementById('gameContent');

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function updateProgress() {
        progressFill.style.width = ((currentIdx / words.length) * 100) + '%';
        levelInd.textContent = 'Question ' + (currentIdx + 1) + ' of ' + words.length;
    }

    function renderQuestion() {
        failCount = 0;
        hintShown = false;
        answered  = false;

        updateProgress();

        const word    = words[currentIdx];
        const opts    = shuffle(word.options);

        gameContent.innerHTML = `
            <div class="wq-bangla">${word.bangla}</div>
            <div class="wq-translit">${word.translit}</div>
            <div class="wq-emoji-hint" id="emojiHint" style="display:none;">${word.emoji}</div>
            <div class="wq-options" id="optionsArea">
                ${opts.map(o => `<button class="wq-option" data-opt="${o}">${o}</button>`).join('')}
            </div>
            <button class="wq-hint-btn" id="hintBtn" style="display:none;">💡 Hint</button>
        `;

        gameContent.querySelectorAll('.wq-option').forEach(btn => {
            btn.addEventListener('click', () => onOptionClick(btn, word));
        });
        document.getElementById('hintBtn').addEventListener('click', onHintClick);

        Voice.bangla(word.bangla, word.translit);
    }

    function onOptionClick(btn, word) {
        if (answered) return;

        if (btn.dataset.opt === word.english) {
            answered = true;
            btn.classList.add('wq-correct');
            gameContent.querySelectorAll('.wq-option').forEach(b => {
                if (b !== btn) b.classList.add('wq-disabled');
            });
            Voice.correct();
            setTimeout(advance, 1200);
        } else {
            btn.classList.add('wq-wrong');
            Voice.english('Oops');
            failCount++;
            setTimeout(() => btn.classList.remove('wq-wrong'), 500);
            if (failCount >= 3 && !hintShown) {
                document.getElementById('hintBtn').style.display = 'block';
            }
        }
    }

    function onHintClick() {
        hintShown = true;
        document.getElementById('emojiHint').style.display = 'block';
        document.getElementById('hintBtn').style.display   = 'none';
    }

    function advance() {
        currentIdx++;
        if (currentIdx >= words.length) {
            showReward();
        } else {
            renderQuestion();
        }
    }

    function showReward() {
        progressFill.style.width = '100%';
        levelInd.textContent = 'Finished!';
        gameContent.innerHTML = `
            <div style="text-align:center; padding: 20px 0;">
                <div style="font-size:4rem; margin-bottom:12px;">⭐⭐⭐</div>
                <div style="font-size:2.2rem; font-weight:bold; color:#1b5e20; margin-bottom:8px;">শাবাশ!</div>
                <div style="font-size:1.1rem; color:#555; margin-bottom:32px;">You know all the animals!</div>
                <button class="btn-main" id="homeBtn">Back to Home</button>
            </div>
        `;
        document.getElementById('homeBtn').addEventListener('click', () => {
            location.hash = '#home';
        });
        createConfetti(gameBox);
        Voice.confetti();
    }

    renderQuestion();

    return function unmount() {
        container.innerHTML = '';
    };
}
