import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateResponse(prompt, context) {
  const model = genAI.getGenerativeModel({ 
    model: process.env.MODEL || "gemini-1.5-flash"
  })

  const fullPrompt = `
    Contexte:
    ${context}
    
    Question:
    ${prompt}
    
    Réponds précisément en te basant uniquement sur le contexte fourni.
    Si l'information n'est pas dans le contexte, réponds "Je ne trouve pas cette information dans les documents."
  `

  try {
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating response:", error)
    return "Désolé, une erreur s'est produite lors de la génération de la réponse."
  }
}