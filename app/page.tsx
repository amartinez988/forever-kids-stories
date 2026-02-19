'use client'

import { useState } from 'react'
import Image from 'next/image'

const characters = [
  { id: 'princess', name: 'Princesa', emoji: '👸', nameEn: 'Princess' },
  { id: 'dragon', name: 'Dragón', emoji: '🐉', nameEn: 'Dragon' },
  { id: 'astronaut', name: 'Astronauta', emoji: '👨‍🚀', nameEn: 'Astronaut' },
  { id: 'unicorn', name: 'Unicornio', emoji: '🦄', nameEn: 'Unicorn' },
  { id: 'superhero', name: 'Superhéroe', emoji: '🦸', nameEn: 'Superhero' },
  { id: 'mermaid', name: 'Sirena', emoji: '🧜‍♀️', nameEn: 'Mermaid' },
]

const places = [
  { id: 'castle', name: 'Castillo Mágico', emoji: '🏰', nameEn: 'Magic Castle' },
  { id: 'space', name: 'El Espacio', emoji: '🚀', nameEn: 'Outer Space' },
  { id: 'underwater', name: 'Bajo el Mar', emoji: '🌊', nameEn: 'Under the Sea' },
  { id: 'jungle', name: 'La Selva', emoji: '🌴', nameEn: 'The Jungle' },
  { id: 'candyland', name: 'Mundo de Dulces', emoji: '🍭', nameEn: 'Candy Land' },
  { id: 'dinosaurs', name: 'Tierra de Dinosaurios', emoji: '🦕', nameEn: 'Dinosaur Land' },
]

const adventures = [
  { id: 'treasure', name: 'Buscar un Tesoro', emoji: '💎', nameEn: 'Find a Treasure' },
  { id: 'friend', name: 'Hacer un Amigo', emoji: '🤝', nameEn: 'Make a Friend' },
  { id: 'rescue', name: 'Un Rescate', emoji: '🦸‍♂️', nameEn: 'A Rescue Mission' },
  { id: 'party', name: 'Una Fiesta', emoji: '🎉', nameEn: 'A Big Party' },
  { id: 'mystery', name: 'Resolver un Misterio', emoji: '🔍', nameEn: 'Solve a Mystery' },
  { id: 'race', name: 'Una Gran Carrera', emoji: '🏆', nameEn: 'A Big Race' },
]

