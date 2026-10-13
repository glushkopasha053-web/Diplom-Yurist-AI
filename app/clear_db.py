import sqlite3
import os

# Шлях до бази
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)
db_path = os.path.join(BASE_DIR, "ai.db")

print("База:", db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Видаляємо тільки записи від GPT
cursor.execute("DELETE FROM knowledge")

conn.commit()
print("Видалено записів:", conn.total_changes)

conn.close()