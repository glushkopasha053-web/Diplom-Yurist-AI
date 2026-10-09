
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
