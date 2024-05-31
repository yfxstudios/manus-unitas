'use server'

import nodemailer from "nodemailer"
import Users from "@/lib/schemas/userSchema"

export async function sendMail({
  to,
  from,
  subject,
  body
}) {
  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

  try {

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      // secure: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    })

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: body
    }

    return transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(error)
  }
}