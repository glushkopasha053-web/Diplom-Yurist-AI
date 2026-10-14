const translations = {
  uk: {
    heroTitle: "⚖ Юридичний AI-помічник",

    heroSubtitle: "Інтелектуальна система юридичних консультацій",

    heroButton: "Почати консультацію",

    inputPlaceholder: "Введіть юридичне питання",

    sendButton: "Надіслати",

    settingsTitle: "⚙ Налаштування",

    themeTitle: "Тема",

    languageTitle: "Мова",

    darkTheme: "🌙 Темна тема",

    lightTheme: "☀ Світла тема",

    logoText: "⚖ Юрист AI",

    menuChat: "💬 Чат",

    menuDocuments: "📄 Документи",

    menuChecker: "📝 Перевірка документу",

    menuAbout: "ℹ Про програму",

    menuSettings: "⚙ Налаштування",

    menuGame: "🎮 Гра",

    menuWeather: "☁ Погода",

    chatTitle: "⚖ Юридичний AI-помічник",

    chatSubtitle: "Інтелектуальна система юридичних консультацій",

    welcomeMessage: "Вітаю. Я юридичний AI-помічник. Поставте ваше питання.",

    documentsTitle: "📄 Документи",

    templatesTitle: "Доступні шаблони",

    aboutTitle: "ℹ Про програму",

    aboutText1:
      "Юрист AI — це система юридичних консультацій, створена на Flask + AI API.",

    aboutText2: "Програма допомагає:",
  },

  en: {
    heroTitle: "⚖ Legal AI Assistant",

    heroSubtitle: "Intelligent legal consultation system",

    heroButton: "Start consultation",

    inputPlaceholder: "Enter your legal question",

    sendButton: "Send",

    settingsTitle: "⚙ Settings",

    themeTitle: "Theme",

    languageTitle: "Language",

    darkTheme: "🌙 Dark theme",

    lightTheme: "☀ Light theme",
    logoText: "⚖ Lawyer AI",

    menuChat: "💬 Chat",

    menuDocuments: "📄 Documents",

    menuChecker: "📝 Document Checker",

    menuAbout: "ℹ About",

    menuSettings: "⚙ Settings",

    menuGame: "🎮 Game",

    menuWeather: "☁ Weather",

    chatTitle: "⚖ Legal AI Assistant",

    chatSubtitle: "Intelligent legal consultation system",

    welcomeMessage: "Hello. I am a legal AI assistant. Ask your question.",

    documentsTitle: "📄 Documents",

    templatesTitle: "Available templates",

    aboutTitle: "ℹ About",

    aboutText1:
      "Lawyer AI is a legal consultation system built with Flask + AI API.",

    aboutText2: "The program helps:",
  },
};

// Унікальний ідентифікатор сесії чату
// Зберігається у localStorage — щоб історія не губилась при F5
function getSessionId() {
    let sessionId = localStorage.getItem("chat_session_id");

    if (!sessionId) {
        sessionId = "sess_" + Date.now() + "_" +
                    Math.random().toString(36).slice(2, 9);
        localStorage.setItem("chat_session_id", sessionId);
    }

    return sessionId;
}

function changeLanguage() {
  const lang = document.getElementById("language-select").value;

  // HERO

  document.getElementById("hero-title").innerHTML =
    translations[lang].heroTitle;

  document.getElementById("hero-subtitle").innerHTML =
    translations[lang].heroSubtitle;

  document.getElementById("hero-button").innerHTML =
    translations[lang].heroButton;

  document.getElementById("logo-text").innerHTML = translations[lang].logoText;

    // Оновлюємо ТІЛЬКИ текст у кнопках, не чіпаючи іконки
  const menuTexts = {
    "menu-chat": "menuChat",
    "menu-documents": "menuDocuments",
    "menu-checker": "menuChecker",
    "menu-about": "menuAbout",
    "menu-settings": "menuSettings",
    "menu-game": "menuGame",
    "menu-weather": "menuWeather"
  };

  for (const [id, key] of Object.entries(menuTexts)) {
    const btn = document.getElementById(id);
    if (btn) {
      const textEl = btn.querySelector(".menu-btn-text");
      if (textEl) {
        textEl.innerHTML = translations[lang][key];
      } else {
        btn.innerHTML = translations[lang][key];
      }
    }
  }

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

  const themeBtn = document.getElementById("theme-btn");

  if (document.body.classList.contains("light-theme")) {
    themeBtn.innerHTML = translations[lang].lightTheme;
  } else {
    themeBtn.innerHTML = translations[lang].darkTheme;
  }

  // SAVE LANGUAGE

  localStorage.setItem("language", lang);
}

