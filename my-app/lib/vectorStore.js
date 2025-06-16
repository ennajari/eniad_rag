
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";
import path from "path";

// Chemin vers le répertoire de stockage des vecteurs
const VECTOR_STORE_PATH = path.join(process.cwd(), "data", "vector_store.json");

// Instance du vectorStore
let vectorStoreInstance = null;
let documentsCache = [];

// Fonction pour initialiser ou charger le vectorStore
export async function getVectorStore() {
  if (vectorStoreInstance) {
    return vectorStoreInstance;
  }

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "embedding-001"
  });

  try {
    // Vérifier si le fichier de stockage existe
    await fs.access(VECTOR_STORE_PATH);

    // Charger le vectorStore existant
    console.log("Chargement du vectorStore existant...");
    const data = await fs.readFile(VECTOR_STORE_PATH, 'utf8');
    const parsedData = JSON.parse(data);

    // Recréer le vectorStore avec les données sauvegardées
    vectorStoreInstance = new MemoryVectorStore(embeddings);
    if (parsedData.documents && parsedData.documents.length > 0) {
      documentsCache = parsedData.documents;
      await vectorStoreInstance.addDocuments(parsedData.documents);
    }
    console.log("VectorStore chargé avec succès");
  } catch (error) {
    console.error("Erreur lors du chargement du vectorStore:", error);
    // Si le fichier n'existe pas, créer un nouveau vectorStore
    console.log("Création d'un nouveau vectorStore...");
    vectorStoreInstance = new MemoryVectorStore(embeddings);
  }

  return vectorStoreInstance;
}

// Fonction pour indexer les documents
export async function indexDocuments(documents) {
  const vectorStore = await getVectorStore();

  // Convertir les documents au format attendu par LangChain
  const docs = documents.map(doc => ({
    pageContent: doc.content,
    metadata: doc.metadata
  }));

  // Ajouter les documents au vectorStore
  await vectorStore.addDocuments(docs);

  // Mettre à jour le cache des documents
  documentsCache.push(...docs);

  // Sauvegarder le vectorStore dans un fichier
  await saveVectorStore();

  return vectorStore;
}

// Fonction pour sauvegarder le vectorStore
export async function saveVectorStore() {
  if (!vectorStoreInstance) {
    console.log("Aucun vectorStore à sauvegarder");
    return;
  }

  try {
    // Créer le répertoire s'il n'existe pas
    const dir = path.dirname(VECTOR_STORE_PATH);
    await fs.mkdir(dir, { recursive: true });

    // Utiliser le cache des documents pour la sauvegarde
    const data = {
      documents: documentsCache,
      timestamp: new Date().toISOString()
    };

    // Sauvegarder le vectorStore dans un fichier JSON
    await fs.writeFile(VECTOR_STORE_PATH, JSON.stringify(data, null, 2));
    console.log("VectorStore sauvegardé avec succès");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du vectorStore:", error);
  }
}






