import { ObjectId } from "mongodb";
import { connectDB } from "./database";
import { CadastroPid } from "./CadastroPid"; // Importando a classe CadastroPid

export class CadastroPidMongo {
    private collectionName = "pids"; // Nome da coleção no MongoDB

    // Converte um CadastroPid para um formato compatível com MongoDB
    private static toDBObject(pid: CadastroPid) {
        return {
            docenteId: pid.getDocenteId(),
            ano: pid.getAno(),
            semestre: pid.getSemestre(),
            atividades: pid.getAtividades(),
        };
    }

    // Converte um documento do MongoDB para uma instância de CadastroPid
    private static fromDBObject(doc: any): CadastroPid {
        const pid = new CadastroPid();
        pid.setDocenteId(doc.docenteId);
        pid.setAno(doc.ano);
        pid.setSemestre(doc.semestre);
        pid.setAtividades(doc.atividades);
        return pid;
    }

    async cria(pid: CadastroPid): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        await collection.insertOne(CadastroPidMongo.toDBObject(pid));
    }

    async consulta(id: string): Promise<CadastroPid | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const doc = await collection.findOne({ _id: new ObjectId(id) });
        return doc ? CadastroPidMongo.fromDBObject(doc) : null;
    }

    async atualiza(id: string, dados: Partial<CadastroPid>): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);

        // Converte os dados parciais para um objeto que o MongoDB pode entender
        const updateData = {
            ...(dados.getDocenteId && { docenteId: dados.getDocenteId() }),
            ...(dados.getAno && { ano: dados.getAno() }),
            ...(dados.getSemestre && { semestre: dados.getSemestre() }),
            ...(dados.getAtividades && { atividades: dados.getAtividades() }),
        };

        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    }

    async deleta(id: string): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new Error(`PID com ID ${id} não encontrado.`);
        }
    }

    async lista(): Promise<CadastroPid[]> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const docs = await collection.find({}).toArray();
        return docs.map(CadastroPidMongo.fromDBObject);
    }

    async qtd(): Promise<number> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.countDocuments();
    }
}