# ============================================
# FLASK
# ============================================

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask import send_file
from app.document_generator import create_pdf, create_docx
from app.document_checker import extract_document_text
from app.gpt_memory import analyze_document, generate_legal_document

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
    session_id = data.get("session_id", "default")

    answer = process_user_message(user_message, session_id)

    return jsonify({"answer": answer})

# ============================================
# API: ОЧИСТИТИ ІСТОРІЮ ЧАТУ
# ============================================

@app.route("/api/clear-chat", methods=["POST"])
def clear_chat():

    from app.gpt_memory import clear_history

    data = request.get_json() or {}
    session_id = data.get("session_id", "default")

    clear_history(session_id)

    return jsonify({"success": True})

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

@app.route("/download-pdf", methods=["POST"])
def download_pdf():

    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    filename = (data.get("filename") or "document").strip()

    if not text:
        return jsonify({
            "success": False,
            "error": "Порожній текст документа."
        }), 400

    filename = "".join(
        c for c in filename if c.isalnum() or c in "-_"
    ) or "document"

    filepath = create_pdf(text, f"{filename}.pdf")

    return send_file(filepath, as_attachment=True)


# =========================================
# DOCX
# =========================================

@app.route("/download-docx", methods=["POST"])
def download_docx():

    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    filename = (data.get("filename") or "document").strip()

    if not text:
        return jsonify({
            "success": False,
            "error": "Порожній текст документа."
        }), 400

    filename = "".join(
        c for c in filename if c.isalnum() or c in "-_"
    ) or "document"

    filepath = create_docx(text, f"{filename}.docx")

    return send_file(filepath, as_attachment=True)


# ============================================
# API: ПЕРЕВІРКА ЮРИДИЧНОГО ДОКУМЕНТА
# ============================================

@app.route("/api/check-document", methods=["POST"])
def check_document():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "error": "Виберіть PDF або DOCX для перевірки."
        }), 400

    uploaded_file = request.files["file"]

    try:
        document_text = extract_document_text(uploaded_file)

        return jsonify({
            "success": True,
            "filename": uploaded_file.filename,
            "text": document_text,
            "message": "Документ прочитано. Можна переходити до юридичного аналізу."
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception:
        app.logger.exception("Помилка обробки юридичного документа")

        return jsonify({
            "success": False,
            "error": "Не вдалося обробити документ. Спробуйте інший файл."
        }), 500


# ============================================
# API: ЮРИДИЧНИЙ АНАЛІЗ ДОКУМЕНТА
# ============================================

@app.route("/api/analyze-document", methods=["POST"])
def analyze_document_route():

    data = request.get_json()
    document_text = (data or {}).get("text", "").strip()

    if not document_text:
        return jsonify({
            "success": False,
            "error": "Текст документа порожній."
        }), 400

    try:
        analysis = analyze_document(document_text)

        return jsonify({
            "success": True,
            "analysis": analysis
        })

    except Exception as error:
        app.logger.exception("Помилка юридичного аналізу")
        return jsonify({
            "success": False,
            "error": f"Помилка аналізу: {error}"
        }), 500


# ============================================
# API: ГЕНЕРАЦІЯ ЮРИДИЧНОГО ДОКУМЕНТА (AI сам обирає тип)
# ============================================

@app.route("/api/generate-document", methods=["POST"])
def generate_document_route():

    data = request.get_json() or {}
    situation = (data.get("situation") or "").strip()

    if not situation:
        return jsonify({
            "success": False,
            "error": "Опишіть ситуацію."
        }), 400

    if len(situation) < 10:
        return jsonify({
            "success": False,
            "error": "Опис занадто короткий. Додайте деталі."
        }), 400

    try:
        document_text = generate_legal_document(situation)

        return jsonify({
            "success": True,
            "document": document_text
        })

    except Exception as error:
        app.logger.exception("Помилка генерації документа")
        return jsonify({
            "success": False,
            "error": f"Помилка генерації: {error}"
        }), 500

# ============================================
# START
# ============================================

if __name__ == "__main__":

    app.run(debug=True)