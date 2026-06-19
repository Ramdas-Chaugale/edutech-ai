import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("Missing PINECONE_API_KEY");
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = process.env.PINECONE_INDEX || "edutech-ai";

/**
 * Initializes the Pinecone index if it doesn't exist.
 * Uses 1536 dimensions (Standard for OpenAI text-embedding-3-small).
 */
export const initPinecone = async () => {
  const existingIndexes = await pinecone.listIndexes();
  const indexExists = existingIndexes.indexes?.some((idx) => idx.name === INDEX_NAME);

  if (!indexExists) {
    console.log(`--- Creating Pinecone Index: ${INDEX_NAME} ---`);
    await pinecone.createIndex({
      name: INDEX_NAME,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  }
};

export const getPineconeIndex = () => {
  return pinecone.index(INDEX_NAME);
};
