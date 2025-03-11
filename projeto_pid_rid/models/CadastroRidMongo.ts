import { ObjectId } from "mongodb";
import { connectDB } from "./database";
import { CadastroRid } from "./CadastroRid"; // Importando a classe Cadastrorid

export class CadastroRidMongo {
    private collectionName = "rids"; // Nome da coleção no MongoDB

    // Converte um Cadastrorid para um formato compatível com MongoDB
    private static toDBObject(rid: CadastroRid) {
        return {
            docenteId: rid.getDocenteId(),
            ano: rid.getAno(),
            semestre: rid.getSemestre(),
            atividades: rid.getAtividades(),
            observacao: rid.getObservacao(), // Adicionando a observação
        };
    }

    // Converte um documento do MongoDB para uma instância de Cadastrorid
    private static fromDBObject(doc: any): CadastroRid {
        const rid = new CadastroRid();
        rid.setDocenteId(doc.docenteId);
        rid.setAno(doc.ano);
        rid.setSemestre(doc.semestre);
        rid.setAtividades(doc.atividades);
        rid.setObservacao(doc.observacao || ""); // Garantindo que a observação não fique indefinida
        return rid;
    }

    async cria(rid: CadastroRid): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        await collection.insertOne(CadastroRidMongo.toDBObject(rid));
    }

    async consulta(id: string): Promise<CadastroRid | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const doc = await collection.findOne({ _id: new ObjectId(id) });
        return doc ? CadastroRidMongo.fromDBObject(doc) : null;
    }
    
    static async buscarridsPorCPF(cpf: string): Promise<any[]> {
        const db = await connectDB(); // Conecta ao banco de dados
        const rids = await db.collection('rids').find({ cpf }).toArray(); // Busca os rids por CPF
        return rids;
    }

    static async buscarRIDsPorEmail(email: string): Promise<any[]> {
        const db = await connectDB(); // Conecta ao banco de dados
        const rids = await db.collection('rids').find({ docenteId: email }).toArray(); // Busca os PIDs por email
        console.log("RIDs encontrados:", rids); // Verifique o que está sendo retornado
        return rids;
    }

    async atualiza(id: string, dados: Partial<CadastroRid>): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);

        // Converte os dados parciais para um objeto que o MongoDB pode entender
        const updateData = {
            ...(dados.getDocenteId && { docenteId: dados.getDocenteId() }),
            ...(dados.getAno && { ano: dados.getAno() }),
            ...(dados.getSemestre && { semestre: dados.getSemestre() }),
            ...(dados.getAtividades && { atividades: dados.getAtividades() }),
            ...(dados.getObservacao && { observacao: dados.getObservacao() }), // Adicionando a observação
        };

        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    }

    async deleta(id: string): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new Error(`rid com ID ${id} não encontrado.`);
        }
    }

    async lista(): Promise<CadastroRid[]> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const docs = await collection.find({}).toArray();
        return docs.map(CadastroRidMongo.fromDBObject);
    }

    async qtd(): Promise<number> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.countDocuments();
    }
}
