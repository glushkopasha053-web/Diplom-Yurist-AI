# ============================================
# SQLITE DATABASE
# ============================================

import sqlite3
import os
import re

# ============================================
# ПІДКЛЮЧЕННЯ
# ============================================

def connect_db():

    BASE_DIR = os.path.dirname(

        os.path.dirname(os.path.abspath(__file__))

    )

    db_path = os.path.join(BASE_DIR, "ai.db")

    print("БАЗА:", db_path)

    return sqlite3.connect(db_path)


# ============================================
# ДОДАВАННЯ ДАНИХ
# ============================================

def save_knowledge(title, keywords, content, source):

    conn = connect_db()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO knowledge (

        title,
        keywords,
        content,
        source

    )

    VALUES (?, ?, ?, ?)

    """, (

        title,
        keywords,
        content,
        source

    ))

    conn.commit()

    conn.close()


# ============================================
# ПОШУК (покращений)
# ============================================

def search_knowledge(user_message):

    conn = connect_db()
    cursor = conn.cursor()

    # -------------------------------------------------
    # 1. Розбиваємо запит на слова
    # -------------------------------------------------

    words = re.findall(r"\w+", user_message.lower())

    # -------------------------------------------------
    # 2. Прибираємо стоп-слова та короткі слова
    # -------------------------------------------------

    stop_words = {
        "як", "що", "де", "коли", "для", "та", "і",
        "в", "на", "про", "це", "чи", "у", "з", "по",
        "до", "від", "за", "або", "але", "не", "ні",
        "мені", "мене", "мій", "моя", "моє", "я",
        "ти", "він", "вона", "воно", "ми", "ви", "вони",
        "хочу", "можна", "треба", "потрібно",
        
        # ДІЄСЛОВА-ЗАГАЛЬНІ (щоб не плутали пошук)
        "подати", "подай", "подаю", "подається",
        "отримати", "отримаю", "зробити", "зроби",
        "оформити", "оформлю", "написати", "напишу",
        "скласти", "складу", "допоможіть", "допоможи",
        "підкажіть", "підкажи", "розкажіть", "розкажи",
        
    }

    keywords = [
        w for w in words
        if w not in stop_words and len(w) > 3
    ]

    if not keywords:
        conn.close()
        return None

    # -------------------------------------------------
    # 3. Шукаємо по ВСІХ словах, а не по першому
    #    і рахуємо, скільки збігів у кожного запису
    # -------------------------------------------------

    # SQL: для кожного keyword робимо LIKE
    # і сумуємо кількість збігів

    conditions = " OR ".join(
        ["LOWER(keywords) LIKE ? OR LOWER(title) LIKE ? OR LOWER(content) LIKE ?"]
        * len(keywords)
    )

    params = []
    for word in keywords:
        like = f"%{word}%"
        params.extend([like, like, like])

    cursor.execute(f"""
        SELECT
            content,
            title,
            (
                {" + ".join(
                    ["(CASE WHEN LOWER(keywords) LIKE ? THEN 2 ELSE 0 END) + "
                     "(CASE WHEN LOWER(title) LIKE ? THEN 1 ELSE 0 END) + "
                     "(CASE WHEN LOWER(content) LIKE ? THEN 0.5 ELSE 0 END)"]
                    * len(keywords)
                )}
            ) AS score
        FROM knowledge
        WHERE {conditions}
        ORDER BY score DESC
        LIMIT 1
    """, params + params)

    result = cursor.fetchone()

    # ---- ДОДАНИЙ ЗАХИСТ ВІД ПЛУТАНИНИ ТЕМ ----
    if result:
        content, title, score = result
        user_lower = user_message.lower()
        content_lower = content.lower()

        if "тцк" in user_lower and "поліці" in content_lower and "тцк" not in content_lower:
            conn.close()
            return None
        if "поліці" in user_lower and "тцк" in content_lower and "поліці" not in content_lower:
            conn.close()
            return None

    conn.close()

    return result