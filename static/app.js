const translations = {

    uk: {

        heroTitle: "⚖ Юридичний AI-помічник",

        heroSubtitle:
        "Інтелектуальна система юридичних консультацій",

        heroButton:
        "Почати консультацію",

        inputPlaceholder:
        "Введіть юридичне питання",

        sendButton:
        "Надіслати",

        settingsTitle:
        "⚙ Налаштування",

        themeTitle:
        "Тема",

        languageTitle:
        "Мова",

        darkTheme:
        "🌙 Темна тема",

        lightTheme:
        "☀ Світла тема"

        ,

       logoText:
       "⚖ Юрист AI",

       menuChat:
       "💬 Чат",

      menuDocuments:
      "📄 Документи",

      menuAbout:
      "ℹ Про програму",

menuSettings:
"⚙ Налаштування",

chatTitle:
"⚖ Юридичний AI-помічник",

chatSubtitle:
"Інтелектуальна система юридичних консультацій",

welcomeMessage:
"Вітаю. Я юридичний AI-помічник. Поставте ваше питання.",

documentsTitle:
"📄 Документи",

templatesTitle:
"Доступні шаблони",

aboutTitle:
"ℹ Про програму",

aboutText1:
"Юрист AI — це система юридичних консультацій, створена на Flask + AI API.",

aboutText2:
"Програма допомагає:"

    },

    en: {

        heroTitle:
        "⚖ Legal AI Assistant",

        heroSubtitle:
        "Intelligent legal consultation system",

        heroButton:
        "Start consultation",

        inputPlaceholder:
        "Enter your legal question",

        sendButton:
        "Send",

        settingsTitle:
        "⚙ Settings",

        themeTitle:
        "Theme",

        languageTitle:
        "Language",

        darkTheme:
        "🌙 Dark theme",

        lightTheme:
        "☀ Light theme"
        ,

logoText:
"⚖ Lawyer AI",

menuChat:
"💬 Chat",

menuDocuments:
"📄 Documents",

menuAbout:
"ℹ About",

menuSettings:
"⚙ Settings",

chatTitle:
"⚖ Legal AI Assistant",

chatSubtitle:
"Intelligent legal consultation system",

welcomeMessage:
"Hello. I am a legal AI assistant. Ask your question.",

documentsTitle:
"📄 Documents",

templatesTitle:
"Available templates",

aboutTitle:
"ℹ About",

aboutText1:
"Lawyer AI is a legal consultation system built with Flask + AI API.",

aboutText2:
"The program helps:"

    }
};

function changeLanguage() {

    const lang =
    document.getElementById("language-select").value;

    // HERO

    document.getElementById("hero-title").innerHTML =
    translations[lang].heroTitle;

    document.getElementById("hero-subtitle").innerHTML =
    translations[lang].heroSubtitle;

    document.getElementById("hero-button").innerHTML =
    translations[lang].heroButton;

    document.getElementById("logo-text").innerHTML =
    translations[lang].logoText;

    document.getElementById("menu-chat").innerHTML =
    translations[lang].menuChat;

    document.getElementById("menu-documents").innerHTML =
    translations[lang].menuDocuments;

    document.getElementById("menu-about").innerHTML =
    translations[lang].menuAbout;

    document.getElementById("menu-settings").innerHTML =
    translations[lang].menuSettings;

    // CHAT

    document.getElementById("user-input").placeholder =
    translations[lang].inputPlaceholder;

    document.getElementById("send-button").innerHTML =
    translations[lang].sendButton;

    document.getElementById("chat-title").innerHTML =
translations[lang].chatTitle;

document.getElementById("chat-subtitle").innerHTML =
translations[lang].chatSubtitle;

document.getElementById("welcome-message").innerHTML =
translations[lang].welcomeMessage;

document.getElementById("quick-will").innerHTML =
translations[lang].quickWill;

document.getElementById("quick-divorce").innerHTML =
translations[lang].quickDivorce;

document.getElementById("quick-accident").innerHTML =
translations[lang].quickAccident;

document.getElementById("quick-motion").innerHTML =
translations[lang].quickMotion;

document.getElementById("quick-theft").innerHTML =
translations[lang].quickTheft;

document.getElementById("quick-court").innerHTML =
translations[lang].quickCourt;

    // SETTINGS

    document.getElementById("settings-title").innerHTML =
    translations[lang].settingsTitle;

    document.getElementById("theme-title").innerHTML =
    translations[lang].themeTitle;

    document.getElementById("language-title").innerHTML =
    translations[lang].languageTitle;

    document.getElementById("documents-title").innerHTML =
translations[lang].documentsTitle;

document.getElementById("templates-title").innerHTML =
translations[lang].templatesTitle;

document.getElementById("about-title").innerHTML =
translations[lang].aboutTitle;

document.getElementById("about-text-1").innerHTML =
translations[lang].aboutText1;

document.getElementById("about-text-2").innerHTML =
translations[lang].aboutText2;

    // THEME BUTTON

    const themeBtn =
    document.getElementById("theme-btn");

    if(document.body.classList.contains("light-theme")) {

        themeBtn.innerHTML =
        translations[lang].lightTheme;

    } else {

        themeBtn.innerHTML =
        translations[lang].darkTheme;
    }

    // SAVE LANGUAGE

    localStorage.setItem("language", lang);
}


