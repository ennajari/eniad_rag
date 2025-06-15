'use client'
import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })
      
      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error('Error:', error)
      setAnswer('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Système RAG ENIAD</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 border rounded w-full mb-2"
          placeholder="Posez votre question..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isLoading ? 'Recherche...' : 'Envoyer'}
        </button>
      </form>
      {answer && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Réponse :</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}