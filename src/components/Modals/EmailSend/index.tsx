"use client"

import React, { useState } from 'react'
// Images
import { X, Plus, Send, User, Mail } from 'lucide-react'
// Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogOverlay } from "@/components/ui/dialog"
// Types
import { CompanyWithNews } from '@/hooks/Newsletter/newsletter.interface'

interface EmailRecipient {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface SendEmailModalProps {
  isOpen: boolean
  onClose: () => void
  defaultEmail?: string
  companiesWithNews: CompanyWithNews[]
  date: string
}

import { useEmailSend } from '@/hooks/NewsletterOperations/useNewsletterOperations'

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = "",
  companiesWithNews,
  date
}) => {
  const [emailInput, setEmailInput] = useState("")
  const [recipients, setRecipients] = useState<EmailRecipient[]>([])
  const emailSendMutation = useEmailSend({
    onSuccess: () => {
      onClose()
    }
  })

  // Prevent clicks inside modal from bubbling up
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Function to generate HTML content with the data
  const generateNewsletterHTML = () => {
    // Create a template string with the HTML content
    const template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investec Daily Newsletter</title>
    <style type="text/css">
        /* Structural responsiveness only - fonts remain consistent */
        @media screen and (max-width: 768px) {
            .newsletter-container { margin: 0 !important; padding: 0 !important; }
            .content-wrapper { padding: 0 15px !important; }
            .headlines-section { padding: 12px 15px 16px 15px !important; }
            .news-section { padding: 15px !important; }
            .contacts-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .banner-img { width: 100% !important; max-width: 100% !important; }
        }
        @media screen and (max-width: 480px) {
            .key-points { padding-left: 16px !important; }
            .content-wrapper { padding: 0 10px !important; }
            .headlines-section { padding: 10px 12px 14px 12px !important; }
            .news-section { padding: 12px !important; }
            .footer-section { padding: 12px !important; }
        }
        * { -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
    </style>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0; box-sizing: border-box;">
    <div class="newsletter-container" style="max-width: 900px; margin: 0 auto; background-color: #ffffff;">
        <!-- Banner Section -->
        <div class="banner-section" style="text-align: center; padding: 20px 0 40px 0; background-color: #ffffff;">
            <img src="/images/investecBanner.png" alt="Investec Bank plc (UK)" class="banner-img"
                style="max-width: 100%; height: auto; display: block; margin: 0 auto;" width="1080" height="197">
        </div>

        <div class="content-wrapper" style="max-width: 880px; margin: 0 auto; padding: 0 20px;">
            <!-- Date Section -->
            <div style="border-top: 1.5pt solid #328589; padding: 12px 0 8px 12px; margin-bottom: 8px;">
                <div style="font-size: 8pt; color: #7f7f7f; text-align: left;">${date}</div>
            </div>

            <!-- Headlines Section -->
            <div class="headlines-section"
                style="background-color: #fbfbfb; border-bottom: 1.5pt solid #d9d9d9; padding: 12px 20px 16px 20px; margin-bottom: 16px !important;">
                <div style="font-size: 8pt; margin-bottom: 8px;">
                    <span style="color: #328589; font-weight: bold;">Good morning,</span>
                </div>
                <div style="font-size: 8pt;">
                    ${companiesWithNews.map(company =>
      company.news.map(news => `
                            <div style="margin-bottom: 8px;">
                                <span style="color: #000000; font-weight: bold; text-decoration: none; display: inline; line-height: 0.5 !important;">${news.title}</span>
                                ${news.sources.length ? `
                                    <span style="color: #7f7f7f; font-size: 7pt; display: inline; margin-left: 6px;">
                                        ${news.sources.map((source, idx) => `
                                            <a href="${source}" style="color: #7f7f7f; text-decoration: underline;">${new URL(source).hostname.replace('www.', '')}</a>${idx < news.sources.length - 1 ? ' | ' : ''}
                                        `).join('')}
                                    </span>
                                ` : ''}
                            </div>
                        `).join('')
    ).join('')}
                </div>
            </div>

            <!-- News Section -->
            <div class="news-section" style="background-color: #edf1f3; padding: 20px; margin: 0;">
                <div style="font-size: 8pt; color: #328589; font-weight: bold; margin-bottom: 16px; text-align: left;">
                    News Snippets
                </div>

                ${companiesWithNews.map(company => `
                    ${company.news.length ? `
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 8pt; color: #328589; font-weight: bold; margin-bottom: 12px; line-height: normal !important; text-align: left;">
                                ${company.name}:
                            </div>

                            ${company.news.map(news => `
                                <div style="margin-bottom: 12px; line-height: normal !important; text-align: left;">
                                    <div style="margin-bottom: 6px;">
                                        <span style="font-size: 8pt; color: #000000; font-weight: bold; line-height: 1.2 !important; display: inline;">${news.title}</span>
                                        ${news.sources.length ? `
                                            <span style="font-size: 7pt; color: #7f7f7f; display: inline; margin-left: 6px;">
                                                ${news.sources.map((source, idx) => `
                                                    <a href="${source}" style="color: #7f7f7f; text-decoration: underline;">${new URL(source).hostname.replace('www.', '')}</a>${idx < news.sources.length - 1 ? ' | ' : ''}
                                                `).join('')}
                                            </span>
                                        ` : ''}
                                    </div>
                                    <ul style="list-style: disc !important; padding-left: 10px !important; margin: 0 !important;" class="key-points">
                                        ${news.keyPoints.map(point => `
                                            <li style="font-size: 8pt !important; color: #000000 !important; margin-bottom: 1px !important; line-height: 1.2 !important;">
                                                ${point}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`

    return template
  }

  // Handle overlay click to close modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const addRecipient = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      const newRecipient: EmailRecipient = {
        id: Date.now().toString(),
        email: emailInput.trim(),
        name: emailInput.split('@')[0]
      }
      setRecipients([...recipients, newRecipient])
      setEmailInput("")
    }
  }

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id))
  }

  const handleSend = () => {
    const htmlContent = generateNewsletterHTML()
    emailSendMutation.mutate({
      emails: recipients.map(r => r.email),
      message: htmlContent
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRecipient()
    }
  }

  return isOpen ? (
    <div
      className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full max-w-[550px] min-h-[350px] max-h-[350px] bg-layer-1 rounded-lg flex flex-col justify-between"
        onClick={handleModalClick}
      >
        {/* Header */}
        <header className="flex flex-row items-center justify-between px-3 py-2 border-b border-[#EAF0FC] rounded-t-lg bg-layer-1">
          <div className="flex items-center gap-2">
            <Mail className='w-4 h-4' />
            <p className="text-sm font-medium text-text-primary">
              Send Email
            </p>
          </div>
          <div className='hover:bg-transparent !mt-0' onClick={onClose}>
            <X className="h-4 w-4 text-text-primary cursor-pointer" />
          </div>
        </header>

        {/* Content */}
        <main className="px-3 pt-1 space-y-3 flex flex-col w-full h-full justify-start">

          {/* Email Input */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-10 border-[#eaf0fc] shadow-none focus:border-[#004CE6] focus:ring-[#004CE6]"
              />
            </div>
            <Button
              onClick={addRecipient}
              disabled={!emailInput.trim() || !emailInput.includes('@')}
              variant="ghost"
              className="h-10 text-button-primary border border-[#eaf0fc] hover:bg-[#004CE6] hover:text-white shadow-none"
            >
              <Plus className="w-5 h-5" />
              Add
            </Button>
          </div>

          {/* Recipients List */}
          <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-hide">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-button-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {recipient.avatar ? (
                    <img
                      src={recipient.avatar}
                      alt={recipient.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Email */}
                <div className="flex-1 ml-1">
                  <p className="text-sm font-medium text-text-primary">
                    {recipient.email}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => removeRecipient(recipient.id)}
                  variant="ghost"
                  className="h-6 w-6 opacity-0 hover:bg-transparent group-hover:opacity-100 transition-opacity text-text-primary"
                >
                  <X className="h-7 w-7 text-text-primary" />
                </Button>
              </div>
            ))}
          </div>

          {recipients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No recipients added yet</p>
              <p className="text-xs text-gray-400">Add email addresses above</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="flex justify-end px-3 py-2">
          <Button
            onClick={handleSend}
            disabled={recipients.length === 0}
            className="bg-button-primary hover:bg-button-primary/90 text-white shadow-none"
          >
            Send Mail
          </Button>
        </footer>
      </div>
    </div>
  ) : null
}

export default SendEmailModal