document.getElementById("user-input")
    .addEventListener("keypress", function(event) {

    if(event.key === "Enter") {

        sendMessage();
    }

});

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");

    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("active");

    overlay.classList.toggle("active");
}

function showSection(sectionId) {

    // знаходимо всі секції
    const sections = document.querySelectorAll(".content-section");

    // ховаємо всі секції
    sections.forEach(section => {
        section.classList.add("hidden");
    });

    // показуємо потрібну
    document.getElementById(sectionId).classList.remove("hidden");

    // закриваємо sidebar
    toggleSidebar();
}



function scrollToChat() {

    const hero = document.querySelector(".hero");

    const mainContent = document.getElementById("main-content");

    hero.style.opacity = "0";

    setTimeout(() => {

        hero.style.display = "none";

        mainContent.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 400);
}

function toggleTheme() {

    document.body.classList.toggle("light-theme");

    const themeBtn =
    document.getElementById("theme-btn");

    const lang =
    document.getElementById("language-select").value;

    if (document.body.classList.contains("light-theme")) {

        themeBtn.innerHTML =
        translations[lang].lightTheme;

        localStorage.setItem("theme", "light");

    } else {

        themeBtn.innerHTML =
        translations[lang].darkTheme;

        localStorage.setItem("theme", "dark");
    }
}

window.onload = function() {

    // THEME

    const savedTheme =
    localStorage.getItem("theme");

    if(savedTheme === "light") {

        document.body.classList.add("light-theme");

        document.getElementById("theme-btn").innerHTML =
        "☀ Світла тема";
    }

    // LANGUAGE

    const savedLanguage =
    localStorage.getItem("language");

    if(savedLanguage) {

        document.getElementById("language-select").value =
        savedLanguage;

        changeLanguage();
    }
}

const chatBox = document.getElementById("chat-box");
const typingLoader =
document.getElementById("typing-loader");

// =========================
// ДОДАВАННЯ ПОВІДОМЛЕННЯ
// =========================

function addMessage(text, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {

        messageDiv.classList.add("user-message");

    } else {

        messageDiv.classList.add("bot-message");
    }

    messageDiv.innerText = text;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}



// =========================
// ВІДПРАВКА ПОВІДОМЛЕННЯ
// =========================

async function sendMessage(customText = null) {

    const input = document.getElementById("user-input");

    let message = customText || input.value.trim();

    if (!message) return;

    // показуємо повідомлення користувача
    addMessage(message, "user");

    // очищаємо input
    input.value = "";

// показуємо loader
typingLoader.classList.remove("hidden");

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();
        // ховаємо loader
typingLoader.classList.add("hidden");

        addMessage(data.answer, "bot");

    } catch (error) {

        typingLoader.classList.add("hidden");
        addMessage("Помилка сервера.", "bot");
    }
}

// =========================
// ГЕНЕРАЦІЯ ДОКУМЕНТІВ
// =========================

function generateDocument(type) {

    const result =
    document.getElementById("document-result");

    result.classList.remove("hidden");

    // =====================
    // ПОЗОВ
    // =====================

    if(type === "lawsuit") {

        result.innerText = `

ПОЗОВНА ЗАЯВА

До суду:

Позивач:
________________

Відповідач:
________________

СУТЬ ПОЗОВУ:

Прошу суд:

1. __________________

2. __________________

Дата:
Підпис:

`;

    }

    // =====================
    // КЛОПОТАННЯ
    // =====================

    if(type === "motion") {

        result.innerText = `

КЛОПОТАННЯ

До суду:

У справі № ______

Прошу:

_____________________

Обґрунтування:

_____________________

Дата:
Підпис:

`;

    }

    // =====================
    // СКАРГА
    // =====================

    if(type === "complaint") {

        result.innerText = `

СКАРГА

Я, __________________,

повідомляю про:

_____________________

Прошу:

_____________________

Дата:
Підпис:

`;

    }

    // =====================
    // ПОЛІЦІЯ
    // =====================

    if(type === "police") {

        result.innerText = `

ЗАЯВА ДО ПОЛІЦІЇ

Прошу внести відомості до ЄРДР.

Обставини:

_____________________

Дата:
Підпис:

`;

    }

    // =========================
    // КНОПКИ СКАЧУВАННЯ
    // =========================

    result.innerHTML += `

    <div class="download-buttons">

        <a href="/download-pdf/${type}">
            <button class="download-btn">
                ⬇ Скачать PDF
            </button>
        </a>

        <a href="/download-docx/${type}">
            <button class="download-btn">
                ⬇ Скачать DOCX
            </button>
        </a>

    </div>

    `;
}

// =========================
// CLOCK
// =========================

