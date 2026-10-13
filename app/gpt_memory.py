
# ============================================
# OPENAI + MEMORY
# ============================================

from openai import OpenAI

from app.database import save_knowledge

import os
import re 
from app.config import GPT_MODEL
from app.config import GPT_MAX_TOKENS
from app.config import SAVE_GPT_ANSWERS
from dotenv import load_dotenv
from app.config import GPT_ANALYSIS_TOKENS  
    
# ============================================
# OPENAI CLIENT
# ============================================
load_dotenv()

client = OpenAI(

    api_key = os.getenv("OPENAI_API_KEY")

)

# ============================================
# ІСТОРІЯ ДІАЛОГУ (пам'ять чату)
# ============================================

# Словник: session_id -> список повідомлень
chat_history = {}

# Максимум повідомлень у пам'яті (щоб не переповнити токени)
MAX_HISTORY = 10


def get_history(session_id):
    """Повертає історію діалогу для сесії."""
    return chat_history.get(session_id, [])


def add_to_history(session_id, role, content):
    """Додає повідомлення в історію."""
    if session_id not in chat_history:
        chat_history[session_id] = []

    chat_history[session_id].append({
        "role": role,
        "content": content
    })

    # Обрізаємо до MAX_HISTORY
    if len(chat_history[session_id]) > MAX_HISTORY:
        chat_history[session_id] = chat_history[session_id][-MAX_HISTORY:]


def clear_history(session_id):
    """Очищає історію для сесії."""
    chat_history.pop(session_id, None)


def ask_gpt(user_message, session_id="default", context_from_db=None):

    # ============================================
    # ФОРМУЄМО ПОВІДОМЛЕННЯ
    # ============================================

    # Системний prompt
    system_content = """
Ти юридичний AI-помічник України.

Відповідай коротко,
професійно,
юридично грамотно.

Пам'ятай попередні повідомлення користувача
та підтримуй контекст діалогу.
"""

    messages = [
        {"role": "system", "content": system_content}
    ]

    # Додаємо контекст з бази (якщо є)
    if context_from_db:
        messages.append({
            "role": "system",
            "content": (
                "Додаткова інформація з локальної бази знань "
                f"(використай її, якщо доречно):\n\n{context_from_db}"
            )
        })

    # Додаємо історію діалогу
    messages.extend(get_history(session_id))

    # Додаємо поточне повідомлення
    messages.append({
        "role": "user",
        "content": user_message
    })

    # ============================================
    # ЗАПИТ ДО GPT
    # ============================================

    response = client.chat.completions.create(
        model=GPT_MODEL,
        max_tokens=GPT_MAX_TOKENS,
        messages=messages
    )

    answer = response.choices[0].message.content

    if not answer:
        answer = "Не вдалося отримати відповідь. Спробуйте ще раз."

    # ============================================
    # ЗБЕРІГАЄМО В ІСТОРІЮ
    # ============================================

    add_to_history(session_id, "user", user_message)
    add_to_history(session_id, "assistant", answer)

    # ============================================
    # КЛЮЧОВІ СЛОВА (для збереження в базу)
    # ============================================

    clean_text = re.sub(r"[^\w\s]", " ", user_message.lower())
    words = clean_text.split()

    stop_words = {
        "як", "що", "де", "коли", "для", "та", "і",
        "в", "на", "про", "це", "чи", "у", "з", "по",
        "до", "від", "за", "або", "але", "не", "ні",
        "мені", "мене", "мій", "моя", "моє", "я",
        "ти", "він", "вона", "воно", "ми", "ви", "вони",
        "хочу", "можна", "треба", "потрібно", "поясни",
        "розкажи", "допоможи", "будь", "ласка",
        "подати", "подай", "подаю", "подається",
        "отримати", "отримаю", "зробити", "зроби",
    }

    endings = [
        "ами", "ями", "ові", "еві", "ого", "ому",
        "ою", "ею", "ий", "ій", "ої",
        "ах", "ях", "ам", "ям", "ів", "їв",
        "а", "я", "у", "ю", "и", "і", "е", "о",
    ]

    keywords_list = []

    for word in words:
        if word in stop_words or len(word) <= 3:
            continue

        for ending in endings:
            if word.endswith(ending) and len(word) - len(ending) >= 4:
                word = word[:-len(ending)]
                break

        keywords_list.append(word)

    keywords = ",".join(
        list(dict.fromkeys(keywords_list))[:10]
    )

    # ============================================
    # АВТОЗБЕРЕЖЕННЯ У БАЗУ
    # ============================================

    if SAVE_GPT_ANSWERS:
        save_knowledge(
            title=user_message[:50],
            keywords=keywords,
            content=answer,
            source="gpt"
        )

    return answer
# ============================================
# ЮРИДИЧНИЙ АНАЛІЗ ДОКУМЕНТА
# ============================================

def analyze_document(document_text):

    document_text = document_text[:15000]

    system_prompt = """
Ти — професійний юридичний AI-аналітик України.

Проаналізуй наданий юридичний документ та надай
структурований аналіз УКРАЇНСЬКОЮ мовою.

Структура відповіді (обов'язково дотримуйся):

1. 📌 СУТЬ ДОКУМЕНТА
2. ⚖ ГАЛУЗЬ ПРАВА
3. 📚 РЕЛЕВАНТНІ НОРМИ ЗАКОНОДАВСТВА УКРАЇНИ
4. ⚠ ВИЯВЛЕНІ ПОРУШЕННЯ АБО РИЗИКИ
5. ✅ РЕКОМЕНДАЦІЇ ТА ПОДАЛЬШІ ДІЇ

Посилайся на реальні статті Кодексів та Законів України.
Якщо документ не юридичний — скажи прямо.
"""

    response = client.chat.completions.create(
        model=GPT_MODEL,
        max_tokens=GPT_ANALYSIS_TOKENS,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Проаналізуй документ:\n\n{document_text}"}
        ]
    )

    return response.choices[0].message.content
        
    

# ============================================
# ГЕНЕРАЦІЯ ЮРИДИЧНОГО ДОКУМЕНТА (AI сам обирає тип)
# ============================================

def generate_legal_document(situation):

    system_prompt = """
Ти — професійний юрист України.

Завдання:
1. Уважно прочитай ситуацію користувача.
2. САМ визнач, який юридичний документ потрібен:
   - позовна заява
   - клопотання
   - скарга
   - заява до поліції
   - адміністративний позов
   - апеляційна скарга
   - заява до прокуратури
   - скарга до Уповноваженого ВРУ з прав людини
   - тощо
3. Склади готовий документ.

Вимоги до документа:
- Пиши УКРАЇНСЬКОЮ мовою.
- Офіційно-діловий стиль.
- Посилайся на реальні норми законодавства України
  (Конституція, Кодекси, Закони).
- Структура обов'язкова:
  1. Назва документа (по центру)
  2. Кому подається (суд / орган / посадова особа)
  3. Дані заявника (залиш підкреслення, якщо невідомо)
  4. Опис обставин справи (з ситуації користувача)
  5. Правове обґрунтування (конкретні статті)
  6. ПРОШУ: (прохальна частина)
  7. Перелік додатків
  8. Дата та підпис

НЕ додавай жодних пояснень, коментарів чи вступів —
тільки сам текст документа, готовий до друку.
"""

    response = client.chat.completions.create(
        model=GPT_MODEL,
        max_tokens=2000,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Ситуація:\n\n{situation}"}
        ]
    )

    return response.choices[0].message.content