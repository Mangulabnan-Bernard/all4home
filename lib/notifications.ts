import { NextRequest, NextResponse } from 'next/server'

// Mock email service - in production, you'd use a service like SendGrid, AWS SES, or Resend
export async function sendEmail(to: string, subject: string, html: string) {
  // This is a mock implementation
  console.log('Sending email:', { to, subject, html })
  
  // In production, you would use a real email service:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@all4home.com',
  //   to,
  //   subject,
  //   html
  // })
  
  return { success: true }
}

// Mock SMS service - in production, you'd use Twilio or similar
export async function sendSMS(to: string, message: string) {
  console.log('Sending SMS:', { to, message })
  
  // In production:
  // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  // await twilio.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to
  // })
  
  return { success: true }
}

// Notification templates
export const notificationTemplates = {
  bookingCreated: {
    email: (customerName: string, providerName: string, serviceName: string, date: string) => ({
      subject: 'Booking Confirmed - All4Home',
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${customerName},</p>
        <p>Your booking with ${providerName} for ${serviceName} on ${date} has been confirmed.</p>
        <p>Payment has been placed in escrow and will be released upon job completion.</p>
        <p>Thank you for using All4Home!</p>
      `
    }),
    sms: (customerName: string, providerName: string, date: string) => 
      `Hi ${customerName}, your booking with ${providerName} on ${date} is confirmed. Payment in escrow.`
  },
  
  bookingAccepted: {
    email: (customerName: string, providerName: string, serviceName: string, date: string) => ({
      subject: 'Provider Accepted Your Booking - All4Home',
      html: `
        <h2>Great News!</h2>
        <p>Hi ${customerName},</p>
        <p>${providerName} has accepted your booking for ${serviceName} on ${date}.</p>
        <p>You'll receive GPS check-in notification when they arrive.</p>
      `
    }),
    sms: (customerName: string, providerName: string, date: string) => 
      `Hi ${customerName}, ${providerName} accepted your booking for ${date}.`
  },
  
  providerApproved: {
    email: (providerName: string) => ({
      subject: 'Application Approved - Welcome to All4Home!',
      html: `
        <h2>Congratulations, ${providerName}!</h2>
        <p>Your application to become a service provider has been approved.</p>
        <p>You can now start receiving booking requests and managing your services.</p>
        <p>Log in to your provider dashboard to get started.</p>
      `
    }),
    sms: (providerName: string) => 
      `Congratulations ${providerName}! Your All4Home provider application has been approved.`
  },
  
  jobCompleted: {
    email: (customerName: string, providerName: string, serviceName: string) => ({
      subject: 'Job Completed - Please Confirm',
      html: `
        <h2>Job Completed</h2>
        <p>Hi ${customerName},</p>
        <p>${providerName} has marked your ${serviceName} job as completed.</p>
        <p>Please review the work and confirm completion to release payment from escrow.</p>
        <p>If there are any issues, you can file a dispute within 48 hours.</p>
      `
    }),
    sms: (customerName: string, providerName: string) => 
      `Hi ${customerName}, ${providerName} completed your job. Please confirm to release payment.`
  }
}