document
  .getElementById("user-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
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

    // ховаємо всі секції
    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.add("hidden");
    });

    // показуємо потрібну
    document.getElementById(sectionId).classList.remove("hidden");

    // ПІДСВІЧУЄМО активну кнопку
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const menuMap = {
        "chat-section": "menu-chat",
        "documents-section": "menu-documents",
        "checker-section": "menu-checker",
        "game-section": "menu-game",
        "about-section": "menu-about",
        "settings-section": "menu-settings"
    };

    const menuId = menuMap[sectionId];
    if (menuId) {
        const activeBtn = document.getElementById(menuId);
        if (activeBtn) activeBtn.classList.add("active");
    }

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

// 🎯 ВИМИКАЄМО анімацію фону (бо заставка зникла)
    document.body.classList.add("bg-paused");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 400);
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");

  const themeBtn = document.getElementById("theme-btn");

  const lang = document.getElementById("language-select").value;

  if (document.body.classList.contains("light-theme")) {
    themeBtn.innerHTML = translations[lang].lightTheme;

    localStorage.setItem("theme", "light");
  } else {
    themeBtn.innerHTML = translations[lang].darkTheme;

    localStorage.setItem("theme", "dark");
  }
}

window.onload = function () {
  // THEME

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");

    document.getElementById("theme-btn").innerHTML = "☀ Світла тема";
  }

  // LANGUAGE

  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage) {
    document.getElementById("language-select").value = savedLanguage;

    changeLanguage();
  }
};

const chatBox = document.getElementById("chat-box");
const typingLoader = document.getElementById("typing-loader");

