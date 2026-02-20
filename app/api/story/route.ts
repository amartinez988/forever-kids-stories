import { NextResponse } from 'next/server'

const characterMap: Record<string, { es: string; en: string }> = {
  princess: { es: 'una valiente princesa', en: 'a brave princess' },
  dragon: { es: 'un dragón amigable', en: 'a friendly dragon' },
  astronaut: { es: 'un intrépido astronauta', en: 'a fearless astronaut' },
  unicorn: { es: 'un unicornio mágico', en: 'a magical unicorn' },
  superhero: { es: 'un superhéroe increíble', en: 'an amazing superhero' },
  mermaid: { es: 'una sirena aventurera', en: 'an adventurous mermaid' },
  missshilpa: { es: 'la maestra más mágica, Miss Shilpa', en: 'the most magical teacher, Miss Shilpa' },
}

const placeMap: Record<string, { es: string; en: string }> = {
  school: { es: 'la mágica Forever Kids Academy donde todo es posible', en: 'the magical Forever Kids Academy where anything is possible' },
  castle: { es: 'un castillo mágico lleno de secretos', en: 'a magical castle full of secrets' },
  space: { es: 'el espacio exterior entre las estrellas', en: 'outer space among the stars' },
  underwater: { es: 'un mundo mágico bajo el mar', en: 'a magical world under the sea' },
  jungle: { es: 'una selva llena de animales increíbles', en: 'a jungle full of amazing animals' },
  candyland: { es: 'un mundo hecho completamente de dulces', en: 'a world made entirely of candy' },
  dinosaurs: { es: 'la tierra de los dinosaurios', en: 'the land of dinosaurs' },
}

const adventureMap: Record<string, { es: string; en: string }> = {
  treasure: { es: 'encontrar un tesoro escondido', en: 'find a hidden treasure' },
  friend: { es: 'hacer un nuevo mejor amigo', en: 'make a new best friend' },
  rescue: { es: 'rescatar a alguien que necesita ayuda', en: 'rescue someone who needs help' },
  party: { es: 'organizar la fiesta más increíble', en: 'throw the most amazing party' },
  mystery: { es: 'resolver un misterio emocionante', en: 'solve an exciting mystery' },
  race: { es: 'ganar una gran carrera', en: 'win a big race' },
}

export async function POST(request: Request) {
  try {
    const { kidName, character, place, adventure, language } = await request.json()

    const lang = language || 'es'
    const charText = characterMap[character]?.[lang] || character
    const placeText = placeMap[place]?.[lang] || place
    const adventureText = adventureMap[adventure]?.[lang] || adventure

    // Check if this is Valeria (special story!)
    const isValeria = kidName.toLowerCase().includes('valeria')

    const systemPrompt = lang === 'es' 
      ? `Eres un contador de cuentos mágico para niños de 3-5 años en Forever Kids Academy. 
         Crea historias cortas, dulces y emocionantes con finales felices.
         Usa lenguaje simple y alegre. La historia debe tener 4-5 párrafos cortos.
         ${isValeria ? 'Esta es una niña MUY especial, haz la historia extra mágica y menciona que es la heroína más valiente de Forever Kids Academy.' : ''}
         No uses palabras difíciles. Incluye sonidos divertidos como "¡Whoosh!" o "¡Splash!" o "¡Pum!"`
      : `You are a magical storyteller for children ages 3-5 at Forever Kids Academy.
         Create short, sweet, and exciting stories with happy endings.
         Use simple and cheerful language. The story should have 4-5 short paragraphs.
         ${isValeria ? 'This is a VERY special child, make the story extra magical and mention she is the bravest hero at Forever Kids Academy.' : ''}
         Don't use difficult words. Include fun sounds like "Whoosh!" or "Splash!" or "Boom!"`

    const userPrompt = lang === 'es'
      ? `Crea una historia corta para ${kidName}, quien es ${charText}. 
         La aventura ocurre en ${placeText}. 
         El objetivo de la historia es ${adventureText}.
         Comienza la historia con "${kidName}" como protagonista.`
      : `Create a short story for ${kidName}, who is ${charText}.
         The adventure takes place in ${placeText}.
         The goal of the story is to ${adventureText}.
         Start the story with "${kidName}" as the main character.`

    // Use OpenAI API
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Fallback story if no API key
      const fallbackStory = lang === 'es'
        ? `Había una vez, ${kidName} era ${charText} que vivía en ${placeText}.

Un día, ${kidName} decidió ${adventureText}. ¡Qué emocionante!

"¡Vamos a la aventura!" gritó ${kidName} con alegría. ¡Whoosh! Salió corriendo.

Después de muchas aventuras divertidas, ${kidName} lo logró. Todos en Forever Kids Academy celebraron.

Y así, ${kidName} vivió feliz para siempre. ¡FIN! 🌟`
        : `Once upon a time, ${kidName} was ${charText} who lived in ${placeText}.

One day, ${kidName} decided to ${adventureText}. How exciting!

"Let's go on an adventure!" shouted ${kidName} with joy. Whoosh! Off they went!

After many fun adventures, ${kidName} succeeded. Everyone at Forever Kids Academy celebrated.

And so, ${kidName} lived happily ever after. THE END! 🌟`

      return NextResponse.json({ story: fallbackStory })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    const data = await response.json()
    const story = data.choices?.[0]?.message?.content || 'Story generation failed'

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
