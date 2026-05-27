


# ============================================
# OPENAI + MEMORY
# ============================================

from openai import OpenAI

from app.database import save_knowledge

import os

# ============================================
# OPENAI CLIENT
# ============================================

client = OpenAI(

    api_key="PASTE_YOUR_KEY_HERE"

)

#api_key = os.getenv("OPENAI_API_KEY")

# ============================================
# GPT ВІДПОВІДЬ
# ============================================

def ask_gpt(user_message):

    response = client.chat.completions.create(

        model="gpt-4.1-mini",
        
        max_tokens=150,

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


    # ============================================
    # АВТОЗБЕРЕЖЕННЯ У БАЗУ
    # ============================================

    save_knowledge(

    title=user_message[:50],

    keywords=user_message.lower(),

    content=answer,

    source="gpt"

)
   