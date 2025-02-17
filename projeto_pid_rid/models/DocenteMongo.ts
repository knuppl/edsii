import { ObjectId } from "mongodb";
import { connectDB } from "./database";

interface IDocente {
    _id: ObjectId; 
    nome: string;
    cpf: string;
    siape: string;
    email: string;
    senha: string;
    tipoServidor: string;
    regimeTrabalho: number;
}


export class DocenteMongo {
    private collectionName = "docentes"; // Nome da coleção no MongoDB

    async cria(docente: IDocente): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        await collection.insertOne(docente);
    }

    async consulta(id: string): Promise<IDocente | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const docente = await collection.findOne({ _id: new ObjectId(id) });
        return docente as IDocente | null;
    }

    async atualiza(id: string, dados: Partial<IDocente>): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async deleta(id: string): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
            throw new Error(`Docente com ID ${id} não encontrado.`);
        }
    }
    

    async lista(): Promise<IDocente[]> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.find({}).toArray() as IDocente[];
    }

    async qtd(): Promise<number> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.countDocuments();
    }
}
