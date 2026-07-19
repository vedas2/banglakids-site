/* =============================================
   BanglaKids — Daily Word Engine
   mountDailyWordsGame(container, data, subtitle) → unmount()
   ============================================= */

function mountDailyWordsGame(container, data, subtitle) {
    const { words, quiz } = data;

    // Build steps: 2 learn pages + quiz questions + reward
    const steps = [
        { type: 'learn', slice: [0, 5] },
        { type: 'learn', slice: [5, 10] },
        ...quiz.map(q => ({ type: q.round === 1 ? 'quiz' : 'hard-quiz', idx: q.idx, options: q.options })),
        { type: 'reward' }
    ];

    let currentStep = 0;

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">✖</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator">${subtitle || 'Daily Words'}</div>
            <div id="gameContent" class="screen active"
                 style="justify-content: flex-start; padding-top: 10px; overflow-y: auto;"></div>
            <button class="btn-main" id="nextBtn" style="display:none;">Next ➜</button>
        </div>
        <style>
            .daily-card { background: #f1f8e9; border-bottom: 4px solid #43a047; }
            .daily-card .mini-word-text { color: #2e7d32; font-size: 1.4rem; }
            .daily-card .mini-word-text .translit { font-size: 0.85rem; color: #888; font-weight: normal; }
            .word-quiz-option {
                font-size: 1.2rem; padding: 12px 16px; background: #f1f8e9;
                border-radius: 15px; border: 3px solid #43a047; cursor: pointer;
                transition: transform 0.2s, background 0.2s;
                width: 45%; color: #2e7d32; font-weight: bold;
            }
            .word-quiz-option:active { transform: scale(0.9); }
            .word-quiz-option.correct { background: #4CAF50; color: white; border-color: #388E3C; }
            .word-quiz-option.wrong   { background: #F44336; color: white; border-color: #D32F2F; }
            .hard-quiz-word {
                font-size: 4.5rem; font-weight: bold; color: #1b5e20;
                margin: 30px 0 6px; line-height: 1.1;
            }
            .hard-quiz-word .translit { font-size: 1.2rem; color: #888; font-weight: normal; }
        </style>
    `;

    const nextBtn = container.querySelector('#nextBtn');
    nextBtn.addEventListener('click', nextStep);

    function playBangla(w) { Voice.bangla(w.bangla, w.translit); }
    function playEnglish(text) { Voice.english(text); }

    function renderStep() {
        const step    = steps[currentStep];
        const content = container.querySelector('#gameContent');
        const pct     = (currentStep / (steps.length - 1)) * 100;
        container.querySelector('#progressFill').style.width = pct + '%';

        if (step.type === 'learn') {
            const group = words.slice(step.slice[0], step.slice[1]);
            const label = step.slice[0] === 0 ? 'Words 1–5' : 'Words 6–10';
            container.querySelector('#levelIndicator').textContent = 'Daily Words — ' + label;
            nextBtn.style.display = 'block';
            nextBtn.innerText = 'Next ➜';
            nextBtn.onclick = nextStep;
            content.innerHTML = `
                <div style="font-size:0.8rem;color:#43a047;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Tap a card to hear it!</div>
                <div class="words-grid">
                    ${group.map((w, i) => `
                        <div class="mini-word-card daily-card" data-idx="${step.slice[0] + i}">
                            <div class="mini-emoji">${w.emoji}</div>
                            <div class="mini-word-text">${w.bangla} <span class="translit">(${w.translit})</span></div>
                            <div class="mini-sub-text">${w.english}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            content.querySelectorAll('.mini-word-card').forEach(card => {
                card.addEventListener('click', () => playBangla(words[+card.dataset.idx]));
            });

        } else if (step.type === 'quiz') {
            const w = words[step.idx];
            container.querySelector('#levelIndicator').textContent = 'Quiz — এর মানে কী?';
            nextBtn.style.display = 'none';
            content.innerHTML = `
                <div class="quiz-header">What does this mean?</div>
                <div style="font-size:4.5rem; line-height:1;">${w.emoji}</div>
                <div style="font-size:3.5rem; font-weight:bold; color:#2e7d32; margin:10px 0 4px;">
                    ${w.bangla} <span style="font-size:1rem; color:#888; font-weight:normal;">(${w.translit})</span>
                </div>
                <div class="quiz-options">
                    ${step.options.map(opt => `
                        <div class="word-quiz-option" data-opt="${opt}" data-ans="${w.english}">${opt}</div>
                    `).join('')}
                </div>
            `;
            content.querySelectorAll('.word-quiz-option').forEach(el => {
                el.addEventListener('click', () => checkAnswer(el, el.dataset.opt, el.dataset.ans));
            });
            playBangla(w);

        } else if (step.type === 'hard-quiz') {
            const w = words[step.idx];
            container.querySelector('#levelIndicator').textContent = 'Quiz — এর মানে কী?';
            nextBtn.style.display = 'none';
            content.innerHTML = `
                <div class="quiz-header">What does this mean?</div>
                <div class="hard-quiz-word">
                    ${w.bangla} <span class="translit">(${w.translit})</span>
                </div>
                <div class="quiz-options">
                    ${step.options.map(opt => `
                        <div class="word-quiz-option" data-opt="${opt}" data-ans="${w.english}">${opt}</div>
                    `).join('')}
                </div>
            `;
            content.querySelectorAll('.word-quiz-option').forEach(el => {
                el.addEventListener('click', () => checkAnswer(el, el.dataset.opt, el.dataset.ans));
            });
            playBangla(w);

        } else if (step.type === 'reward') {
            container.querySelector('#levelIndicator').textContent = 'Finished!';
            nextBtn.innerText = 'Back to Home ➜';
            nextBtn.style.display = 'block';
            nextBtn.onclick = () => { location.hash = '#home'; };
            content.innerHTML = `
                <div class="star-container" style="margin-top:40px;">
                    <span class="star">⭐</span>
                    <span class="star">⭐</span>
                    <span class="star">⭐</span>
                </div>
                <div class="reward-text">শাবাশ!</div>
                <div class="sub-text">You completed both quiz rounds! 🎉</div>
            `;
            createConfetti(container.querySelector('#gameBox'));
            Voice.confetti();
        }
    }

    function checkAnswer(el, selected, correct) {
        if (selected === correct) {
            el.classList.add('correct');
            Voice.correct();
            setTimeout(nextStep, 1200);
        } else {
            el.classList.add('wrong');
            playEnglish('Oops');
            setTimeout(() => el.classList.remove('wrong'), 800);
        }
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        }
    }

    renderStep();

    return function unmount() {
        container.innerHTML = '';
    };
}
