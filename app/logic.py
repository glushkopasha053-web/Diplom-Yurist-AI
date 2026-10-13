# ============================================
# ЛОГІКА AI
# ============================================

from app.database import search_knowledge

from app.gpt_memory import ask_gpt
from app.config import USE_GPT


# ============================================
# ГОЛОВНА ЛОГІКА
# ============================================

def process_user_message(message, session_id="default"):

    print("\n==============================")
    print("КОРИСТУВАЧ:", message)
    print("СЕСІЯ:", session_id)

    # ============================================
    # 1. ПОШУК У БАЗІ
    # ============================================

    result = search_knowledge(message.lower())

    print("РЕЗУЛЬТАТ БАЗИ:", result)

    db_content = None

    if result:
        db_content = result[0]   # content з бази

    # ============================================
    # 2. GPT (завжди, якщо увімкнено)
    # ============================================

    if not USE_GPT:

        # Якщо GPT вимкнено — показуємо тільки базу
        if db_content:
            return f"""
📚 Знайдено у локальній базі:

{db_content}
"""
        return "❌ GPT вимкнено адміністратором."

    print("GPT ЗАПУЩЕНО")

    try:

        gpt_answer = ask_gpt(
            user_message=message,
            session_id=session_id,
            context_from_db=db_content
        )

    except Exception as error:

        # Якщо GPT впав, але є база — повертаємо базу
        if db_content:
            return f"""
📚 Знайдено у локальній базі:

{db_content}

⚠ GPT тимчасово недоступний:
{error}
"""

        return f"❌ Помилка GPT:\n{error}"

    # ============================================
    # 3. ФОРМУЄМО КОМБІНОВАНУ ВІДПОВІДЬ
    # ============================================

    if db_content:
        return f"""
📚 З локальної бази:

{db_content}

━━━━━━━━━━━━━━━━━━━━━━

🤖 Відповідь GPT:

{gpt_answer}
"""

    # Якщо база нічого не знайшла — тільки GPT
    return f"""
🤖 Відповідь GPT:

{gpt_answer}
"""