/* =============================================
   BanglaKids — Voice
   Voice.bangla(text, translit) — Bangla script; falls back to translit if no bn voice
   Voice.english(text)          — English/romanized text
   ============================================= */

const Voice = (() => {
    let voices = [];
    let loaded = false;

    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
        loaded = true;
    }

    if ('speechSynthesis' in window) {
        // Chrome loads voices asynchronously; Firefox/Safari have them immediately
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        loadVoices();
    }

    function findVoice(langPrefix) {
        if (!loaded) loadVoices();
        return voices.find(v => v.lang.startsWith(langPrefix)) || null;
    }

    function speak(text, lang) {
        if (!('speechSynthesis' in window) || !text) return;
        if (!loaded) loadVoices();

        // Chrome bug: flush the queue or it gets stuck
        window.speechSynthesis.cancel();

        // Give cancel a tick to settle before queuing new speech
        setTimeout(() => {
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.8;
            msg.lang = lang;
            const v = findVoice(lang.split('-')[0]);
            if (v) msg.voice = v;
            window.speechSynthesis.speak(msg);
        }, 50);
    }

    function correct() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Quick two-note ding: G5 → C6
            [[784, 0], [1047, 0.15]].forEach(([freq, delay]) => {
                const osc  = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                const t = ctx.currentTime + delay;
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                osc.start(t);
                osc.stop(t + 0.3);
            });
        } catch (e) { /* AudioContext not available */ }
    }

    function confetti() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Ascending arpeggio: C5 E5 G5 C6
            [523, 659, 784, 1047].forEach((freq, i) => {
                const osc  = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                const t = ctx.currentTime + i * 0.1;
                gain.gain.setValueAtTime(0.28, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
                osc.start(t);
                osc.stop(t + 0.45);
            });
        } catch (e) { /* AudioContext not available */ }
    }

    return {
        bangla(banglaText, translit) {
            const bnVoice = findVoice('bn');
            if (bnVoice) {
                speak(banglaText, bnVoice.lang);
            } else if (translit) {
                // No Bengali voice installed — say the romanized pronunciation instead
                speak(translit, 'en-US');
            }
        },
        english(text) {
            speak(text, 'en-US');
        },
        correct,
        confetti
    };
})();
