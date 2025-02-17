import { MongoClient, Db } from "mongodb";

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "pidrid"; // Nome do banco

let client: MongoClient;
let db: Db;

// Conecta ao MongoDB (lazy loading)
export const connectDB = async (): Promise<Db> => {
    if (!client) {
        client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DB_NAME);
    }
    return db;
};

// Fecha a conexão com o banco
export const closeDB = async () => {
    if (client) {
        await client.close();
        client = undefined as unknown as MongoClient;
    }
};
