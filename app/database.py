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
# ПОШУК
# ============================================

def search_knowledge(user_message):

    conn = connect_db()
    cursor = conn.cursor()

    words = re.findall(r"\w+", user_message.lower())

    for word in words:

        cursor.execute("""

        SELECT content
        FROM knowledge

        WHERE LOWER(keywords) LIKE ?

        LIMIT 1

        """, (

            "%" + word + "%",

        ))

        result = cursor.fetchone()

        if result:

            conn.close()
            return result

    conn.close()

    return None
