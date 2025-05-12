import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // En développement, utilisez une variable globale pour éviter les connexions multiples
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production, c'est préférable d'utiliser une nouvelle connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Test de la connexion
clientPromise
  .then(() => {
    console.log("✅ Connexion MongoDB établie");
  })
  .catch((err) => {
    console.error("❌ Erreur lors de la connexion MongoDB:", err);
    process.exit(1); // Arrêter l'application si la connexion échoue
  });

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return { client, db };
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
