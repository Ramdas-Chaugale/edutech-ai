import * as pdf from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

/**
 * Service to handle PDF extraction and RAG ingestion.
 */
export class PDFService {
  private splitter: RecursiveCharacterTextSplitter;
  private embeddings: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
  }

  /**
   * Extracts text, chunks it, and prepares context.
   */
  async processAndIngest(buffer: Buffer, metadata: Record<string, any>) {
    try {
      console.log("--- Starting PDF Extraction ---");
      const data = await pdf(buffer);
      const text = data.text;

      if (!text || text.trim().length === 0) {
        throw new Error("No readable text found in PDF");
      }

      console.log("--- Chunking Text ---");
      const docs = await this.splitter.createDocuments([text], [metadata]);

      console.log(`--- Processed ${docs.length} segments from PDF ---`);
      
      // In a full production env, we'd upsert to Pinecone here.
      // For this deployment, we return the parsed content so it can be used immediately.
      return {
        success: true,
        chunkCount: docs.length,
        subject: metadata.subject,
        topic: metadata.topic,
        preview: text.substring(0, 500) + "..."
      };
    } catch (error: any) {
      console.error("PDF Processing Error:", error);
      throw new Error(`PDF Service Failure: ${error.message}`);
    }
  }
}

export const pdfService = new PDFService();
