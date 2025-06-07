'use client'

import { Header } from '@/components/Header'
import { ChevronDown, ChevronUp, Heart, Shield, Users, Leaf } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-green-600 flex-shrink-0 ml-2 transition-transform duration-200" size={20} />
        ) : (
          <ChevronDown className="text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 bg-gray-50/50">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const t = useTranslations()

  // Get translated FAQ data
  const faqs = [
    {
      question: t('faq.questions.whatIsBarcha.question'),
      answer: t('faq.questions.whatIsBarcha.answer')
    },
    {
      question: t('faq.questions.isSafe.question'),
      answer: t('faq.questions.isSafe.answer')
    },
    {
      question: t('faq.questions.howToKnowGood.question'),
      answer: t('faq.questions.howToKnowGood.answer')
    },
    {
      question: t('faq.questions.typesOfFood.question'),
      answer: t('faq.questions.typesOfFood.answer')
    },
    {
      question: t('faq.questions.pickupProcess.question'),
      answer: t('faq.questions.pickupProcess.answer')
    },
    {
      question: t('faq.questions.isFree.question'),
      answer: t('faq.questions.isFree.answer')
    },
    {
      question: t('faq.questions.cantPickup.question'),
      answer: t('faq.questions.cantPickup.answer')
    },
    {
      question: t('faq.questions.businessFood.question'),
      answer: t('faq.questions.businessFood.answer')
    },
    {
      question: t('faq.questions.privacy.question'),
      answer: t('faq.questions.privacy.answer')
    },
    {
      question: t('faq.questions.badExperience.question'),
      answer: t('faq.questions.badExperience.answer')
    }
  ]

  // Get translated safety tips
  const safetyTips = [
    t('faq.safetyTips.0'),
    t('faq.safetyTips.1'),
    t('faq.safetyTips.2'),
    t('faq.safetyTips.3'),
    t('faq.safetyTips.4'),
    t('faq.safetyTips.5')
  ]

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❓</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">{t('faq.title')}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🌱</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              {t('home.mission.title')}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('home.mission.description')}
            </p>
          </div>
          
          {/* How It Works Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.donate.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.howItWorks.donate.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Heart className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.request.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.howItWorks.request.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="text-amber-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.howItWorks.safety.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.howItWorks.safety.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Why Barsha Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t('home.whyChoose.title')}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('home.whyChoose.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.whyChoose.reduceWaste.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.whyChoose.reduceWaste.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.whyChoose.buildCommunity.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.whyChoose.buildCommunity.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Heart className="text-red-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.whyChoose.helpOthers.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('home.whyChoose.helpOthers.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
              <Shield className="text-white" size={20} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('faq.safetyTitle')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm">
              <strong>{t('common.remember')}:</strong> {t('common.safetyReminder')}
            </p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {t('common.commonQuestions')}
          </h2>
          
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
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-xl p-8 mt-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t('common.stillHaveQuestions')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('common.contactDescription')}
          </p>
          <a 
            href="mailto:support@barsha.tn" 
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('common.contactSupport')}
          </a>
        </div>
      </main>
    </div>
  )
}
