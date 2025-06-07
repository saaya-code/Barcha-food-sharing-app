import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <Header />
            <main>
              {children}
            </main>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}