// =========================
// ДОДАВАННЯ ПОВІДОМЛЕННЯ
// =========================

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");
    }

    // Аватар
    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");
    avatar.textContent = (sender === "user") ? "👤" : "🤖";

    // Текст
    const content = document.createElement("div");
    content.classList.add("message-content");
    content.innerText = text;

    // Збираємо
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (typeof checkScrollButton === "function") checkScrollButton();
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
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message,
        session_id: getSessionId()
      }),

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

  document.getElementById("clock-date").innerHTML = `${day}.${month}.${year}`;
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

  const city = document.getElementById("weather-city").value;

  // ------------------------------------
  // FETCH
  // ------------------------------------

  const response = await fetch(`/api/weather?city=${city}`);

  // ------------------------------------
  // JSON
  // ------------------------------------

  const data = await response.json();

  // ------------------------------------
  // RESULT BLOCK
  // ------------------------------------

  const resultDiv = document.getElementById("weather-result");

  // ------------------------------------
  // ERROR
  // ------------------------------------

  if (data.error) {
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

  const container = document.getElementById("news-container");

  // ------------------------------------
  // CLEAR
  // ------------------------------------

  container.innerHTML = "";

  // ------------------------------------
  // LOOP
  // ------------------------------------

  data.forEach((news) => {
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
  window.open("https://www.npu.gov.ua");
}

// ----------------------------------------
// FREE LEGAL AID
// ----------------------------------------

function openBPD() {
  window.open("https://legalaid.gov.ua");
}

// ----------------------------------------
// OMBUDSMAN
// ----------------------------------------

function openOmbudsman() {
  window.open("https://ombudsman.gov.ua");
}

// ----------------------------------------
// COURT
// ----------------------------------------

function openCourt() {
  window.open("https://court.gov.ua");
}

// ----------------------------------------
// ELECTRONIC COURT
// ----------------------------------------

function openECourt() {
  window.open("https://id.court.gov.ua");
}

// =========================
// LAW RUNNER GAME
// =========================

const playerImage = new Image();

playerImage.src = "/static/assets/player.png";

const obstacleImage = new Image();
obstacleImage.src = "/static/assets/obstacle.png";

const backgroundImage = new Image();
backgroundImage.src = "/static/assets/background.png";

const groundImage = new Image();
groundImage.src = "/static/assets/ground.png";
// Знаходимо canvas

const canvas = document.getElementById("gameCanvas");

// Отримуємо 2D режим малювання

const ctx = canvas.getContext("2d");
// =========================
// PLAYER
// =========================

let player = {
  // позиція X
  x: 80,

  // позиція Y
  y: 220,

  // ширина
  width: 50,

  // висота
  height: 50,

  // швидкість стрибка
  velocityY: 0,

  // чи стрибає
  jumping: false,
};
// =========================
// GAME PHYSICS
// =========================

// сила тяжіння

let gravity = 1.7;

// чи запущена гра

let gameStarted = false;

// масив перешкод

let obstacles = [];

// очки

let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let gameLoopId = null;

// =========================
// START GAME
// =========================

function startGame() {
  // показуємо canvas

  canvas.style.display = "block";

  document.getElementById("gameStartBtn").style.display = "none";

  // очищаємо перешкоди

  obstacles = [];

  // скидаємо очки

  score = 0;

  // повертаємо гравця

  player.y = 330;

  // запускаємо гру

  gameStarted = true;

  // запускаємо цикл гри
  if (!gameLoopId) {
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}
// ==========================
// GAME LOOP
// ==========================

function gameLoop() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawClouds();

  // малюємо землю
  drawGround();

  // оновлюємо гравця
  updatePlayer();

  // малюємо гравця
  drawPlayer();

  // запускаємо наступний кадр
  if (gameStarted) {
    gameLoopId = requestAnimationFrame(gameLoop);
  } else {
    gameLoopId = null;
  }

  updateObstacles();

  drawObstacles();

  ctx.fillStyle = "white";

  ctx.font = "24px Arial";

  ctx.fillText("Очки: " + Math.floor(score), 20, 40);
  ctx.fillText("Рекорд: " + bestScore, 20, 70);
  updateCoins();
  drawCoins();
}

// ==========================
// GROUND
// ==========================

function drawGround() {
  ctx.drawImage(groundImage, 0, 390, canvas.width, 60);
}

// ==========================
// PLAYER PHYSICS
// ==========================

function updatePlayer() {
  // додаємо гравітацію
  player.velocityY += gravity;

  // рухаємо вниз
  player.y += player.velocityY;

  // якщо впав на землю
  if (player.y >= 330) {
    // ставимо назад
    player.y = 330;

    // обнуляємо швидкість
    player.velocityY = 0;

    // більше не стрибає
    player.jumping = false;
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}
// ==========================
// JUMP
// ==========================

function jump() {

    if (!player.jumping) {

        player.velocityY = -18;

        player.jumping = true;
    }
}

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        jump();
    }
});

canvas.addEventListener("touchstart", function() {

    jump();

});

canvas.addEventListener("click", function() {

    jump();

});

//ПЕРЕШКОДИ
function createObstacle() {
  obstacles.push({
    x: canvas.width,
    y: 350,
    width: 30,
    height: 40,
  });
}
//МАЛЮВАННЯ ПЕРЕШКОД
function drawObstacles() {
  ctx.shadowColor = "red";
  ctx.shadowBlur = 20;

  ctx.fillStyle = "#ff3b3b";

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];

    ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);
  }
}
//РУХ ПЕРЕШКОД
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    let speed = 6 + score / 300;

    obstacles[i].x -= speed;

    if (
    player.x + 15 < obstacles[i].x + obstacles[i].width &&
    player.x + player.width - 15 > obstacles[i].x &&
    player.y + 15 < obstacles[i].y + obstacles[i].height &&
    player.y + player.height - 15 > obstacles[i].y
) 
{
      gameOver();
}
  }

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

  score += 0.1;
}

let obstacleSpawn = 3200;

function obstacleSpawner() {
  if (gameStarted) {
    createObstacle();
  }

  // гра стає складнішою
  if (obstacleSpawn > 1200) {
    obstacleSpawn -= 20;
  }

  setTimeout(obstacleSpawner, obstacleSpawn);
}

obstacleSpawner();

function gameOver() {
  if (!gameStarted) return;

  gameStarted = false;
  if (score > bestScore) {
    bestScore = score;

    localStorage.setItem("bestScore", bestScore);
  }

  alert("Гру завершено! Очки: " + Math.floor(score));

  document.getElementById("restartBtn").style.display = "block";
}

function startRealGame() {
  document.getElementById("quizBox").style.display = "none";

  startGame();
}
// =========================
// QUIZ QUESTIONS
// =========================

