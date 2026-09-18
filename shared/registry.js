/* =============================================
   BanglaKids — Game Registry
   Add one entry here + one data file to add a new game.
   ============================================= */

const REGISTRY = [
    {
        id: 'vowels',
        title: 'স্বরবর্ণ',
        titleEn: 'Vowels',
        engine: 'letter',
        dataVar: 'VOWELS',
        letter: 'অ',
        badge: '11 Letters',
        colorClass: 'vowels',
        layout: 'full',
        subtitle: 'Vowels'
    },
    {
        id: 'consonants',
        title: 'ব্যঞ্জনবর্ণ',
        titleEn: 'Consonants',
        engine: 'letter',
        dataVar: 'CONSONANTS',
        letter: 'ক',
        badge: '30 Letters',
        colorClass: 'consonants',
        layout: 'full',
        subtitle: 'Consonants'
    },
    {
        id: 'group-1',
        title: 'শব্দ ১',
        titleEn: 'Group 1 Words',
        engine: 'word',
        dataVar: 'GROUP1',
        letter: 'ক-ঙ',
        badge: '15 Words',
        colorClass: 'words',
        layout: 'half',
        subtitle: 'Group 1: ক, খ, গ, ঘ, ঙ'
    },
    {
        id: 'group-2',
        title: 'শব্দ ২',
        titleEn: 'Group 2 Words',
        engine: 'word',
        dataVar: 'GROUP2',
        letter: 'চ-ঞ',
        badge: '15 Words',
        colorClass: 'words2',
        layout: 'half',
        subtitle: 'Group 2: চ, ছ, জ, ঝ, ঞ'
    },
    {
        id: 'group-3',
        title: 'শব্দ ৩',
        titleEn: 'Group 3 Words',
        engine: 'word',
        dataVar: 'GROUP3',
        letter: 'ট-ণ',
        badge: '15 Words',
        colorClass: 'words3',
        layout: 'half',
        subtitle: 'Group 3: ট, ঠ, ড, ঢ, ণ'
    },
    {
        id: 'group-4',
        title: 'শব্দ ৪',
        titleEn: 'Group 4 Words',
        engine: 'word',
        dataVar: 'GROUP4',
        letter: 'ত-ন',
        badge: '15 Words',
        colorClass: 'words4',
        layout: 'half',
        subtitle: 'Group 4: ত, থ, দ, ধ, ন'
    },
    {
        id: 'group-5',
        title: 'শব্দ ৫',
        titleEn: 'Group 5 Words',
        engine: 'word',
        dataVar: 'GROUP5',
        letter: 'প-ম',
        badge: '15 Words',
        colorClass: 'words5',
        layout: 'half',
        subtitle: 'Group 5: প, ফ, ব, ভ, ম'
    },
    {
        id: 'group-6',
        title: 'শব্দ ৬',
        titleEn: 'Group 6 Words',
        engine: 'word',
        dataVar: 'GROUP6',
        letter: 'য-হ',
        badge: '21 Words',
        colorClass: 'words6',
        layout: 'half',
        subtitle: 'Group 6: য, র, ল, শ, ষ, স, হ'
    },
    {
        id: 'daily-words',
        title: 'দৈনন্দিন শব্দ',
        titleEn: 'Daily Words',
        engine: 'daily',
        dataVar: 'DAILY_WORDS',
        letter: '💧',
        badge: '10 Words + 2 Quizzes',
        colorClass: 'daily',
        layout: 'full',
        subtitle: 'Daily Words'
    },
    {
        id: 'story-monkey-emoji',
        title: 'কৌতূহলী বানর',
        titleEn: 'Curious Monkey (Emoji)',
        engine: 'story',
        dataVar: 'STORY_MONKEY_EMOJI',
        letter: '🐒',
        badge: '9 Pages',
        colorClass: 'story',
        layout: 'half',
        subtitle: 'Story: The Curious Monkey'
    },
    {
        id: 'story-monkey-photo',
        title: 'কৌতূহলী বানর',
        titleEn: 'Curious Monkey (Photo)',
        engine: 'story',
        dataVar: 'STORY_MONKEY_PHOTO',
        letter: '📖',
        badge: '9 Pages',
        colorClass: 'story2',
        layout: 'half',
        subtitle: 'Story: The Curious Monkey'
    },
    {
        id: 'daily-words-2',
        title: 'শব্দ মেলাও',
        titleEn: 'Match the Words',
        engine: 'match',
        dataVar: 'DAILY_WORDS_2',
        letter: '🔗',
        badge: '10 Words · Match Game',
        colorClass: 'match',
        layout: 'full',
        subtitle: 'Match the Words'
    },
    {
        id: 'daily-words-3',
        title: 'প্রাণীর নাম',
        titleEn: 'Animal Names',
        engine: 'word-quiz',
        dataVar: 'DAILY_WORDS_3',
        letter: '🐯',
        badge: '10 Words · Quiz',
        colorClass: 'word-quiz',
        layout: 'full',
        subtitle: 'Animal Names'
    },
    {
        id: 'daily-words-4',
        title: 'শরীরের অঙ্গ',
        titleEn: 'Body Parts',
        engine: 'word-quiz',
        dataVar: 'DAILY_WORDS_4',
        letter: '✋',
        badge: '10 Words · Quiz',
        colorClass: 'word-quiz-2',
        layout: 'full',
        subtitle: 'Body Parts'
    },
    {
        id: 'printables',
        title: 'মুদ্রণযোগ্য',
        titleEn: 'Printables',
        engine: 'printables',
        dataVar: 'PRINTABLES',
        letter: '🖨️',
        badge: '10 Cards',
        colorClass: 'printables',
        layout: 'full',
        subtitle: 'Printable Cards'
    },
];

/* Shared confetti utility used by both game engines */
function createConfetti(container) {
    const colors = ['#ff6b6b', '#4ecdc4', '#fbc02d', '#45b7d1'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}
