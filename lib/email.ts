import nodemailer from "nodemailer";

/**
 * Email configuration and templates
 * Configure SMTP in .env
 */

export interface EmailTemplate {
  subject: string;
  body: (data: any) => string;
}

export const emailTemplates: Record<string, EmailTemplate> = {
  RECRUITER_APPROVAL: {
    subject: "Your Recruiter Account has been Approved",
    body: (data) => `
    <h2>Welcome to T&P Portal</h2>
    <p>Hello ${data.recruiterName},</p>
    <p>Your recruiter account for ${data.company} has been approved by the T&P Admin.</p>
    <p>You can now login and start posting job opportunities:</p>
    <p><a href="${data.portalUrl}/login">Login to Portal</a></p>
    <p>If you have any questions, please contact the T&P office.</p>
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  JOB_POSTED: {
    subject: "New Job Opportunity: {{jobTitle}} at {{company}}",
    body: (data) => `
    <h2>New Job Posting Available</h2>
    <p>Dear Student,</p>
    <p>A new job opportunity is now available for your branch:</p>
    <p><strong>${data.jobTitle}</strong> at ${data.company}</p>
    <p><strong>CTC:</strong> ₹${data.ctc} LPA</p>
    <p><strong>Minimum CGPA:</strong> ${data.minCgpa}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Description:</strong> ${data.description.substring(0, 200)}...</p>
    <p><a href="${data.portalUrl}/student/jobs/${data.jobId}">View Full Details & Apply</a></p>
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  APPLICATION_SHORTLISTED: {
    subject: "Great News! You have been Shortlisted",
    body: (data) => `
    <h2>Shortlisted for Interview</h2>
    <p>Congratulations ${data.studentName}!</p>
    <p>Your application for ${data.jobTitle} at ${data.company} has been shortlisted.</p>
    <p>Please wait for interview round details.</p>
    <p><a href="${data.portalUrl}/student/applications">View Your Applications</a></p>
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  ROUND_SCHEDULED: {
    subject: "Interview Round Scheduled: {{roundName}}",
    body: (data) => `
    <h2>Interview Round Scheduled</h2>
    <p>Dear ${data.studentName},</p>
    <p>An interview round has been scheduled for ${data.jobTitle}:</p>
    <p><strong>Round:</strong> ${data.roundName}</p>
    <p><strong>Date:</strong> ${data.date}</p>
    <p><strong>Time:</strong> ${data.time || "TBD"}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Notes:</strong> ${data.notes || "N/A"}</p>
    <p><a href="${data.portalUrl}/student/interviews">View Interview Schedule</a></p>
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  SELECTED: {
    subject: "🎉 You have been Selected!",
    body: (data) => `
    <h2>Congratulations! You are Selected</h2>
    <p>Dear ${data.studentName},</p>
    <p>We are pleased to inform you that you have been selected for ${data.jobTitle} at ${data.company}.</p>
    <p>You will receive your offer letter shortly.</p>
    <p><a href="${data.portalUrl}/student/offers">View Your Offers</a></p>
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  OFFER_RELEASED: {
    subject: "Your Offer Letter - {{company}}",
    body: (data) => `
    <h2>Your Offer Letter</h2>
    <p>Dear ${data.studentName},</p>
    <p>Your offer letter for ${data.jobTitle} at ${data.company} is ready.</p>
    <p><strong>CTC:</strong> ₹${data.ctcFinal} LPA</p>
    <p>Please review and confirm your acceptance or decline the offer within 7 days.</p>
    <p><a href="${data.portalUrl}/student/offers">Review & Respond to Offer</a></p>
    ${
      data.offerLetterUrl
        ? `<p><a href="${data.offerLetterUrl}">Download Offer Letter</a></p>`
        : ""
    }
    <p>Best regards,<br>Training & Placement Portal</p>
    `,
  },

  EMAIL_VERIFICATION: {
    subject: "Verify Your Email Address - NIT Arunachal T&P Portal",
    body: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .verification-code {
          background: #f7f9fc;
          border: 2px dashed #667eea;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .instructions {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 10px 10px;
        }
        .divider {
          border-top: 1px solid #e0e0e0;
          margin: 25px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎓 Email Verification</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">NIT Arunachal Pradesh - Training & Placement Portal</p>
      </div>
      
      <div class="content">
        <h2 style="color: #333; margin-top: 0;">Welcome to T&P Portal!</h2>
        
        <p>Thank you for registering with the NIT Arunachal Pradesh Training & Placement Portal.</p>
        
        <p>To complete your registration and ensure the security of your account, please verify your email address using the verification code below:</p>
        
        <div class="verification-code">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code</p>
          <div class="code">${data.verificationCode}</div>
          <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Valid for 24 hours</p>
        </div>
        
        <div class="instructions">
          <strong>📋 How to Verify:</strong>
          <ol style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Go to the login page: <a href="${data.verificationUrl}" style="color: #667eea;">${data.verificationUrl}</a></li>
            <li>Enter your email address</li>
            <li>Enter the 6-digit verification code shown above</li>
            <li>Click "Verify Email" button</li>
          </ol>
        </div>
        
        <div style="text-align: center;">
          <a href="${data.verificationUrl}" class="button">Verify Email Now</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="font-size: 13px; color: #666;">
          <strong>⏰ Code Expires:</strong> This verification code will expire in 24 hours. If expired, you can request a new code from the login page.
        </p>
        
        <p style="font-size: 13px; color: #666;">
          <strong>❓ Didn't register?</strong> If you did not create an account on the NIT Arunachal T&P Portal, please ignore this email or contact the T&P office.
        </p>
        
        <p style="font-size: 13px; color: #666;">
          <strong>🔒 Security Note:</strong> Never share this verification code with anyone. The T&P office will never ask for your verification code.
        </p>
      </div>
      
      <div class="footer">
        <p style="margin: 0 0 10px 0;">
          <strong>Training & Placement Cell</strong><br>
          National Institute of Technology, Arunachal Pradesh<br>
          Yupia, Papum Pare District, Arunachal Pradesh - 791112
        </p>
        <p style="margin: 10px 0 0 0; color: #999;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    </body>
    </html>
    `,
  },

  PASSWORD_RESET: {
    subject: "Reset Your Password",
    body: (data) => `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <p><a href="${data.resetUrl}">Reset Password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    `,
  },
};

/**
 * Format email template with data
 */
export function formatEmailTemplate(
  templateKey: string,
  data: any,
): {
  subject: string;
  body: string;
} {
  const template = emailTemplates[templateKey];
  if (!template) {
    throw new Error(`Email template not found: ${templateKey}`);
  }

  let subject = template.subject;
  Object.keys(data).forEach((key) => {
    subject = subject.replace(`{{${key}}}`, data[key]);
  });

  return {
    subject,
    body: template.body(data),
  };
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getSmtpTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration missing");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

/**
 * Nodemailer email send function (to be called from server action)
 * Configure SMTP settings in environment variables
 */
export async function sendEmail(options: {
  to: string[];
  subject: string;
  body: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!from) {
      throw new Error("EMAIL_FROM is not configured");
    }

    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from,
      to: options.to.join(", "),
      subject: options.subject,
      html: options.body,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}
