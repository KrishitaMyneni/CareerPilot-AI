import io
from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = []
    pdf_file = io.BytesIO(file_bytes)
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        text.append(page.extract_text())
    return "\n".join(text)


def extract_text_from_docx(file_bytes: bytes) -> str:
    text = []
    docx_file = io.BytesIO(file_bytes)
    doc = Document(docx_file)
    for para in doc.paragraphs:
        text.append(para.text)
    return "\n".join(text)