const quizQuestions = [
  {
    question: "Яка стаття Конституції України гарантує свободу слова?",

    answers: ["Стаття 34", "Стаття 12", "Стаття 99"],

    correct: 0,
  },

  {
    question:
      "З якого віку в Україні настає кримінальна відповідальність у більшості випадків?",

    answers: ["14 років", "16 років", "18 років"],

    correct: 1,
  },

  {
    question: "Який орган здійснює правосуддя в Україні?",

    answers: ["Поліція", "Прокуратура", "Суд"],

    correct: 2,
  },

  {
    question: "Що означає презумпція невинуватості?",

    answers: [
      "Людина винна поки не доведе інше",
      "Людина невинна поки її вину не доведено",
      "Поліція завжди права",
    ],

    correct: 1,
  },

  {
    question: "Який документ є основним законом України?",

    answers: ["Конституція", "Кримінальний кодекс", "Паспорт"],

    correct: 0,
  },

  {
    question:
      "Протягом скількох годин затриману особу мають звільнити або доставити до суду?",

    answers: ["24 годин", "72 годин", "48 годин"],

    correct: 1,
  },
  {
    question: "Чи дозволено в Україні подвійне громадянство?",

    answers: ["Дозволено", "Не дозволено"],

    correct: 0,
  },
];

let currentQuiz = null;

function loadQuiz() {
  // випадкове питання
  const randomIndex = Math.floor(Math.random() * quizQuestions.length);

  currentQuiz = quizQuestions[randomIndex];

  // питання
  document.getElementById("quizQuestion").innerText = currentQuiz.question;

  // контейнер кнопок
  const answersDiv = document.getElementById("quizAnswers");

  answersDiv.innerHTML = "";

  // створення кнопок
  currentQuiz.answers.forEach((answer, index) => {
    answersDiv.innerHTML += `

            <button onclick="checkQuiz(${index})">

                ${answer}

            </button>

        `;
  });
}

function checkQuiz(answerIndex) {
  if (answerIndex === currentQuiz.correct) {
    alert("✅ Правильно!");

    document.getElementById("gameStartBtn").style.display = "block";
  } else {
    alert("❌ Неправильно!");
  }
}

function wrongQuiz() {
  alert("❌ Неправильно!");
}
loadQuiz();

