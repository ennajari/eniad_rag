import fs from 'fs/promises'
import path from 'path'
import pdf from 'pdf-parse'

export async function loadDocuments() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    const files = await fs.readdir(dataDir)
    const documents = []

    for (const file of files) {
      const filePath = path.join(dataDir, file)
      const ext = path.extname(file).toLowerCase()

      // Ignorer les fichiers .docx temporairement
      if (ext === '.docx') {
        console.log(`Fichier DOCX ignoré: ${file}`)
        continue
      }

      try {
        let content = ''
        
        if (ext === '.pdf') {
          const dataBuffer = await fs.readFile(filePath)
          const data = await pdf(dataBuffer)
          content = data.text
        } else if (ext === '.txt' || ext === '.md') {
          content = await fs.readFile(filePath, 'utf-8')
        }

        if (content) {
          documents.push({
            filename: file,
            content,
            metadata: { source: filePath }
          })
        }
      } catch (error) {
        console.error(`Error loading ${file}:`, error)
      }
    }
    return documents
  } catch (error) {
    console.error('Error reading data directory:', error)
    return []
  }
}