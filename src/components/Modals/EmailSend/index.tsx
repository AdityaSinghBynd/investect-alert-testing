"use client"

import React, { useState } from 'react'
// Images
import { X, Plus, Send, User, Mail } from 'lucide-react'
// Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogOverlay } from "@/components/ui/dialog"
// Types
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
}


const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = ""
}) => {
  const [emailInput, setEmailInput] = useState("")
  const [recipients, setRecipients] = useState<EmailRecipient[]>([])

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
    // Here you would implement the actual email sending logic
    console.log("Sending email to:", recipients.map(r => r.email))
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRecipient()
    }
  }

  return (

    <div className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50" onClick={onClose}>
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
       w-full h-full max-w-[550px] min-h-[350px] max-h-[350px] bg-layer-1 rounded-lg flex flex-col justify-between">

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
  )
}

export default SendEmailModal