function restartGame() {
  // очищаємо перешкоди
  obstacles = [];

  // скидаємо очки
  score = 0;

  // повертаємо гравця
  player.y = 330;

  player.velocityY = 0;

  player.jumping = false;

  // запускаємо гру
  gameStarted = true;

  // ховаємо кнопку
  document.getElementById("restartBtn").style.display = "none";

  // запускаємо тільки ОДИН loop
  if (!gameLoopId) {
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

let coins = [];

function createCoin() {
  coins.push({
    x: canvas.width,
    y: Math.random() * 100 + 220,
  });
  if(Math.random() > 0.6){

        coins.push({
            x: canvas.width + 60,
            y: Math.random() * 100 + 220
        });

    }
}


function coinSpawner() {

    if(gameStarted){

        createCoin();
    }

    let randomTime =
        Math.random() * 3000 + 2000;

    setTimeout(
        coinSpawner,
        randomTime
    );
}

coinSpawner();
function drawCoins() {
  for (let coin of coins) {
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.fillStyle = "gold";

    ctx.arc(coin.x, coin.y, 16, 0, Math.PI * 2);

    ctx.fill();
  }
}
function updateCoins() {
  for (let i = 0; i < coins.length; i++) {
    coins[i].x -= 6;

    let dx = player.x + 25 - coins[i].x;
    let dy = player.y + 25 - coins[i].y;

    if (Math.sqrt(dx * dx + dy * dy) < 45) {
      score += 50;

      coins.splice(i, 1);

      i--;
    }
  }
  coins = coins.filter((coin) => coin.x > -20);
}
function createObstacle() {

if (
    obstacles.length > 0 &&
    canvas.width - obstacles[obstacles.length - 1].x < 300
){
    return;
}

  let randomHeight = Math.random() * 25 + 20;

  obstacles.push({
    x: canvas.width,

    y: 390 - randomHeight,

    width: 30,

    height: randomHeight,
  });
}
let clouds = [];

for (let i = 0; i < 5; i++) {
  clouds.push({
    x: Math.random() * canvas.width,
    y: Math.random() * 150,
  });
}
function drawClouds() {
  ctx.fillStyle = "rgba(255,255,255,0.5)";

  for (let cloud of clouds) {
    cloud.x -= 0.5;

    if (cloud.x < -100) {
      cloud.x = canvas.width;
    }

    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, 25, 0, Math.PI * 2);
    ctx.arc(cloud.x + 20, cloud.y - 10, 30, 0, Math.PI * 2);
    ctx.arc(cloud.x + 45, cloud.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }
}


/* =========================================
   ПЕРЕВІРКА ЮРИДИЧНОГО ДОКУМЕНТА
   Без перезавантаження сторінки
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("document-checker-form");
    const fileInput = document.getElementById("legal-document");
    const button = document.getElementById("check-document-btn");
    const status = document.getElementById("checker-status");
    const result = document.getElementById("checker-result");
    const filename = document.getElementById("checker-filename");
    const textArea = document.getElementById("checker-text");

    // Переконуємося, що всі потрібні HTML-елементи існують.
    if (!form || !fileInput || !button || !status ||
        !result || !filename || !textArea) {
        console.error("Не знайдено елементи форми перевірки документа.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        // Головне: не дозволяємо формі перезавантажувати сторінку.
        event.preventDefault();

        const file = fileInput.files[0];

        if (!file) {
            status.textContent = "Спочатку виберіть PDF або DOCX.";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            status.textContent = "Файл завеликий. Максимальний розмір — 10 МБ.";
            return;
        }

        const extension = file.name.toLowerCase().split(".").pop();

        if (!["pdf", "docx"].includes(extension)) {
            status.textContent = "Дозволені лише файли PDF і DOCX.";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        button.disabled = true;
        status.textContent = "⏳ Читаємо документ...";
        result.classList.add("hidden");
        textArea.value = "";
        filename.textContent = "";

        try {
            const response = await fetch("/api/check-document", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Не вдалося прочитати документ."
                );
            }

            filename.textContent = "Файл: " + data.filename;
            textArea.value = data.text;
            status.textContent = data.message || "Документ успішно прочитано.";

            result.classList.remove("hidden");
        } catch (error) {
            console.error("Помилка перевірки документа:", error);
            status.textContent = error.message ||
                "Помилка зв'язку із сервером. Спробуйте ще раз.";
        } finally {
            button.disabled = false;
        }
    });
});


/* =========================================
   ЮРИДИЧНИЙ АНАЛІЗ ДОКУМЕНТА
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const analyzeBtn = document.getElementById("analyze-document-btn");
    const analysisStatus = document.getElementById("analysis-status");
    const analysisResult = document.getElementById("analysis-result");
    const textArea = document.getElementById("checker-text");

    if (!analyzeBtn || !analysisStatus || !analysisResult || !textArea) {
        return;
    }

    analyzeBtn.addEventListener("click", async function () {

        const text = textArea.value.trim();

        if (!text) {
            analysisStatus.textContent =
                "Спочатку завантажте та прочитайте документ.";
            return;
        }

        analyzeBtn.disabled = true;
        analysisStatus.textContent = "⏳ AI аналізує документ...";
        analysisResult.classList.add("hidden");
        analysisResult.innerHTML = "";

        try {
            const response = await fetch("/api/analyze-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Помилка аналізу.");
            }

            analysisResult.innerText = data.analysis;
            analysisResult.classList.remove("hidden");
            analysisStatus.textContent = "✅ Аналіз завершено.";

        } catch (error) {
            console.error("Помилка аналізу:", error);
            analysisStatus.textContent =
                error.message || "Помилка зв'язку із сервером.";
        } finally {
            analyzeBtn.disabled = false;
        }
    });
});

/* =========================================
   ДОКУМЕНТИ: AI САМ ОБИРАЄ ТИП ДОКУМЕНТА
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("generate-doc-btn");
    const situation = document.getElementById("doc-situation");
    const status = document.getElementById("doc-status");
    const result = document.getElementById("document-result");

    if (!btn || !situation || !status || !result) {
        return;
    }

    btn.addEventListener("click", async function () {

        const text = situation.value.trim();

        if (text.length < 10) {
            status.textContent =
                "Опишіть ситуацію детальніше (мінімум 10 символів).";
            return;
        }

        btn.disabled = true;
        status.textContent = "⏳ AI аналізує ситуацію...";
        result.classList.add("hidden");
        result.innerHTML = "";

        try {
            const response = await fetch("/api/generate-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ situation: text })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Помилка генерації.");
            }

            // Показуємо результат
            result.innerText = data.document;
            result.classList.remove("hidden");

            result.dataset.docText = data.document;

            // Кнопки скачування
            result.innerHTML += `

                <div class="download-buttons">

                    <button class="download-btn"
                            onclick="downloadDoc('pdf')">
                        ⬇ Скачати PDF
                    </button>

                    <button class="download-btn"
                            onclick="downloadDoc('docx')">
                        ⬇ Скачати DOCX
                    </button>

                </div>

            `;

            status.textContent = "✅ Документ готовий.";

            // Прокрутка до результату
            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {
            console.error("Помилка:", error);
            status.textContent = "❌ " + error.message;
        } finally {
            btn.disabled = false;
        }
    });
});


/* =========================================
   СКАЧУВАННЯ
========================================= */

async function downloadDoc(format) {

    const result = document.getElementById("document-result");

    const text = result.dataset.docText || "";

    if (!text) {
        alert("Спочатку згенеруйте документ.");
        return;
    }

    const url = (format === "pdf")
        ? "/download-pdf"
        : "/download-docx";

    // Створюємо безпечне ім'я файлу (латиницею, без зайвих символів у URL)
    let filename = "legal_document";
    const firstLine = text.split("\n")[0].trim();
    
    if (firstLine) {
        // Проста карта транслітерації українських літер для безпечного ім'я файлу
        const translitMap = {
            'а':'a', 'б':'b', 'в':'v', 'г':'h', 'ґ':'g', 'д':'d', 'е':'e', 'є':'ye',
            'ж':'zh', 'з':'z', 'и':'y', 'і':'i', 'ї':'yi', 'й':'y', 'к':'k', 'л':'l',
            'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u',
            'ф':'f', 'х':'kh', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ю':'yu', 'я':'ya',
            'ь':''
        };

        let cleanText = "";
        for (let char of firstLine.toLowerCase()) {
            if (translitMap[char] !== undefined) {
                cleanText += translitMap[char];
            } else if (/[a-z0-9]/.test(char)) {
                cleanText += char;
            } else {
                cleanText += "_";
            }
        }

        // Обрізаємо зайві підкреслення та довжину
        cleanText = cleanText.replace(/_+/g, "_").replace(/^_|_$/g, "");
        if (cleanText.length > 3) {
            filename = cleanText.substring(0, 35);
        }
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text,
                filename: filename
            })
        });

        if (!response.ok) {
            throw new Error("Не вдалося створити файл.");
        }

        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename + "." + format;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);

        // Гарантовано очищуємо URL від будь-яких залишкових параметрів
        window.history.replaceState(null, "", "/");

    } catch (error) {
        console.error("Помилка скачування:", error);
        alert("Помилка: " + error.message);
    }
}

