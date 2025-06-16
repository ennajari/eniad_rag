import { NextResponse } from 'next/server'
import { loadDocuments } from '../../../lib/documentLoader'
import { generateResponse } from '../../../lib/gemini'
import { getVectorStore } from '../../../lib/vectorStore'

export async function POST(request) {
  try {
    const requestBody = await request.text()
    if (!requestBody) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      )
    }

    const { question } = JSON.parse(requestBody)
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Charger les documents si nécessaire (première exécution)
    await loadDocuments()
    
    // Rechercher les documents pertinents avec le vectorStore
    const vectorStore = await getVectorStore()
    const relevantDocs = await vectorStore.similaritySearch(question, 3)
    
    // Extraire le contenu des documents pertinents
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n')
    
    // Générer une réponse basée sur les documents pertinents
    const answer = await generateResponse(question, context)

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('RAG error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
