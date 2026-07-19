/* =============================================
   BanglaKids — Letter Game Engine
   mountLetterGame(container, letters) → unmount()
   ============================================= */

function mountLetterGame(container, letters) {
    let currentLetterIndex = 0;
    let painting = false;

    container.innerHTML = `
        <div class="game-container" id="gameBox">
            <a href="#home" class="btn-back">←</a>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div class="level-indicator" id="levelIndicator"></div>

            <div class="screen" id="s1">
                <div style="color:#888; margin-bottom: 20px;">Tap to hear sound</div>
                <div class="big-letter bouncing" id="animLetter"></div>
                <button class="btn-main" id="btnLearnWord">Learn Word</button>
            </div>

            <div class="screen" id="s2">
                <div class="word-card">
                    <span class="emoji-img" id="wordEmoji"></span>
                    <div class="word-text" id="wordText"></div>
                    <div class="sub-text" id="wordMeaning"></div>
                </div>
                <button class="btn-main" id="btnLetsWrite">Let's Write!</button>
            </div>

            <div class="screen" id="s3">
                <div style="color:#666; margin-bottom: 10px;">Trace the Letter</div>
                <div class="canvas-wrapper">
                    <div class="trace-guide" id="traceLetter"></div>
                    <canvas id="traceCanvas" width="280" height="280"></canvas>
                </div>
                <button class="btn-secondary" id="btnErase">Erase</button>
                <button class="btn-main" id="btnDone" style="margin-top: 20px; background:#4CAF50;">Done!</button>
            </div>

            <div class="screen" id="sReward">
                <div class="star-container">
                    <span class="star">★</span>
                    <span class="star">★</span>
                    <span class="star">★</span>
                </div>
                <div class="reward-text">সাবাস!</div>
                <div style="color: #666; font-size: 1.2rem;">(Well Done!)</div>
                <button class="btn-main" id="nextLevelBtn">Next Letter ➜</button>
            </div>

            <div class="nav-dots" id="dotsNav">
                <div class="dot" id="d1"></div>
                <div class="dot" id="d2"></div>
                <div class="dot" id="d3"></div>
            </div>
        </div>
    `;

    /* --- Canvas setup --- */
    const canvas = container.querySelector('#traceCanvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#444';

    function startPosition(e) { painting = true; draw(e); }
    function finishedPosition() { painting = false; ctx.beginPath(); }
    function draw(e) {
        if (!painting) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', draw);

    /* --- Button wiring --- */
    container.querySelector('#animLetter').addEventListener('click', playSound);
    container.querySelector('#btnLearnWord').addEventListener('click', () => goToStep(2));
    container.querySelector('#btnLetsWrite').addEventListener('click', () => goToStep(3));
    container.querySelector('#btnErase').addEventListener('click', clearCanvas);
    container.querySelector('#btnDone').addEventListener('click', showReward);

    /* --- Game functions --- */
    function loadLetterData(index) {
        const data = letters[index];
        container.querySelector('#levelIndicator').innerText = `Level ${index + 1}: Letter ${data.char}`;
        container.querySelector('#animLetter').innerText = data.char;
        container.querySelector('#wordEmoji').innerText = data.emoji;

        let htmlWord = '';
        for (let i = 0; i < data.word.length; i++) {
            htmlWord += i === data.highlightIndex
                ? `<span class="highlight">${data.word[i]}</span>`
                : data.word[i];
        }
        container.querySelector('#wordText').innerHTML = htmlWord;
        container.querySelector('#wordMeaning').innerText = data.meaning;
        container.querySelector('#traceLetter').innerText = data.char;

        addStartingDot(data);
        updateProgress(0);
        container.querySelector('#dotsNav').style.display = 'flex';
    }

    function addStartingDot(data) {
        const existing = container.querySelector('#startingDot');
        if (existing) existing.remove();
        const dot = document.createElement('div');
        dot.id = 'startingDot';
        dot.style.cssText = `position:absolute; width:12px; height:12px; background:#4CAF50;
            border-radius:50%; z-index:10; pointer-events:none;
            top:${data.startDotTop}; left:${data.startDotLeft};`;
        container.querySelector('.canvas-wrapper').appendChild(dot);
    }

    function goToStep(stepNum) {
        container.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        container.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        container.querySelector('#s' + stepNum).classList.add('active');
        if (stepNum <= 3) container.querySelector('#d' + stepNum).classList.add('active');
        if (stepNum === 1) updateProgress(10);
        if (stepNum === 2) updateProgress(50);
        if (stepNum === 3) updateProgress(80);
    }

    function showReward() {
        container.querySelector('#dotsNav').style.display = 'none';
        container.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        container.querySelector('#sReward').classList.add('active');
        updateProgress(100);
        createConfetti(container.querySelector('#gameBox'));

        const btn = container.querySelector('#nextLevelBtn');
        if (currentLetterIndex < letters.length - 1) {
            btn.innerText = 'Next Letter ➜';
            btn.onclick = nextLetter;
        } else {
            btn.innerText = 'Restart ↺';
            btn.onclick = () => {
                currentLetterIndex = 0;
                clearCanvas();
                loadLetterData(0);
                goToStep(1);
            };
        }
    }

    function nextLetter() {
        currentLetterIndex++;
        clearCanvas();
        loadLetterData(currentLetterIndex);
        goToStep(1);
    }

    function updateProgress(percent) {
        container.querySelector('#progressFill').style.width = percent + '%';
    }

    function playSound() {
        const data = letters[currentLetterIndex];
        Voice.english(data.soundText);
        const el = container.querySelector('#animLetter');
        el.classList.remove('bouncing');
        void el.offsetWidth;
        el.classList.add('bouncing');
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        addStartingDot(letters[currentLetterIndex]);
    }

    /* --- Init --- */
    loadLetterData(0);
    goToStep(1);

    /* --- Unmount --- */
    return function unmount() {
        canvas.removeEventListener('mousedown', startPosition);
        canvas.removeEventListener('mouseup', finishedPosition);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('touchstart', startPosition);
        canvas.removeEventListener('touchend', finishedPosition);
        canvas.removeEventListener('touchmove', draw);
        container.innerHTML = '';
    };
}
