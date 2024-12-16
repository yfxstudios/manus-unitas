'use server'

import nodemailer from "nodemailer"

export async function sendMail({
  to,
  from,
  replyTo,
  subject,
  body
}) {
  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      tls: {
        rejectUnauthorized: false
      },
      // secure: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    })

    const mailOptions = {
      from: from,
      replyTo: replyTo,
      to: to,
      subject: subject,
      html: body
    }

    return transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(error)
  }
}

export async function sendBulkMail({
  to,
  from,
  replyTo,
  subject,
  body
}) {
  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      tls: {
        rejectUnauthorized: false
      },
      // secure: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    })

    transporter.verify((error, success) => {
      if (error) {
        console.error(error)
      } else {
        console.log("Server is ready to take our messages")
      }
    })

    to.forEach(async email => {
      const mailOptions = {
        from: from,
        replyTo: replyTo,
        to: email,
        subject: subject,
        html: body
      }

      await transporter.sendMail(mailOptions)
    })
  } catch (error) {
    console.error(error)
  }
}