function updateClock() {

    // створюємо об'єкт часу
    const now = new Date();

    // =========================
    // ЧАС
    // =========================

    // години
    let hours = now.getHours();

    // хвилини
    let minutes = now.getMinutes();

    // секунди
    let seconds = now.getSeconds();

    // =========================
    // ДАТА
    // =========================

    let day = now.getDate();

    let month = now.getMonth() + 1;

    let year = now.getFullYear();

    // =========================
    // ДОДАЄМО 0
    // =========================

    // приклад:
    // 5 -> 05

    hours = String(hours).padStart(2, "0");

    minutes = String(minutes).padStart(2, "0");

    seconds = String(seconds).padStart(2, "0");

    day = String(day).padStart(2, "0");

    month = String(month).padStart(2, "0");

    // =========================
    // ВСТАВКА В HTML
    // =========================

    document.getElementById("clock-time").innerHTML =

        `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock-date").innerHTML =

        `${day}.${month}.${year}`;
}

// =========================
// ОНОВЛЕННЯ КОЖНУ СЕКУНДУ
// =========================

setInterval(updateClock, 1000);

// запуск одразу
updateClock();

// ========================================
// WEATHER
// ========================================

async function loadWeather() {

    // ------------------------------------
    // INPUT
    // ------------------------------------

    const city = document
    .getElementById("weather-city")
    .value;

    // ------------------------------------
    // FETCH
    // ------------------------------------

    const response = await fetch(

        `/api/weather?city=${city}`

    );

    // ------------------------------------
    // JSON
    // ------------------------------------

    const data = await response.json();

    // ------------------------------------
    // RESULT BLOCK
    // ------------------------------------

    const resultDiv = document
    .getElementById("weather-result");

    // ------------------------------------
    // ERROR
    // ------------------------------------

    if(data.error) {

        resultDiv.innerHTML = `

            <p>${data.error}</p>

        `;

        return;
    }

    // ------------------------------------
    // HTML
    // ------------------------------------

    resultDiv.innerHTML = `

<div class="weather-card">

    <!-- МІСТО -->

    <div class="weather-city">

        ☁ ${data.city}

    </div>

    <!-- ТЕМПЕРАТУРА -->

    <div class="weather-temp">

        ${data.temperature}°C

    </div>

    <!-- СІТКА -->

    <div class="weather-grid">

        <!-- ПОГОДА -->

        <div class="weather-item">

            <div class="weather-label">

                Стан погоди

            </div>

            <div class="weather-value">

                ${data.description}

            </div>

        </div>

        <!-- ВІДЧУВАЄТЬСЯ -->

        <div class="weather-item">

            <div class="weather-label">

                Відчувається як

            </div>

            <div class="weather-value">

                ${data.feels_like}°C

            </div>

        </div>

        <!-- ВОЛОГІСТЬ -->

        <div class="weather-item">

            <div class="weather-label">

                Вологість

            </div>

            <div class="weather-value">

                ${data.humidity}%

            </div>

        </div>

        <!-- ВІТЕР -->

        <div class="weather-item">

            <div class="weather-label">

                Вітер

            </div>

            <div class="weather-value">

                ${data.wind} м/с

            </div>

        </div>

    </div>

</div>

`;
}

// ========================================
// NEWS
// ========================================

async function loadNews() {

    // ------------------------------------
    // FETCH
    // ------------------------------------

    const response = await fetch("/api/news");

    // ------------------------------------
    // JSON
    // ------------------------------------

    const data = await response.json();

    // ------------------------------------
    // CONTAINER
    // ------------------------------------

    const container = document
    .getElementById("news-container");

    // ------------------------------------
    // CLEAR
    // ------------------------------------

    container.innerHTML = "";

    // ------------------------------------
    // LOOP
    // ------------------------------------

    data.forEach(news => {

        container.innerHTML += `

            <div class="news-item">

                <a href="${news.url}"
                   target="_blank">

                    ${news.title}

                </a>

                <div class="news-source">

                    ${news.source}

                </div>

            </div>

        `;

    });

}

// ========================================
// AUTO LOAD
// ========================================

loadNews();
// оновлення кожні 5 хвилин
setInterval(loadNews, 300000);

// ========================================
// EMERGENCY SERVICES
// ========================================

// ----------------------------------------
// POLICE
// ----------------------------------------

function openPolice() {

    window.open(

        "https://www.npu.gov.ua"

    );

}

// ----------------------------------------
// FREE LEGAL AID
// ----------------------------------------

function openBPD() {

    window.open(

        "https://legalaid.gov.ua"

    );

}

// ----------------------------------------
// OMBUDSMAN
// ----------------------------------------

function openOmbudsman() {

    window.open(

        "https://ombudsman.gov.ua"

    );

}

// ----------------------------------------
// COURT
// ----------------------------------------

function openCourt() {

    window.open(

        "https://court.gov.ua"

    );

}

// ----------------------------------------
// ELECTRONIC COURT
// ----------------------------------------

function openECourt() {

    window.open(

        "https://id.court.gov.ua"

    );

}