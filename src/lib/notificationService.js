import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma"; // Make sure you have the Prisma client set up
import { sendSMS } from "./smsService"; // Import your SMS service

export const sendNotification = async (userId, message, type) => {
  try {
    let notification;

    // Save notification to the database
    if (type === "DB") {
      notification = await prisma.notification.create({
        data: {
          userId,
          message,
          type,
        },
      });
    }

    // Send SMS notification
    if (type === "SMS") {
      notification = await sendSMS(userId, message); // Replace with actual user phone number
    }

    // Send Email notification
    if (type === "Email") {
      notification = await sendEmailNotification(userId, message); // Replace with actual user email
    }

    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw new Error("Notification sending failed");
  }
};

const sendEmailNotification = async (emailAddresses, message) => {
  // const user = await prisma.user.findUnique({ where: { id: userId } });

  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // secure: process.env.SMTP_PORT === "465", // Secure true for SSL (port 465), false for TLS (port 587)
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // Check if emailAddresses is an array; if not, convert it to an array
  const recipients = Array.isArray(emailAddresses)
    ? emailAddresses
    : [emailAddresses];

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    // to: user.email,
    subject: "New Notification",
    html: emailTemplate(message), // Use the email template
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const emailTemplate = (message) => `
  <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e9f5ff; /* Light background color for a calming effect */
          font-family: 'Arial', sans-serif;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff; /* Primary color */
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header img {
          width: 120px; /* Logo size */
          margin-bottom: 10px;
        }
        .header h1 {
          font-size: 28px;
          margin: 0;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .content h2 {
          color: #333;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .content p {
          line-height: 1.6;
          margin: 0 0 20px;
          color: #555;
          font-size: 16px;
        }
        .content ul {
          padding-left: 20px;
          margin-bottom: 20px;
          list-style-type: disc; /* Bullet points */
        }
        .content li {
          margin-bottom: 10px;
          color: #555;
        }
        .button {
          display: inline-block;
          background-color: #28a745; /* Green for action */
          color: white !important;
          padding: 12px 24px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 10px;
          transition: background-color 0.3s, transform 0.3s;
        }
        .button:hover {
          background-color: #218838; /* Darker green on hover */
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          padding: 15px;
          background-color: #f8f9fa; /* Light footer color */
          font-size: 14px;
          color: #6c757d;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 2px;
          background-color: #007bff; /* Blue divider */
          margin: 20px 0;
        }
        /* Trendy icons */
        .icon {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          vertical-align: middle;
        }
        /* Responsive design */
        @media (max-width: 600px) {
          .container {
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://via.placeholder.com/120" alt="Hospital Logo" />
          <h1>Healthcare Notification</h1>
        </div>
        <div class="content">
          <h2>Dear Patient,</h2>
          <p>${message}</p>
          <div class="divider"></div>
          <h2>What’s New in Our Hospital:</h2>
          <ul>
            <li><img src="https://via.placeholder.com/30" class="icon" alt="Icon 1" /> New Services Available: Telehealth Consultations.</li>
            <li><img src="https://via.placeholder.com/30" class="icon" alt="Icon 2" /> Health Checkup Camp: Free consultations this weekend!</li>
            <li><img src="https://via.placeholder.com/30" class="icon" alt="Icon 3" /> New Specialists Joined: Dr. Smith, Cardiology Expert.</li>
          </ul>
          <a href="#" class="button">View Notifications</a>
        </div>
        <div class="footer">
          <p>Thank you for trusting us with your health!</p>
          <p><a href="#">Visit our website</a> | <a href="#">Unsubscribe</a></p>
        </div>
      </div>
    </body>
  </html>
`;
