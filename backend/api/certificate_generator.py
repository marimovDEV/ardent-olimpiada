"""
Certificate PDF Generator - Kreativ Dizayn
Generates beautiful, professional certificates with QR codes
"""
import os
import io
import qrcode
from datetime import datetime
from django.conf import settings
from django.core.files.base import ContentFile

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import cm, mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader


class CertificateGenerator:
    """Generate professional PDF certificates with QR verification"""
    
    # Certificate dimensions (A4 Landscape)
    PAGE_WIDTH, PAGE_HEIGHT = landscape(A4)
    
    # Colors
    PRIMARY_COLOR = colors.HexColor('#7C3AED')  # Purple
    SECONDARY_COLOR = colors.HexColor('#4F46E5')  # Indigo
    GOLD_COLOR = colors.HexColor('#F59E0B')  # Amber/Gold
    TEXT_COLOR = colors.HexColor('#1F2937')  # Dark gray
    LIGHT_TEXT = colors.HexColor('#6B7280')  # Muted text
    
    def __init__(self, certificate):
        self.cert = certificate
        self.buffer = io.BytesIO()
        self.c = canvas.Canvas(self.buffer, pagesize=landscape(A4))
        
    def generate(self):
        """Generate the full certificate PDF"""
        self._draw_background()
        self._draw_border()
        self._draw_header()
        self._draw_recipient()
        self._draw_course_info()
        self._draw_grade()
        self._draw_qr_code()
        self._draw_footer()
        self._draw_signatures()
        
        self.c.save()
        self.buffer.seek(0)
        return self.buffer
    
    def _draw_background(self):
        """Draw gradient-like background with decorative elements"""
        c = self.c
        
        # Light gradient effect with rectangles
        for i in range(20):
            alpha = 0.02 - (i * 0.001)
            c.setFillColor(colors.Color(0.486, 0.227, 0.929, alpha))
            c.rect(0, self.PAGE_HEIGHT - (i * 20), self.PAGE_WIDTH, 20, fill=True, stroke=False)
        
        # Decorative corner patterns
        c.setStrokeColor(self.PRIMARY_COLOR)
        c.setStrokeAlpha(0.1)
        c.setLineWidth(2)
        
        # Top left corner
        for i in range(5):
            c.arc(20 + i*15, self.PAGE_HEIGHT - 80 - i*15, 80 + i*15, self.PAGE_HEIGHT - 20 + i*15, 0, 90)
        
        # Bottom right corner
        for i in range(5):
            c.arc(self.PAGE_WIDTH - 80 - i*15, 20 - i*15, self.PAGE_WIDTH - 20 + i*15, 80 + i*15, 180, 270)
        
        c.setStrokeAlpha(1)
        
    def _draw_border(self):
        """Draw elegant double border"""
        c = self.c
        margin = 25
        
        # Outer border
        c.setStrokeColor(self.GOLD_COLOR)
        c.setLineWidth(3)
        c.roundRect(margin, margin, self.PAGE_WIDTH - 2*margin, self.PAGE_HEIGHT - 2*margin, 15)
        
        # Inner border
        c.setStrokeColor(self.PRIMARY_COLOR)
        c.setLineWidth(1)
        c.roundRect(margin + 10, margin + 10, self.PAGE_WIDTH - 2*margin - 20, self.PAGE_HEIGHT - 2*margin - 20, 10)
        
    def _draw_header(self):
        """Draw certificate header with logo and title"""
        c = self.c
        center_x = self.PAGE_WIDTH / 2
        
        # Logo placeholder (circular)
        c.setFillColor(self.PRIMARY_COLOR)
        c.circle(center_x, self.PAGE_HEIGHT - 80, 30, fill=True, stroke=False)
        
        # "A" letter in logo
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 32)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 92, "A")
        
        # Platform name
        c.setFillColor(self.TEXT_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 125, "ARDENT OLIMPIADA")
        
        # Certificate type
        cert_type_text = self._get_type_text()
        c.setFillColor(self.PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 165, cert_type_text)
        
        # Decorative line
        c.setStrokeColor(self.GOLD_COLOR)
        c.setLineWidth(2)
        c.line(center_x - 100, self.PAGE_HEIGHT - 180, center_x + 100, self.PAGE_HEIGHT - 180)
        
    def _get_type_text(self):
        """Get certificate type display text"""
        type_map = {
            'COURSE': 'KURS SERTIFIKATI',
            'OLYMPIAD': 'OLIMPIADA SERTIFIKATI', 
            'DIPLOMA': 'FAXRIY DIPLOM'
        }
        return type_map.get(self.cert.cert_type, 'SERTIFIKAT')
    
    def _draw_recipient(self):
        """Draw recipient name with decorative elements"""
        c = self.c
        center_x = self.PAGE_WIDTH / 2
        
        # "This certifies that" text
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 12)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 220, "Ushbu sertifikat quyidagi shaxsga berildi:")
        
        # Recipient name - LARGE
        user_name = self.cert.user.get_full_name() or self.cert.user.username
        c.setFillColor(self.TEXT_COLOR)
        c.setFont("Helvetica-Bold", 36)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 265, user_name.upper())
        
        # Decorative underline
        name_width = c.stringWidth(user_name.upper(), "Helvetica-Bold", 36)
        c.setStrokeColor(self.GOLD_COLOR)
        c.setLineWidth(2)
        c.line(center_x - name_width/2, self.PAGE_HEIGHT - 275, center_x + name_width/2, self.PAGE_HEIGHT - 275)
        
    def _draw_course_info(self):
        """Draw course/olympiad information"""
        c = self.c
        center_x = self.PAGE_WIDTH / 2
        
        # "For completing" text
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 12)
        
        if self.cert.cert_type == 'OLYMPIAD':
            c.drawCentredString(center_x, self.PAGE_HEIGHT - 310, "quyidagi olimpiadada muvaffaqiyatli ishtirok etgani uchun:")
        else:
            c.drawCentredString(center_x, self.PAGE_HEIGHT - 310, "quyidagi kursni muvaffaqiyatli tugatgani uchun:")
        
        # Course/Olympiad title
        title = self.cert.title
        c.setFillColor(self.SECONDARY_COLOR)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(center_x, self.PAGE_HEIGHT - 345, f'"{title}"')
        
    def _draw_grade(self):
        """Draw grade/score with decorative badge"""
        c = self.c
        center_x = self.PAGE_WIDTH / 2
        
        # Grade badge background
        badge_y = self.PAGE_HEIGHT - 400
        c.setFillColor(self.PRIMARY_COLOR)
        c.roundRect(center_x - 60, badge_y - 25, 120, 50, 10, fill=True, stroke=False)
        
        # Grade text
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(center_x, badge_y - 8, self.cert.grade)
        
        # Score label
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 10)
        c.drawCentredString(center_x, badge_y - 40, "Natija")
        
    def _draw_qr_code(self):
        """Generate and draw QR code for verification"""
        c = self.c
        
        # Generate QR code
        verify_url = f"https://ardent.uz/certificate/verify/{self.cert.cert_number}"
        qr = qrcode.QRCode(version=1, box_size=10, border=2)
        qr.add_data(verify_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        qr_buffer = io.BytesIO()
        qr_img.save(qr_buffer, format='PNG')
        qr_buffer.seek(0)
        
        # Draw QR code
        qr_size = 70
        qr_x = self.PAGE_WIDTH - 120
        qr_y = 60
        c.drawImage(ImageReader(qr_buffer), qr_x, qr_y, width=qr_size, height=qr_size)
        
        # QR label
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 8)
        c.drawCentredString(qr_x + qr_size/2, qr_y - 12, "Tekshirish uchun skanerlang")
        
        # Certificate number
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(self.PRIMARY_COLOR)
        c.drawCentredString(qr_x + qr_size/2, qr_y - 25, self.cert.cert_number)
        
    def _draw_footer(self):
        """Draw footer with date"""
        c = self.c
        center_x = self.PAGE_WIDTH / 2
        
        # Issue date
        issue_date = self.cert.issued_at.strftime("%d %B %Y")
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 11)
        c.drawCentredString(center_x, 90, f"Berilgan sana: {issue_date}")
        
        # Validity text
        c.setFont("Helvetica", 9)
        c.drawCentredString(center_x, 70, "Ushbu sertifikat cheksiz muddatga amal qiladi")
        
    def _draw_signatures(self):
        """Draw signature lines"""
        c = self.c
        
        # Left signature (Platform Director)
        left_x = 150
        sig_y = 130
        
        c.setStrokeColor(self.LIGHT_TEXT)
        c.setLineWidth(1)
        c.line(left_x - 50, sig_y, left_x + 50, sig_y)
        
        c.setFillColor(self.TEXT_COLOR)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(left_x, sig_y - 15, "Direktor")
        
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 9)
        c.drawCentredString(left_x, sig_y - 28, "Ardent Olimpiada")
        
        # Right signature (Teacher/Verifier) 
        right_x = self.PAGE_WIDTH - 150
        
        c.setStrokeColor(self.LIGHT_TEXT)
        c.line(right_x - 50, sig_y, right_x + 50, sig_y)
        
        verifier = "O'qituvchi"
        if self.cert.verified_by:
            verifier = self.cert.verified_by.get_full_name() or self.cert.verified_by.username
        
        c.setFillColor(self.TEXT_COLOR)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(right_x, sig_y - 15, verifier)
        
        c.setFillColor(self.LIGHT_TEXT)
        c.setFont("Helvetica", 9)
        c.drawCentredString(right_x, sig_y - 28, "Tasdiqladi")


def generate_certificate_pdf(certificate):
    """
    Main function to generate certificate PDF
    Returns the PDF as ContentFile for saving to model
    """
    generator = CertificateGenerator(certificate)
    pdf_buffer = generator.generate()
    
    filename = f"certificate_{certificate.cert_number}.pdf"
    return ContentFile(pdf_buffer.read(), name=filename)


def generate_qr_code(certificate):
    """
    Generate QR code image for certificate verification
    Returns ContentFile for saving to model
    """
    verify_url = f"https://ardent.uz/certificate/verify/{certificate.cert_number}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(verify_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#7C3AED", back_color="white")
    
    buffer = io.BytesIO()
    qr_img.save(buffer, format='PNG')
    buffer.seek(0)
    
    filename = f"qr_{certificate.cert_number}.png"
    return ContentFile(buffer.read(), name=filename)
