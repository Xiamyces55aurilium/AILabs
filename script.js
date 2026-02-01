// State Management
const state = {
    currentTab: 'home',
    streak: 3,
    userLevel: 'HSK 1',
    currentLessonId: null,
    lessonStep: 0,
};

// Data: Course Content
const lessons = [
    {
        id: 1,
        title: "Greetings & Basics",
        desc: "Learn to say Hello and introduce yourself.",
        color: "#FFB7C5",
        content: [
            {
                type: 'vocab',
                char: '你好',
                pinyin: 'Nǐ hǎo',
                meaning: 'Hello',
                audio: 'nihao',
                tips: "Literally 'You Good'. The most common greeting!"
            },
            {
                type: 'vocab',
                char: '我是',
                pinyin: 'Wǒ shì',
                meaning: 'I am',
                audio: 'woshi', 
                tips: "Use this to tell people your name."
            },
            {
                type: 'grammar',
                title: 'Subject + Verb',
                explanation: "Chinese grammar is often SVO (Subject + Verb + Object).",
                example: "我 (I) + 是 (am) + LingShī."
            },
            {
                type: 'quiz',
                question: "How do you say 'Hello'?",
                options: ['Nǐ hǎo', 'Wǒ shì', 'Zàijiàn'],
                correct: 0
            }
        ]
    },
    {
        id: 2,
        title: "Numbers 1-10",
        desc: "Count to ten in Mandarin.",
        color: "#B5EAD7",
        content: [] // Placeholder
    },
    {
        id: 3,
        title: "Family Members",
        desc: "Mom, Dad, and siblings.",
        color: "#C7CEEA",
        content: []
    }
];

// DOM Elements
const app = document.getElementById('app');
const contentArea = document.getElementById('content-area');
const navBtns = document.querySelectorAll('.nav-btn');

// Icons (Lucide)
lucide.createIcons();

// Navigation Logic
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update Active State
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        state.currentTab = tab;
        render();
    });
});

// Main Render Function
function render() {
    contentArea.innerHTML = ''; // Clear content
    
    if (state.currentLessonId) {
        renderActiveLesson();
        return;
    }

    switch(state.currentTab) {
        case 'home':
            renderHome();
            break;
        case 'learn':
            renderLearn();
            break;
        case 'practice':
            renderPlaceholder("Practice Space Coming Soon! ✍️");
            break;
        case 'profile':
            renderPlaceholder("Your Profile 🌸");
            break;
    }
    lucide.createIcons();
}

function renderPlaceholder(text) {
    contentArea.innerHTML = `
        <div style="text-align: center; padding: 4rem; color: var(--col-text-sub);">
            <i data-lucide="coffee" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--col-secondary);"></i>
            <h3>${text}</h3>
        </div>
    `;
}

// Views
function renderHome() {
    const heroHTML = `
        <div class="hero-card">
            <h3>Ready to continue, Ling? 🌸</h3>
            <p>You left off at <strong>Lesson 1: Greetings</strong>. Let's keep that streak alive!</p>
            <button class="start-btn" onclick="startLesson(1)">Continue Lesson</button>
            
            <div style="position: absolute; right: 2rem; bottom: -2rem; font-size: 8rem; opacity: 0.2; transform: rotate(-10deg);">
                你好
            </div>
        </div>

        <div class="section-title">Recommended for You</div>
        <div class="grid-container">
            ${lessons.map(lesson => `
                <div class="lesson-card" onclick="startLesson(${lesson.id})">
                    <div class="icon-ph" style="background-color: ${lesson.color}30; color: ${lesson.color};">
                        <i data-lucide="book-open"></i>
                    </div>
                    <h4>${lesson.title}</h4>
                    <p>${lesson.desc}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    contentArea.innerHTML = heroHTML;
}

