# ============================================
# SQLITE DATABASE
# ============================================

import sqlite3
import os


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
# ПОШУК
# ============================================

def search_knowledge(user_message):

    conn = connect_db()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT content
    FROM knowledge

    WHERE LOWER(keywords) LIKE LOWER(?)

    LIMIT 1

    """, (

        "%" + user_message.strip() + "%",

    ))

    result = cursor.fetchone()

    conn.close()

    return result
