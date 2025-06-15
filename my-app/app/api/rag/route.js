import { NextResponse } from 'next/server'
import { loadDocuments } from '../../../lib/documentLoader'
import { generateResponse } from '../../../lib/gemini'

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

    const documents = await loadDocuments()
    const context = documents.map(doc => doc.content).join('\n\n')
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