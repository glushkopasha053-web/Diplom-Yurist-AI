# ============================================
# FLASK
# ============================================

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask import send_file
from app.document_generator import create_pdf, create_docx

from app.logic import process_user_message
# Weather
from app.weather import get_weather
from app.news import get_news



# ============================================
# FLASK APP
# ============================================

app = Flask(__name__)


# ============================================
# HOME
# ============================================

@app.route("/")
def home():

    return render_template("index.html")


# ============================================
# API CHAT
# ============================================

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "")

    answer = process_user_message(

        user_message

    )

    return jsonify({

        "answer": answer

    })

# ============================================
# API WEATHER
# ============================================

@app.route("/api/weather")
def weather():

    # ----------------------------------------
    # МІСТО
    # ----------------------------------------

    city = request.args.get(

        "city",

        "Кривий Ріг"

    )

    # ----------------------------------------
    # ПОГОДА
    # ----------------------------------------

    result = get_weather(city)

    # ----------------------------------------
    # JSON
    # ----------------------------------------

    return jsonify(result)

# ============================================
# NEWS API ROUTE
# ============================================

@app.route("/api/news")

def news_api():

    news = get_news()

    return jsonify(news)


# =========================================
# PDF
# =========================================

@app.route("/download-pdf/<doc_type>")
def download_pdf(doc_type):

    text = ""

    # ПОЗОВ
    if doc_type == "lawsuit":

        text = """
ПОЗОВНА ЗАЯВА

До суду:

Позивач:

Відповідач:

Суть позову:

Дата:
Підпис:
"""

    # СКАРГА
    elif doc_type == "complaint":

        text = """
СКАРГА

Я, __________________

повідомляю про:

_____________________

Прошу:

_____________________

Дата:
Підпис:
"""

    # КЛОПОТАННЯ
    elif doc_type == "motion":

        text = """
КЛОПОТАННЯ

Прошу суд:

_____________________

Обґрунтування:

_____________________

Дата:
Підпис:
"""

    # ПОЛІЦІЯ
    elif doc_type == "police":

        text = """
ЗАЯВА ДО ПОЛІЦІЇ

Прошу внести відомості до ЄРДР.

Обставини:

_____________________

Дата:
Підпис:
"""

    filepath = create_pdf(text, f"{doc_type}.pdf")

    return send_file(filepath, as_attachment=True)


# =========================================
# DOCX
# =========================================

@app.route("/download-docx/<doc_type>")
def download_docx(doc_type):

    text = ""

    if doc_type == "lawsuit":

        text = """
ПОЗОВНА ЗАЯВА

До суду:

Позивач:

Відповідач:

Суть позову:
"""

    elif doc_type == "complaint":

        text = """
СКАРГА

Я, __________________

повідомляю про:
"""

    elif doc_type == "motion":

        text = """
КЛОПОТАННЯ

Прошу суд:
"""

    elif doc_type == "police":

        text = """
ЗАЯВА ДО ПОЛІЦІЇ

Прошу внести відомості до ЄРДР.
"""

    filepath = create_docx(text, f"{doc_type}.docx")

    return send_file(filepath, as_attachment=True)


# ============================================
# START
# ============================================

if __name__ == "__main__":

    app.run(debug=True)