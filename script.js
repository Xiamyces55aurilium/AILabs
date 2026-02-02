// State Management
const state = {
    currentTab: 'home',
    streak: 3,
    userLevel: 'HSK 1',
    currentLessonId: null,
    lessonStep: 0,
    practiceMode: null, // 'pronounce' or 'write'
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
        content: [
            {
                type: 'vocab',
                char: '一',
                pinyin: 'Yī',
                meaning: 'One',
                audio: 'yi',
                tips: "Just one horizontal line. Easy!"
            },
            {
                type: 'vocab',
                char: '二',
                pinyin: 'Èr',
                meaning: 'Two',
                audio: 'er',
                tips: "Two lines. See the pattern?"
            },
            {
                type: 'vocab',
                char: '三',
                pinyin: 'Sān',
                meaning: 'Three',
                audio: 'san',
                tips: "Three lines. Ancient logic!"
            },
            {
                type: 'quiz',
                question: "Which character is 'Three'?",
                options: ['一', '二', '三'],
                correct: 2
            }
        ]
    },
    {
        id: 3,
        title: "Family Members",
        desc: "Mom, Dad, and siblings.",
        color: "#C7CEEA",
        content: [
            {
                type: 'vocab',
                char: '爸爸',
                pinyin: 'Bàba',
                meaning: 'Dad',
                audio: 'baba',
                tips: "Sounds like 'Papa'."
            },
            {
                type: 'vocab',
                char: '妈妈',
                pinyin: 'Māma',
                meaning: 'Mom',
                audio: 'mama',
                tips: "First tone: High and flat."
            },
            {
                type: 'grammar',
                title: 'Introduction',
                explanation: "To introduce family: This is my...",
                example: "这是 (This is) + 我的 (my) + 爸爸 (dad)."
            }
        ]
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

    switch (state.currentTab) {
        case 'home':
            renderHome();
            break;
        case 'learn':
            renderLearn();
            break;
        case 'practice':
            if (state.practiceMode === 'pronounce') {
                renderPronunciationHelper();
            } else if (state.practiceMode === 'write') {
                renderWritingHelper();
            } else if (state.practiceMode === 'translate') {
                renderTranslator();
            } else {
                renderPractice();
            }
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
                <div style="font-size: 5rem; margin-bottom: 1.5rem; animation: bounce 1s infinite alternate;">🎉</div>
                <h2 style="margin-bottom: 1rem; font-family: var(--font-hand); font-size: 2.5rem; color: var(--col-primary);">Lesson Complete!</h2>
                <div class="sticky-note pink" style="display:inline-block; transform: rotate(-2deg);">
                    <p style="font-size: 1.2rem; margin:0;">You're doing amazing! +50 XP</p>
                </div>
                <br>
                <button class="ctrl-btn primary" onclick="exitLesson()" style="margin-top: 3rem;">Back to Home</button>
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
            <div class="sticky-note" style="max-width: 400px; margin: 2rem auto;">
                <div style="font-size: 1rem; color: #888; margin-bottom: 0.5rem; font-family: var(--font-ui);">New Vocabulary</div>
                <div class="chinese-char" style="color: #333;">${stepData.char}</div>
                <div class="pinyin" style="color: #FF8A80;">${stepData.pinyin}</div>
                <div class="meaning" style="color: #555;">${stepData.meaning}</div>
                
                <div style="margin-top: 1.5rem; border-top: 2px dashed rgba(0,0,0,0.1); padding-top: 1rem; font-size: 1.1rem;">
                    <span>💡</span> ${stepData.tips}
                </div>
                <button onclick="speakText('${stepData.char}')" style="margin-top:1rem; background:none; border:none; cursor:pointer; color:var(--col-primary);"><i data-lucide="volume-2"></i></button>
            </div>
        `;
    } else if (stepData.type === 'grammar') {
        stepContent = `
            <div class="lined-paper" style="max-width: 600px; margin: 0 auto;">
                <h3 style="color: var(--col-primary); margin-bottom: 1.5rem; font-family: var(--font-hand); font-size: 2rem; transform: rotate(-1deg);">${stepData.title}</h3>
                <p style="font-size: 1.2rem; margin-bottom: 1.5rem;">${stepData.explanation}</p>
                <div style="background: rgba(255, 183, 197, 0.1); padding: 1.5rem; border-radius: 4px; border-left: 4px solid var(--col-primary);">
                    <strong>Example:</strong><br>
                    <span style="font-size: 1.2rem;">${stepData.example}</span>
                </div>
            </div>
        `;
    } else if (stepData.type === 'quiz') {
        stepContent = `
             <div class="sticky-note blue" style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <h3 style="margin-bottom: 2rem; font-family: var(--font-ui); color: #444;">${stepData.question}</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${stepData.options.map((opt, idx) => `
                        <button class="ctrl-btn" onclick="checkAnswer(${idx}, ${stepData.correct})" style="background: white; border: 1px solid #ddd;">${opt}</button>
                    `).join('')}
                </div>
                <div id="quiz-feedback" class="feedback-msg" style="font-family: var(--font-hand); font-size: 1.5rem; margin-top: 1.5rem;"></div>
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

// Practice Views
function renderPractice() {
    contentArea.innerHTML = `
        <div class="section-title">Practice Studio 🎨</div>
        <div class="grid-container">
            <div class="lesson-card sticky-note pink" onclick="enterPracticeMode('pronounce')" style="text-align: center; cursor: pointer;">
                <div style="background:none; margin-bottom:1rem; font-size:3rem;">🗣️</div>
                <h4>Pronunciation Helper</h4>
                <p>Listen to any text and practice speaking.</p>
            </div>
            
            <div class="lesson-card sticky-note blue" onclick="enterPracticeMode('write')" style="text-align: center; cursor: pointer;">
                 <div style="background:none; margin-bottom:1rem; font-size:3rem;">✍️</div>
                <h4>Writing Alphabet</h4>
                <p>Practice writing strokes on virtual paper.</p>
            </div>

            <div class="lesson-card sticky-note" style="background-color: #E6E6FA; transform: rotate(1deg); text-align: center; cursor: pointer;" onclick="enterPracticeMode('translate')">
                 <div style="background:none; margin-bottom:1rem; font-size:3rem;">🌐</div>
                <h4>Live Translator</h4>
                <p>Translate English to Chinese instantly.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderTranslator() {
    contentArea.innerHTML = `
        <div class="header-bar" style="margin-bottom: 2rem;">
            <button onclick="exitPracticeMode()" class="ctrl-btn"><i data-lucide="arrow-left"></i> Back</button>
        </div>
        <div class="sticky-note" style="max-width: 600px; margin: 0 auto; background-color: #f3e5f5; padding: 2rem; transform: rotate(0deg);">
            <h3 style="font-family: var(--font-hand); font-size: 2rem; margin-bottom: 1.5rem; text-align:center;">Magic Translator ✨</h3>
            
            <div style="display: flex; gap: 1rem; flex-direction: column;">
                <textarea id="trans-input" placeholder="Type English here..." style="width: 100%; border: 2px solid #ccc; padding: 1rem; border-radius: 12px; font-family: var(--font-ui); font-size: 1.2rem; outline: none; background: white; min-height: 100px;"></textarea>
                
                <div style="text-align: center;">
                    <i data-lucide="arrow-down" style="color: var(--col-primary);"></i>
                </div>
                
                <div id="trans-output" style="width: 100%; border: 2px dashed var(--col-primary); padding: 1rem; border-radius: 12px; font-family: var(--font-cn); font-size: 1.5rem; background: rgba(255,255,255,0.8); min-height: 100px; display: flex; align-items: center; justify-content: center; color: var(--col-primary);">
                    Translation will appear here...
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                <button class="ctrl-btn primary" onclick="translateText()">Translate</button>
            </div>
            <p style="text-align:center; font-size: 0.8rem; margin-top: 1rem; color: #888;">*Simple demo translator for common phrases</p>
        </div>
    `;
    lucide.createIcons();
}

window.translateText = async () => {
    const input = document.getElementById('trans-input').value.toLowerCase().trim();
    const output = document.getElementById('trans-output');

    if (!input) return;

    output.innerHTML = "Thinking... 💭";

    // Simple mock dictionary for demo purposes
    const dictionary = {
        "hello": "你好 (Nǐ hǎo)",
        "how are you": "你好吗 (Nǐ hǎo ma)",
        "goodbye": "再见 (Zàijiàn)",
        "thank you": "谢谢 (Xièxiè)",
        "i love you": "我爱你 (Wǒ ài nǐ)",
        "good morning": "早安 (Zǎo ān)",
        "good night": "晚安 (Wǎn ān)",
        "friend": "朋友 (Péngyǒu)",
        "teacher": "老师 (Lǎoshī)",
        "student": "学生 (Xuésheng)",
        "cat": "猫 (Māo)",
        "dog": "狗 (Gǒu)",
        "happy": "快乐 (Kuàilè)",
        "water": "水 (Shuǐ)",
        "coffee": "咖啡 (Kāfēi)"
    };

    // Check dictionary
    if (dictionary[input]) {
        setTimeout(() => {
            output.innerHTML = dictionary[input];
            speakText(dictionary[input].split('(')[0]); // Speak Chinese part
        }, 500);
    } else {
        // Fallback to fetch API if not in dictionary (using MyMemory API for demo)
        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=en|zh`);
            const data = await res.json();
            if (data.responseData.translatedText) {
                output.innerHTML = data.responseData.translatedText;
                speakText(data.responseData.translatedText);
            } else {
                output.innerHTML = "Could not translate. 😔";
            }
        } catch (e) {
            output.innerHTML = "Offline / Error 😔";
        }
    }
}

