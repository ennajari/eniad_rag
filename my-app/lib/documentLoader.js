import fs from 'fs/promises'
import path from 'path'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import { indexDocuments } from './vectorStore'

export async function loadDocuments() {
  const dataDir = path.join(process.cwd(), 'data')
  
  try {
    // Créer le répertoire de données s'il n'existe pas
    await fs.mkdir(dataDir, { recursive: true });
    
    // Vérifier s'il y a des fichiers dans le répertoire
    const files = await fs.readdir(dataDir)
    const documents = []

    for (const file of files) {
      // Ignorer les sous-répertoires comme vector_store
      const filePath = path.join(dataDir, file)
      const stats = await fs.stat(filePath)
      
      if (stats.isDirectory()) {
        continue;
      }
      
      const ext = path.extname(file).toLowerCase()

      try {
        let content = ''
        
        if (ext === '.pdf') {
          const dataBuffer = await fs.readFile(filePath)
          const data = await pdf(dataBuffer)
          content = data.text
        } else if (ext === '.docx') {
          const dataBuffer = await fs.readFile(filePath)
          const result = await mammoth.extractRawText({ buffer: dataBuffer })
          content = result.value
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
    
    // Indexer les documents dans le vectorStore
    if (documents.length > 0) {
      await indexDocuments(documents)
    }
    
    return documents
  } catch (error) {
    console.error('Error reading data directory:', error)
    return []
  }
}
