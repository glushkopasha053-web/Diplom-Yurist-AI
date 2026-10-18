
# ============================================
# OPENAI + MEMORY
# ============================================

from openai import OpenAI
import os
from app.database import save_knowledge
from app.config import GPT_MODEL
from app.config import GPT_MAX_TOKENS
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
MAX_HISTORY = 35


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


def ask_gpt(user_message, session_id="default"):

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



#  ЗБЕРЕЖЕННЯ У БАЗУ 
    try:
        from app.database import save_knowledge
        save_knowledge(
            title=user_message[:50],          # Заголовок — перші 50 символів питання
            keywords="chat_history",          # Мітка
            content=answer,                   # Відповідь AI
            source="gpt"                      # Джерело
        )
    except Exception as e:
        print("Помилка збереження в базу:", e)
    # -----------------------------------------------------------

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

# ============================================
# ЕКСПОРТ ІСТОРІЇ ЧАТУ У ТЕКСТ
# ============================================

def export_chat_history_text(session_id="default"):
    """
    Форматує історію діалогу сесії у вигляді тексту для генерації PDF/DOCX.
    """
    history = get_history(session_id)
    
    if not history:
        return None

    lines = [
        "ЮРИДИЧНИЙ AI-ПОМІЧНИК — ПРОТОКОЛ КОНСУЛЬТАЦІЇ",
        "=" * 45,
        ""
    ]

    for msg in history:
        role = msg.get("role")
        content = msg.get("content", "").strip()

        if role == "user":
            lines.append(f"👤 КЛІЄНТ:\n{content}\n")
        elif role == "assistant":
            lines.append(f"🤖 ЮРИДИЧНИЙ АСИСТЕНТ:\n{content}\n")
            lines.append("-" * 45 + "\n")

    return "\n".join(lines)