function renderLearn() {
    contentArea.innerHTML = `
        <div class="section-title">Course Map: HSK 1</div>
        <div class="grid-container">
             ${lessons.map(lesson => `
                <div class="lesson-card" onclick="startLesson(${lesson.id})">
                    <div class="icon-ph" style="background-color: ${lesson.color}30; color: ${lesson.color};">
                        <i data-lucide="star"></i>
                    </div>
                    <h4>${lesson.title}</h4>
                    <p>${lesson.desc}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Lesson Logic
window.startLesson = (id) => {
    state.currentLessonId = id;
    state.lessonStep = 0;
    render();
}

function renderActiveLesson() {
    const lesson = lessons.find(l => l.id === state.currentLessonId);
    
    if (!lesson || state.lessonStep >= lesson.content.length) {
        // Lesson Complete Screen
        contentArea.innerHTML = `
            <div class="learning-screen" style="text-align: center; padding-top: 4rem;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="margin-bottom: 1rem;">Lesson Complete!</h2>
                <p>You're doing amazing! +50 XP</p>
                <button class="ctrl-btn primary" onclick="exitLesson()" style="margin-top: 2rem;">Back to Home</button>
            </div>
        `;
        return;
    }

    const stepData = lesson.content[state.lessonStep];
    
    let stepContent = '';
    
    // Header for Lesson
    const headerHtml = `
        <div style="margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
             <button onclick="exitLesson()" style="background:none; border:none; cursor:pointer;"><i data-lucide="arrow-left"></i></button>
             <div style="flex:1; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${((state.lessonStep + 1) / lesson.content.length) * 100}%; background: var(--col-primary);"></div>
             </div>
        </div>
    `;

    // Content Body
    if (stepData.type === 'vocab') {
        stepContent = `
            <div class="vocab-card">
                <div style="font-size: 0.9rem; color: var(--col-text-sub); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px;">New Vocabulary</div>
                <div class="chinese-char">${stepData.char}</div>
                <div class="pinyin">${stepData.pinyin}</div>
                <div class="meaning">${stepData.meaning}</div>
                
                <div style="margin-top: 2rem; background: #FDFBF7; padding: 1rem; border-radius: 12px; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span>👩‍🏫</span> ${stepData.tips}
                </div>
            </div>
        `;
    } else if (stepData.type === 'grammar') {
        stepContent = `
            <div class="vocab-card" style="text-align: left;">
                <h3 style="color: var(--col-primary); margin-bottom: 1.5rem;">${stepData.title}</h3>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">${stepData.explanation}</p>
                <div style="background: var(--col-sidebar); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--col-primary);">
                    <strong>Example:</strong><br>
                    ${stepData.example}
                </div>
            </div>
        `;
    } else if (stepData.type === 'quiz') {
        stepContent = `
             <div class="vocab-card">
                <h3 style="margin-bottom: 2rem;">${stepData.question}</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${stepData.options.map((opt, idx) => `
                        <button class="ctrl-btn" onclick="checkAnswer(${idx}, ${stepData.correct})">${opt}</button>
                    `).join('')}
                </div>
                <div id="quiz-feedback" class="feedback-msg"></div>
             </div>
        `;
    }

    // Next Button (Only for non-quiz, quiz handles its own transition)
    const nextBtnHTML = stepData.type !== 'quiz' ? `
        <div class="controls">
            <button class="ctrl-btn primary" onclick="nextStep()">Continue</button>
        </div>
    ` : '';

    contentArea.innerHTML = `
        <div class="learning-screen">
            ${headerHtml}
            ${stepContent}
            ${nextBtnHTML}
        </div>
    `;
    lucide.createIcons();
}

window.exitLesson = () => {
    state.currentLessonId = null;
    render();
}

window.nextStep = () => {
    state.lessonStep++;
    render();
}

window.checkAnswer = (selected, correct) => {
    const feedbackEl = document.getElementById('quiz-feedback');
    if (selected === correct) {
        feedbackEl.innerHTML = "Perfect! 🌟";
        setTimeout(() => {
            nextStep();
        }, 1000);
    } else {
        feedbackEl.innerHTML = "Not quite, try again! 💗";
    }
}

// Initial Render
render();
