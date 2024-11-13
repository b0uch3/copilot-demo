from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
import base64

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    to: str
    subject: str
    text: str
    chartImage: str

@app.post("/send-email")
async def send_email(request: EmailRequest):
    to = request.to
    subject = request.subject
    text = request.text
    chart_image = request.chartImage

    print("SEND EMAIL WORKS", {"to": to, "chartImage": chart_image})

    # Create a multipart message
    msg = MIMEMultipart()
    msg['From'] = "test@resend.dev"  # Use environment variable if needed
    msg['To'] = to
    msg['Subject'] = "your chart image"

    # Attach the body with the msg instance
    msg.attach(MIMEText("your chart is attached", 'plain'))

    # Attach the image
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(base64.b64decode(chart_image.split("base64,")[1]))
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment; filename=chart.png')
    msg.attach(part)

    try:
        # Create SMTP session for sending the mail
        server = smtplib.SMTP('smtp.resend.com', 587)  # Replace with Resend SMTP host and port
        server.starttls()
        server.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASS'))  # Use environment variables for credentials
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        server.quit()
        return {"message": "Email sent successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv('PORT', 3000))
    uvicorn.run(app, host='localhost', port=port)