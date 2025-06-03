'use client'

import Header from '@/components/Header'
import { ChevronDown, ChevronUp, Heart, Shield, Users, Leaf } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: "What is Barsha?",
    answer: "Barsha is a community-driven platform that connects people who have surplus food with those who can use it. Our mission is to reduce food waste while helping build stronger communities across Tunisia."
  },
  {
    question: "Is it safe to eat food shared through Barsha?",
    answer: "Food safety is our top priority. We encourage all users to follow basic food safety guidelines: only share food that you would eat yourself, clearly indicate expiry dates, and use proper storage. However, users are responsible for their own judgment when accepting food."
  },
  {
    question: "How do I know if food is still good?",
    answer: "Always check the expiry date and use your senses - look for any signs of spoilage like unusual smell, color changes, or texture. When in doubt, don't consume the food. Trust your instincts and prioritize safety."
  },
  {
    question: "What types of food can I share?",
    answer: "You can share most types of food including baked goods, fruits, vegetables, cooked meals, and packaged items. Please be honest about the food's condition and how long it's been prepared or opened."
  },
  {
    question: "How does the pickup process work?",
    answer: "Once you request an item, you'll receive the donor's contact information. Coordinate directly with them to arrange pickup time and location. Be respectful of their time and follow any pickup instructions they've provided."
  },
  {
    question: "Is Barsha free to use?",
    answer: "Yes! Barsha is completely free for all users. We believe that sharing food and reducing waste should be accessible to everyone in our community."
  },
  {
    question: "What should I do if I can't pick up food I requested?",
    answer: "Please contact the donor as soon as possible to let them know. This allows them to offer the food to someone else and helps maintain trust in our community."
  },
  {
    question: "Can I share food from my restaurant or business?",
    answer: "Absolutely! Restaurants, cafes, bakeries, and other food businesses are welcome to share their surplus food. This is a great way to reduce waste and support your local community."
  },
  {
    question: "How can I ensure my privacy?",
    answer: "You control what contact information you share. You can choose to provide a phone number, WhatsApp, or email. We recommend meeting in public places for pickup when possible."
  },
  {
    question: "What if I have a bad experience with someone?",
    answer: "If you encounter any issues, please let us know. We're committed to maintaining a positive and respectful community. Serious violations of our community guidelines may result in account restrictions."
  }
]

const safetyTips = [
  "Only share food that you would eat yourself",
  "Check expiry dates and be honest about them",
  "Store food properly before sharing",
  "Use your senses - look, smell, and check texture",
  "When in doubt, throw it out",
  "Meet in safe, public locations when possible",
  "Be respectful of pickup times and arrangements"
]

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-green-600 flex-shrink-0 ml-2" size={20} />
        ) : (
          <ChevronDown className="text-gray-400 flex-shrink-0 ml-2" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90">
            Everything you need to know about using Barsha safely and effectively
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Barsha aims to create a more sustainable Tunisia by connecting communities 
              through food sharing. Every shared meal reduces waste and strengthens the bonds 
              between neighbors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reduce Waste</h3>
              <p className="text-gray-600 text-sm">
                Prevent good food from ending up in landfills
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600 text-sm">
                Connect neighbors and strengthen local bonds
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Heart className="text-red-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Help Others</h3>
              <p className="text-gray-600 text-sm">
                Support those who could benefit from shared meals
              </p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="text-green-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Food Safety Guidelines</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Remember:</strong> When in doubt about food safety, it's always better to 
              err on the side of caution. Trust your judgment and prioritize your health.
            </p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.includes(index)}
                onClick={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mt-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            We're here to help! If you can't find the answer you're looking for, 
            feel free to reach out to our team.
          </p>
          <a 
            href="mailto:support@barsha.tn" 
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
