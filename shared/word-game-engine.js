/* =============================================
   BanglaKids — Word Game Engine
   mountWordGame(container, data, subtitle) → unmount()
   ============================================= */

function mountWordGame(container, data, subtitle) {
    let currentStep = 0;

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">✖</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator">${subtitle || ''}</div>
            <div id="gameContent" class="screen active"
                 style="justify-content: flex-start; padding-top: 20px; overflow-y: auto;"></div>
            <button class="btn-main" id="nextBtn" style="display: none;">Next ➜</button>
        </div>
    `;

    const nextBtn = container.querySelector('#nextBtn');

    function renderWord(word, highlightIndex) {
        let html = '';
        for (let i = 0; i < word.length; i++) {
            html += i === highlightIndex
                ? `<span class="highlight">${word[i]}</span>`
                : word[i];
        }
        return html;
    }

    function playSound(text) {
        Voice.english(text);
    }

    function renderStep() {
        const step = data[currentStep];
        const content = container.querySelector('#gameContent');
        const progressPercent = (currentStep / (data.length - 1)) * 100;
        container.querySelector('#progressFill').style.width = progressPercent + '%';

        if (step.type === 'learn') {
            nextBtn.style.display = 'block';
            nextBtn.onclick = nextStep;
            content.innerHTML = `
                <div class="big-letter" style="font-size: 6rem; margin-bottom: 10px;">${step.letter}</div>
                <div class="words-grid">
                    ${step.words.map(w => `
                        <div class="mini-word-card">
                            <div class="mini-emoji">${w.emoji}</div>
                            <div class="mini-word-text">${renderWord(w.word, w.hi)}</div>
                            <div class="mini-sub-text">${w.meaning}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            content.querySelector('.big-letter').addEventListener('click', () => playSound(step.sound));
            playSound(step.sound);

        } else if (step.type === 'quiz') {
            nextBtn.style.display = 'none';
            content.innerHTML = `
                <div class="quiz-header">Find the starting letter!</div>
                <div class="mini-emoji" style="font-size: 6rem;">${step.emoji}</div>
                <div class="mini-word-text" style="font-size: 2rem; margin-bottom: 10px;">${step.meaning}</div>
                <div class="quiz-options">
                    ${step.options.map(opt => `
                        <div class="quiz-option" data-opt="${opt}">${opt}</div>
                    `).join('')}
                </div>
            `;
            content.querySelectorAll('.quiz-option').forEach(el => {
                el.addEventListener('click', () => checkAnswer(el, el.dataset.opt, step.answer));
            });

        } else if (step.type === 'reward') {
            nextBtn.innerText = 'Back to Home ➜';
            nextBtn.style.display = 'block';
            nextBtn.onclick = () => { location.hash = '#home'; };
            content.innerHTML = `
                <div class="star-container" style="margin-top: 50px;">
                    <span class="star">⭐</span>
                    <span class="star">⭐</span>
                    <span class="star">⭐</span>
                </div>
                <div class="reward-text">Great Job!</div>
                <div class="sub-text">${step.message || 'You mastered these letters!'}</div>
            `;
            createConfetti(container.querySelector('#gameBox'));
            Voice.confetti();
        }
    }

    function checkAnswer(element, selected, correct) {
        if (selected === correct) {
            element.classList.add('correct');
            Voice.correct();
            setTimeout(() => nextStep(), 1200);
        } else {
            element.classList.add('wrong');
            playSound('Oops');
            setTimeout(() => element.classList.remove('wrong'), 800);
        }
    }

    function nextStep() {
        if (currentStep < data.length - 1) {
            currentStep++;
            renderStep();
        }
    }

    renderStep();

    return function unmount() {
        container.innerHTML = '';
    };
}
