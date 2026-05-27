from reportlab.pdfgen import canvas

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
import os


# =========================================
# PDF
# =========================================

def create_pdf(text, filename="document.pdf"):

    folder = "generated"

    os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)

    pdf = canvas.Canvas(filepath)

    pdfmetrics.registerFont(
    TTFont(
        'DejaVu',
        'static/fonts/DejaVuSans.ttf'
    )
)

    pdf.setFont("DejaVu", 14)
    
    y = 800

    for line in text.split("\n"):

        pdf.drawString(50, y, line)

        y -= 25

    pdf.save()

    return filepath


# =========================================
# DOCX
# =========================================

def create_docx(text, filename="document.docx"):

    folder = "generated"

    os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)

    doc = Document()

    for line in text.split("\n"):

        doc.add_paragraph(line)

    doc.save(filepath)

    return filepath