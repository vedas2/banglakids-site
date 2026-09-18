/* =============================================
   BanglaKids — Voice Module
   Tier 1: Pre-generated MP3s via Sarvam AI (filled in Round 2)
   Tier 2: Web Speech API fallback if MP3 unavailable

   Methods:
   - Voice.playLetter(letter)    — play audio/letters/{letter}.mp3
   - Voice.playWord(word)         — play audio/words/{word}.mp3
   - Voice.playIntro(groupId)     — play intro/cheer sequence (EN then BN)
   - Voice.playCheer()            — play random cheer sound
   - Voice.correct()              — sound effect (already synthesized)
   - Voice.confetti()             — sound effect (already synthesized)
   ============================================= */

const Voice = (() => {
    let voices = [];
    let loaded = false;
    let currentAudio = null;

    function loadVoices() {
        voices = window.speechSynthesis.getVoices();
        loaded = true;
    }

    if ('speechSynthesis' in window) {
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

        window.speechSynthesis.cancel();

        setTimeout(() => {
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.8;
            msg.lang = lang;
            const v = findVoice(lang.split('-')[0]);
            if (v) msg.voice = v;
            window.speechSynthesis.speak(msg);
        }, 50);
    }

    function playAudio(url, onEnded) {
        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = new Audio(url);
        if (onEnded) currentAudio.addEventListener('ended', onEnded, { once: true });
        currentAudio.play().catch(err => {
            console.warn(`Audio playback failed for ${url}:`, err);
        });
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
        /**
         * Play audio for a single letter.
         * Tries: audio/letters/{letter}.mp3 → falls back to Web Speech (Bangla text)
         */
        playLetter(letter) {
            const mp3 = `audio/letters/${encodeURIComponent(letter)}.mp3`;
            fetch(mp3, { method: 'HEAD' })
                .then(r => {
                    if (r.ok) playAudio(mp3);
                    else speak(letter, 'bn'); // Fallback to Bangla TTS
                })
                .catch(() => speak(letter, 'bn'));
        },

        /**
         * Play audio for a word.
         * Tries: audio/words/{word}.mp3 → falls back to Web Speech (Bangla text)
         */
        playWord(word) {
            const mp3 = `audio/words/${encodeURIComponent(word)}.mp3`;
            fetch(mp3, { method: 'HEAD' })
                .then(r => {
                    if (r.ok) playAudio(mp3);
                    else speak(word, 'bn');
                })
                .catch(() => speak(word, 'bn'));
        },

        /**
         * Play group intro sequence.
         * Format: audio/intros/{groupId}-en.mp3, then {groupId}-bn.mp3
         * Falls back to Web Speech if files missing.
         *
         * groupIntros should be defined in game data; structured as:
         * { en: "Let's learn...", bn: "আসো..." }
         */
        playIntro(groupId, groupIntros) {
            if (!groupIntros) return;

            const enMp3 = `audio/intros/${groupId}-en.mp3`;
            const bnMp3 = `audio/intros/${groupId}-bn.mp3`;

            // Try EN MP3 first
            fetch(enMp3, { method: 'HEAD' })
                .then(r => {
                    if (r.ok) {
                        playAudio(enMp3, () => {
                            // When EN finishes, play BN
                            fetch(bnMp3, { method: 'HEAD' })
                                .then(r2 => {
                                    if (r2.ok) playAudio(bnMp3);
                                    else if (groupIntros.bn) speak(groupIntros.bn, 'bn');
                                })
                                .catch(() => {
                                    if (groupIntros.bn) speak(groupIntros.bn, 'bn');
                                });
                        });
                    } else {
                        // EN MP3 missing, fall back to Web Speech
                        if (groupIntros.en) speak(groupIntros.en, 'en-US');
                    }
                })
                .catch(() => {
                    if (groupIntros.en) speak(groupIntros.en, 'en-US');
                });
        },

        /**
         * Play a random cheer sound.
         * Tries: audio/cheers/cheer{1-5}.mp3
         * Falls back to Web Speech with stored cheer text.
         */
        playCheer(cheerTexts = []) {
            const cheer = Math.floor(Math.random() * 5) + 1;
            const mp3 = `audio/cheers/cheer${cheer}.mp3`;

            fetch(mp3, { method: 'HEAD' })
                .then(r => {
                    if (r.ok) playAudio(mp3);
                    else if (cheerTexts.length > 0) {
                        const text = cheerTexts[Math.floor(Math.random() * cheerTexts.length)];
                        speak(text, 'en-US');
                    }
                })
                .catch(() => {
                    if (cheerTexts.length > 0) {
                        const text = cheerTexts[Math.floor(Math.random() * cheerTexts.length)];
                        speak(text, 'en-US');
                    }
                });
        },

        /**
         * Play arbitrary Bangla text (for stories, dynamic content).
         * Falls back to translit if no Bangla voice available.
         */
        playBanglaText(banglaText, translit) {
            const bnVoice = findVoice('bn');
            if (bnVoice) {
                speak(banglaText, bnVoice.lang);
            } else if (translit) {
                speak(translit, 'en-US');
            }
        },

        correct,
        confetti
    };
})();
