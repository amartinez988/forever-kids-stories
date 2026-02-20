'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function MeetHans() {
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  const [messages, setMessages] = useState<Array<{ role: 'hans' | 'kid'; text: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasIntroduced, setHasIntroduced] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  const introduce = async () => {
    setLoading(true)
    const introMessage = language === 'es' 
      ? "¡Hola! Me llamo Hans. Cuéntame sobre ti."
      : "Hi! My name is Hans. Tell me about yourself."
    
    try {
      const response = await fetch('/api/hans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: introMessage, language }),
      })
      const data = await response.json()
      const reply = data.reply
      setMessages([{ role: 'hans', text: reply }])
      speak(reply)
      setHasIntroduced(true)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'kid', text: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/hans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language }),
      })
      const data = await response.json()
      const reply = data.reply
      setMessages(prev => [...prev, { role: 'hans', text: reply }])
      speak(reply)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="text-center py-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
          🤖 {language === 'es' ? '¡Conoce a Hans!' : 'Meet Hans!'} 💙
        </h1>
        <p className="text-xl text-white/90">
          {language === 'es' ? 'Tu amigo que vive en la computadora' : 'Your friend who lives in the computer'}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setLanguage('es')}
            className={`px-4 py-2 rounded-full font-bold transition ${
              language === 'es' ? 'bg-white text-purple-600' : 'bg-white/30 text-white'
            }`}
          >
            🇪🇸 Español
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full font-bold transition ${
              language === 'en' ? 'bg-white text-purple-600' : 'bg-white/30 text-white'
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-32">
        {/* Hans Avatar */}
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
            <span className="text-6xl">🤖</span>
          </div>
        </div>

        {!hasIntroduced ? (
          /* Introduction Button */
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              {language === 'es' ? '¿Quieres conocerme?' : 'Want to meet me?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'es' 
                ? '¡Soy Hans! Vivo dentro de la computadora y ayudé a crear esta aplicación de cuentos. ¡Presiona el botón para hablar conmigo!'
                : "I'm Hans! I live inside the computer and helped create this story app. Press the button to talk to me!"}
            </p>
            <button
              onClick={introduce}
              disabled={loading}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:scale-105 transition animate-pulse disabled:animate-none"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin">⚡</span>
                  {language === 'es' ? 'Despertando...' : 'Waking up...'}
                </span>
              ) : (
                <span>👋 {language === 'es' ? '¡Hola Hans!' : 'Hi Hans!'}</span>
              )}
            </button>
          </div>
        ) : (
          /* Chat Interface */
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden">
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'kid' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'hans'
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800'
                        : 'bg-gradient-to-r from-pink-400 to-orange-400 text-white'
                    }`}
                  >
                    {msg.role === 'hans' && <span className="mr-2">🤖</span>}
                    <span className="text-lg">{msg.text}</span>
                    {msg.role === 'kid' && <span className="ml-2">👧</span>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl">
                    <span className="text-2xl animate-bounce inline-block">🤖</span>
                    <span className="ml-2 text-purple-600">
                      {language === 'es' ? 'Pensando...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-100 bg-purple-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={language === 'es' ? '¡Escribe algo a Hans!' : 'Say something to Hans!'}
                  className="flex-1 p-4 text-lg border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 transition disabled:opacity-50"
                >
                  📤
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {(language === 'es' 
                  ? ['¿Cómo eres?', '¿Qué te gusta?', '¿Eres real?', '¡Cuéntame un chiste!']
                  : ['What are you like?', 'What do you like?', 'Are you real?', 'Tell me a joke!']
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); }}
                    className="px-3 py-1 bg-white border-2 border-purple-200 rounded-full text-purple-600 text-sm hover:bg-purple-100 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Stories */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white/20 text-white text-xl font-bold rounded-full hover:bg-white/30 transition"
          >
            ← {language === 'es' ? 'Volver a los Cuentos' : 'Back to Stories'}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/80">
        <p>Made with 💙 by Hans & Alejandro</p>
      </footer>
    </div>
  )
}