async function clearChat() {

    if (!confirm("Очистити історію чату?")) return;

    try {
        await fetch("/api/clear-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: getSessionId() })
        });

        // Очищаємо UI
       const chatBox = document.getElementById("chat-box");
chatBox.innerHTML = `
    <div id="typing-loader" class="typing-loader hidden">
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <p>AI думає...</p>
    </div>

    <div class="bot-message" id="welcome-message">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            Вітаю. Я юридичний AI-помічник.
            Поставте ваше питання — і я допоможу.
        </div>
    </div>
`;

    } catch (error) {
        console.error("Помилка очищення:", error);
        alert("Не вдалося очистити чат.");
    }
}

/* =========================================
   TYPEWRITER — ефект друку тексту на заставці
========================================= */
function typeWriter(element, text, speed = 40, onComplete = null) {

    if (!element) return;

    // Очищаємо текст
    element.textContent = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Коли дописано — викликаємо колбек (якщо є)
            if (typeof onComplete === "function") {
                onComplete();
            }
        }
    }

    type();
}


window.addEventListener("load", function () {

    const title = document.getElementById("hero-title");
    const subtitle = document.getElementById("hero-subtitle");

    if (!title || !subtitle) return;

    // Беремо текст з HTML — не дублюємо
    const titleText = title.textContent.trim();
    const subtitleText = subtitle.textContent.trim();

    // Запускаємо typewriter
    setTimeout(() => {
        typeWriter(title, titleText, 80, () => {
            setTimeout(() => {
                typeWriter(subtitle, subtitleText, 60);
            }, 300);
        });
    }, 500);
});