export default function Home() {
  const [step, setStep] = useState(0)
  const [kidName, setKidName] = useState('')
  const [character, setCharacter] = useState('')
  const [place, setPlace] = useState('')
  const [adventure, setAdventure] = useState('')
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'es' | 'en'>('es')

  const generateStory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidName, character, place, adventure, language }),
      })
      const data = await response.json()
      setStory(data.story)
      setStep(5)
    } catch (error) {
      console.error('Error generating story:', error)
    }
    setLoading(false)
  }

  const speakStory = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(story)
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const reset = () => {
    setStep(0)
    setKidName('')
    setCharacter('')
    setPlace('')
    setAdventure('')
    setStory('')
    stopSpeaking()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex justify-center mb-4">
          <Image 
            src="/logo.png" 
            alt="Forever Kids Academy" 
            width={200} 
            height={114}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
          ✨ Story Magic ✨
        </h1>
        <p className="text-xl md:text-2xl text-white/90">
          {language === 'es' ? '¡Crea tu propia aventura!' : 'Create your own adventure!'}
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

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* Step 0: Name */}
        {step === 0 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-purple-600 mb-6">
              {language === 'es' ? '¿Cómo te llamas?' : "What's your name?"}
            </h2>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder={language === 'es' ? 'Tu nombre...' : 'Your name...'}
              className="w-full max-w-md text-2xl p-4 border-4 border-purple-300 rounded-2xl text-center focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={() => kidName && setStep(1)}
              disabled={!kidName}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
            >
              {language === 'es' ? '¡Siguiente!' : 'Next!'} →
            </button>
          </div>
        )}

        {/* Step 1: Character */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              {language === 'es' ? '¡Hola ' : 'Hi '}{kidName}! {language === 'es' ? '¿Quién quieres ser?' : 'Who do you want to be?'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCharacter(c.id); setStep(2); }}
                  className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl hover:scale-105 transition shadow-lg border-4 border-transparent hover:border-purple-400"
                >
                  <span className="text-6xl block mb-2">{c.emoji}</span>
                  <span className="text-xl font-bold text-purple-700">{language === 'es' ? c.name : c.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Place */}
        {step === 2 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              {language === 'es' ? '¿A dónde quieres ir?' : 'Where do you want to go?'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {places.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPlace(p.id); setStep(3); }}
                  className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl hover:scale-105 transition shadow-lg border-4 border-transparent hover:border-blue-400"
                >
                  <span className="text-6xl block mb-2">{p.emoji}</span>
                  <span className="text-xl font-bold text-blue-700">{language === 'es' ? p.name : p.nameEn}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-purple-500 hover:text-purple-700">
              ← {language === 'es' ? 'Volver' : 'Back'}
            </button>
          </div>
        )}

        {/* Step 3: Adventure */}
        {step === 3 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              {language === 'es' ? '¿Qué aventura quieres vivir?' : 'What adventure do you want?'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {adventures.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAdventure(a.id); setStep(4); }}
                  className="p-6 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl hover:scale-105 transition shadow-lg border-4 border-transparent hover:border-orange-400"
                >
                  <span className="text-6xl block mb-2">{a.emoji}</span>
                  <span className="text-xl font-bold text-orange-700">{language === 'es' ? a.name : a.nameEn}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-6 text-purple-500 hover:text-purple-700">
              ← {language === 'es' ? 'Volver' : 'Back'}
            </button>
          </div>
        )}

        {/* Step 4: Generate */}
        {step === 4 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-purple-600 mb-6">
              {language === 'es' ? '¡Tu historia está lista!' : 'Your story is ready!'}
            </h2>
            <div className="text-6xl mb-6 flex justify-center gap-4">
              {characters.find(c => c.id === character)?.emoji}
              {places.find(p => p.id === place)?.emoji}
              {adventures.find(a => a.id === adventure)?.emoji}
            </div>
            <button
              onClick={generateStory}
              disabled={loading}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:scale-105 transition animate-pulse disabled:animate-none"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin">✨</span>
                  {language === 'es' ? 'Creando magia...' : 'Creating magic...'}
                </span>
              ) : (
                <span>🪄 {language === 'es' ? '¡Crear mi historia!' : 'Create my story!'}</span>
              )}
            </button>
            <button onClick={() => setStep(3)} className="mt-6 block mx-auto text-purple-500 hover:text-purple-700">
              ← {language === 'es' ? 'Volver' : 'Back'}
            </button>
          </div>
        )}

        {/* Step 5: Story */}
        {step === 5 && (
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              ✨ {language === 'es' ? 'La Historia de ' : "The Story of "}{kidName} ✨
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8 p-6 bg-purple-50 rounded-2xl">
              {story.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-xl leading-relaxed">{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={speakStory}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition"
              >
                🔊 {language === 'es' ? '¡Leer en voz alta!' : 'Read aloud!'}
              </button>
              <button
                onClick={stopSpeaking}
                className="px-8 py-4 bg-gradient-to-r from-red-400 to-rose-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition"
              >
                ⏹️ {language === 'es' ? 'Parar' : 'Stop'}
              </button>
              <button
                onClick={reset}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition"
              >
                🔄 {language === 'es' ? '¡Otra historia!' : 'Another story!'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/80">
        <p>Made with 💜 for Forever Kids Academy</p>
        <p className="text-sm mt-1">Built by Alejandro Martinez using AI</p>
      </footer>
    </div>
  )
}
