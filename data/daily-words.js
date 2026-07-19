/* BanglaKids — Daily Words */
window.DAILY_WORDS = {
    words: [
        { bangla: "জল",    english: "Water",  translit: "Jol",    emoji: "💧" },
        { bangla: "খাবার", english: "Food",   translit: "Khabar", emoji: "🍛" },
        { bangla: "ঘুম",   english: "Sleep",  translit: "Ghum",   emoji: "😴" },
        { bangla: "বাড়ি",  english: "Home",   translit: "Bari",   emoji: "🏡" },
        { bangla: "মা",    english: "Mother", translit: "Ma",     emoji: "👩" },
        { bangla: "বাবা",  english: "Father", translit: "Baba",   emoji: "👨" },
        { bangla: "মাছ",   english: "Fish",   translit: "Maach",  emoji: "🐟" },
        { bangla: "বই",    english: "Book",   translit: "Boi",    emoji: "📚" },
        { bangla: "আলো",   english: "Light",  translit: "Alo",    emoji: "💡" },
        { bangla: "রাত",   english: "Night",  translit: "Raat",   emoji: "🌙" },
    ],
    quiz: [
        // Round 1 — with emoji
        { round: 1, idx: 0, options: ["Water", "Food",   "Sleep",  "Night"]  },
        { round: 1, idx: 2, options: ["Light", "Home",   "Sleep",  "Mother"] },
        { round: 1, idx: 4, options: ["Mother","Father", "Book",   "Fish"]   },
        { round: 1, idx: 7, options: ["Water", "Home",   "Book",   "Light"]  },
        { round: 1, idx: 9, options: ["Food",  "Fish",   "Night",  "Sleep"]  },
        // Round 2 — word only
        { round: 2, idx: 1, options: ["Water", "Food",   "Home",   "Night"]  },
        { round: 2, idx: 3, options: ["Book",  "Sleep",  "Home",   "Light"]  },
        { round: 2, idx: 5, options: ["Mother","Father", "Fish",   "Night"]  },
        { round: 2, idx: 6, options: ["Fish",  "Book",   "Water",  "Home"]   },
        { round: 2, idx: 8, options: ["Sleep", "Food",   "Light",  "Night"]  },
    ]
};