// Dark Mode Logic
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (isDark) {
        icon.setAttribute('data-lucide', 'sun');
        text.innerText = 'Light Mode';
    } else {
        icon.setAttribute('data-lucide', 'moon');
        text.innerText = 'Dark Mode';
    }
    lucide.createIcons();
}

// Check saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon();
}
function renderPronunciationHelper() {
    contentArea.innerHTML = `
        <div class="header-bar" style="margin-bottom: 2rem;">
            <button onclick="exitPracticeMode()" class="ctrl-btn"><i data-lucide="arrow-left"></i> Back</button>
        </div>
        <div class="sticky-note" style="max-width: 500px; margin: 0 auto; min-height: 400px; padding: 2rem;">
            <h3 style="font-family: var(--font-hand); font-size: 2rem; margin-bottom: 1.5rem;">Speak & Listen 🗣️</h3>
            <textarea id="tts-input" placeholder="Type Chinese here (e.g. 你好)" style="width: 100%; border: 2px dashed #ccc; padding: 1rem; border-radius: 12px; font-family: var(--font-cn); font-size: 1.5rem; margin-bottom: 1rem; outline: none; background: rgba(255,255,255,0.5);"></textarea>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="ctrl-btn primary" onclick="speakInput()">
                    <i data-lucide="volume-2"></i> Listen
                </button>
            </div>
            
            <div style="margin-top: 2rem; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 1rem;">
                <p style="font-family: var(--font-hand); font-size: 1.2rem;">Quick Phrases:</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    <button class="ctrl-btn" onclick="setTextAndSpeak('你好')">你好</button>
                    <button class="ctrl-btn" onclick="setTextAndSpeak('谢谢')">谢谢</button>
                    <button class="ctrl-btn" onclick="setTextAndSpeak('再见')">再见</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderWritingHelper() {
    contentArea.innerHTML = `
        <div class="header-bar" style="margin-bottom: 1rem;">
            <button onclick="exitPracticeMode()" class="ctrl-btn"><i data-lucide="arrow-left"></i> Back</button>
        </div>
        <div class="lined-paper" style="max-width: 600px; margin: 0 auto;">
            <h3 style="font-family: var(--font-hand); font-size: 2rem; margin-bottom: 1rem;">Character Writer ✍️</h3>
            <p style="margin-bottom: 1rem;">Trace or write characters below.</p>
            
            <div class="writing-canvas-container">
                <div class="writing-grid"></div>
                <canvas id="write-canvas" width="400" height="400"></canvas>
            </div>
            
            <div class="controls" style="margin-top: 1rem;">
                <button class="ctrl-btn" onclick="clearCanvas()">Clear Paper</button>
            </div>
        </div>
    `;
    lucide.createIcons();
    initCanvas();
}

// Helper Functions
window.enterPracticeMode = (mode) => {
    state.practiceMode = mode;
    render();
}

window.exitPracticeMode = () => {
    state.practiceMode = null;
    render();
}

window.speakText = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
}

window.speakInput = () => {
    const text = document.getElementById('tts-input').value;
    if (text) speakText(text);
}

window.setTextAndSpeak = (text) => {
    document.getElementById('tts-input').value = text;
    speakText(text);
}

window.clearCanvas = () => {
    const canvas = document.getElementById('write-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.initCanvas = () => {
    const canvas = document.getElementById('write-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#333';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function draw(e) {
        if (!isDrawing) return;

        // Handle touch vs mouse
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener('touchend', () => isDrawing = false);
}

// Initial Render
render();
