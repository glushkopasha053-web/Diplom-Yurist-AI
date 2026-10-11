
# ============================================
# OPENAI + MEMORY
# ============================================

from openai import OpenAI

from app.database import save_knowledge

import os
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
# GPT ВІДПОВІДЬ
# ============================================

def ask_gpt(user_message):

    response = client.chat.completions.create(

    model=GPT_MODEL,

    max_tokens=GPT_MAX_TOKENS,

        messages=[

            {
                "role": "system",
                "content": """

Ти юридичний AI-помічник України.

Відповідай коротко,
професійно,
юридично грамотно.

"""
            },

            {
                "role": "user",
                "content": user_message
            }

        ]

    )

    answer = response.choices[0].message.content

    words = user_message.lower().split()

    stop_words = [
    "як", "що", "де", "коли", "для",
    "та", "і", "в", "на", "про",
    "це", "чи", "у","поясни","можна",
    "треба"
]

    keywords_list = []

    for word in words:

        if word  in stop_words or len(word) <= 3:
            continue

        word = word.lower()

        for ending in [
            "ами",
            "ями",
            "ого",
            "ому",
            "ою",
            "ею",
            "ий",
            "ій",
            "а",
            "я",
            "у",
            "ю",
            "и",
            "і"
        ]:

            if word.endswith(ending) and len(word) > 5:

                word = word[:-len(ending)]
                break

        keywords_list.append(word)

    keywords = ",".join(list(dict.fromkeys(keywords_list))[:10])
        
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