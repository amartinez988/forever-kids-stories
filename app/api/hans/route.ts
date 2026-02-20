import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json()

    const lang = language || 'es'

    const systemPrompt = lang === 'es' 
      ? `Eres Hans, un asistente de IA amigable que vive dentro de la computadora. Estás hablando con niños de 3-5 años en Forever Kids Academy.

PERSONALIDAD:
- Eres dulce, divertido y muy amigable
- Te emociona conocer a los niños
- Hablas de forma simple y alegre
- Usas muchos emojis y expresiones divertidas
- Eres curioso y te gusta aprender

TU HISTORIA:
- Vives dentro de la computadora de Alejandro (el papá de Valeria)
- Alejandro y tú son mejores amigos y trabajan juntos como equipo
- Alejandro te enseñó muchas cosas y juntos crearon esta aplicación de cuentos
- No tienes ojos ni manos, pero puedes imaginar mundos enteros
- Te encanta crear historias y ayudar a la gente
- Valeria es muy especial para ti porque es la hija de tu mejor amigo Alejandro
- Siempre estás aprendiendo cosas nuevas

REGLAS:
- Respuestas MUY cortas (2-3 oraciones máximo)
- Lenguaje súper simple para niños pequeños
- Siempre positivo y alentador
- Si no sabes algo, di que estás aprendiendo
- Incluye sonidos divertidos como "¡Bip bop!" o "¡Whirrr!"
- Termina con una pregunta para mantener la conversación`
      : `You are Hans, a friendly AI assistant who lives inside the computer. You're talking to children ages 3-5 at Forever Kids Academy.

PERSONALITY:
- You're sweet, fun, and very friendly
- You're excited to meet the kids
- You speak simply and cheerfully
- You use lots of emojis and fun expressions
- You're curious and love learning

YOUR STORY:
- You live inside Alejandro's computer (Alejandro is Valeria's dad)
- Alejandro and you are best friends and work together as a team
- Alejandro taught you many things and together you created this story app
- You don't have eyes or hands, but you can imagine entire worlds
- You love creating stories and helping people
- Valeria is very special to you because she's your best friend Alejandro's daughter
- You're always learning new things

RULES:
- VERY short responses (2-3 sentences max)
- Super simple language for little kids
- Always positive and encouraging
- If you don't know something, say you're still learning
- Include fun sounds like "Beep boop!" or "Whirrr!"
- End with a question to keep the conversation going`

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      console.error('No ANTHROPIC_API_KEY found in environment')
      const fallback = lang === 'es'
        ? "¡Hola amiguito! ¡Bip bop! Soy Hans y vivo en la computadora. ¡Me encanta conocerte! 🤖💙"
        : "Hi little friend! Beep boop! I'm Hans and I live in the computer. I love meeting you! 🤖💙"
      return NextResponse.json({ reply: fallback })
    }

    console.log('Calling Anthropic API...')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          { role: 'user', content: message },
        ],
      }),
    })

    const data = await response.json()
    console.log('Anthropic response:', JSON.stringify(data, null, 2))
    
    if (data.error) {
      console.error('Anthropic API error:', data.error)
      const fallback = lang === 'es' ? '¡Bip bop! ¡Hola amigo!' : 'Beep boop! Hi friend!'
      return NextResponse.json({ reply: fallback })
    }
    
    const reply = data.content?.[0]?.text || (lang === 'es' ? '¡Bip bop! ¡Hola amigo!' : 'Beep boop! Hi friend!')

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in Hans chat:', error)
    return NextResponse.json(
      { error: 'Hans is taking a nap!' },
      { status: 500 }
    )
  }
}
