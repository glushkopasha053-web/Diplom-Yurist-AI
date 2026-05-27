# ============================================
# NEWS API
# ============================================

import requests


# ============================================
# API KEY
# ============================================

API_KEY = "602ec8b16c6245a198943d7e1a9309dd"


# ============================================
# ОТРИМАТИ НОВИНИ
# ============================================

def get_news():

    # ----------------------------------------
    # URL
    # ----------------------------------------

    url = (

        f"https://newsapi.org/v2/everything"
        f"?q=закон OR суд OR адвокат"
        f"&language=uk"
        f"&sortBy=publishedAt"
        f"&pageSize=5"
        f"&apiKey={API_KEY}"

    )

    try:

        response = requests.get(url, timeout=10)

        data = response.json()

    except Exception as e:

        print("ПОМИЛКА NEWS API:", e)

        return [
        {
            "title": "Новини тимчасово недоступні",
            "source": "System"
        }
    ]

    # ----------------------------------------
    # СПИСОК НОВИН
    # ----------------------------------------

    articles = []

    # ----------------------------------------
    # LOOP
    # ----------------------------------------

    for article in data["articles"]:

        articles.append({

            "title": article["title"],

            "source": article["source"]["name"],

            "url": article["url"]

        })

    # ----------------------------------------
    # RETURN
    # ----------------------------------------

    return articles