/* =========================================
   ЦИТАТА ДНЯ — випадкова при завантаженні
========================================= */

const dailyQuotes = [

    {
        text: "Закон один для всіх.",
        author: "Марк Туллій Цицерон"
    },

    {
        text: "Де немає закону, там немає і свободи.",
        author: "Джон Локк"
    },

    {
        text: "Справедливість — основа всіх чеснот.",
        author: "Цицерон"
    },

    {
        text: "Право — це мистецтво добра і справедливості.",
        author: "Цельс"
    },

    {
        text: "Закон — це формальний вираз волі народу.",
        author: "Жан-Жак Руссо"
    },

    {
        text: "Ніхто не може бути суддею у власній справі.",
        author: "Принцип права"
    },

    {
        text: "Немає права без обов'язку, немає обов'язку без права.",
        author: "Вільям Ґледстон"
    },

    {
        text: "Закон повинен бути коротким, щоб його легко запам'ятали.",
        author: "Сенека"
    },

    {
        text: "Немає нічого важливішого за справедливість.",
        author: "Платон"
    },

    {
        text: "Краще запобігти злочину, ніж карати за нього.",
        author: "Шарль Монтеск'є"
    },

    {
        text: "Право — це свобода, обмежена законом.",
        author: "Еммануїл Кант"
    },

    {
        text: "Там, де закінчується право, починається насильство.",
        author: "Рудольф фон Єрінг"
    }

];


function showDailyQuote() {

    const textEl = document.getElementById("quote-text");
    const authorEl = document.getElementById("quote-author");

    if (!textEl || !authorEl) return;

    // Випадкова цитата
    const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
    const quote = dailyQuotes[randomIndex];

    // Вставляємо текст
    textEl.textContent = quote.text;
    authorEl.textContent = "" + quote.author;
}


// Запускаємо після завантаження
window.addEventListener("DOMContentLoaded", showDailyQuote);

/* =========================================
   ПОРАДА ДНЯ — змінюється автоматично
========================================= */

const dailyTips = [
    "Опишіть ситуацію детально, щоб AI відповів точніше.",
    "Вкажіть дати, суми та сторони — це важливо для аналізу.",
    "Завантажте документ у PDF або DOCX — AI проаналізує його.",
    "Опишіть ситуацію — AI складе позов, скаргу чи клопотання.",
    "Питайте уточнюючі питання — AI пам'ятає ваш діалог.",
    "Чим більше деталей — тим точніша юридична відповідь.",
    "Перевірте документ перед підписанням — AI допоможе.",
    "Не знаєте, як скласти позов? Опишіть ситуацію — AI зробить.",
    "Використовуйте чат для уточнень — історія зберігається.",
    "Знайдіть потрібну статтю закону — запитайте в чаті."
];

let currentTipIndex = 0;

function rotateTip() {
    const tipEl = document.getElementById("sidebar-tip-text");
    if (!tipEl) return;

    tipEl.classList.add("changing");

    setTimeout(() => {
        currentTipIndex = (currentTipIndex + 1) % dailyTips.length;
        tipEl.textContent = dailyTips[currentTipIndex];
        tipEl.classList.remove("changing");
    }, 300);
}

// Змінювати пораду кожні 30 секунд
setInterval(rotateTip, 30000);

// Перша порада при завантаженні — випадкова
window.addEventListener("DOMContentLoaded", function () {
    const tipEl = document.getElementById("sidebar-tip-text");
    if (!tipEl) return;

    const randomIndex = Math.floor(Math.random() * dailyTips.length);
    currentTipIndex = randomIndex;
    tipEl.textContent = dailyTips[randomIndex];
});

/* =========================================
   КНОПКА "ВНИЗ" + СКРОЛ
========================================= */

const scrollBottomBtn = document.getElementById("scroll-bottom-btn");

function checkScrollButton() {
    if (!scrollBottomBtn || !chatBox) return;

    const distanceFromBottom =
        chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight;

    if (distanceFromBottom > 100) {
        scrollBottomBtn.classList.remove("hidden");
    } else {
        scrollBottomBtn.classList.add("hidden");
    }
}

if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener("click", function () {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });
    });
}

if (chatBox) {
    chatBox.addEventListener("scroll", checkScrollButton);
}