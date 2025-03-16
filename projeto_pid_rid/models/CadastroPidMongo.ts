import { ObjectId } from "mongodb";
import { connectDB } from "./database";
import { CadastroPid } from "./CadastroPid"; // Importando a classe CadastroPid

export class CadastroPidMongo {
    private collectionName = "pids"; // Nome da coleção no MongoDB

    // Converte um CadastroPid para um formato compatível com MongoDB
    private static toDBObject(pid: CadastroPid) {
        console.log("Convertendo PID para objeto MongoDB:", JSON.stringify(pid, null, 2));
        return {
            docenteId: pid.getDocenteId(),
            ano: pid.getAno(),
            semestre: pid.getSemestre(),
            atividades: pid.getAtividades(),
            observacao: pid.getObservacao(), // Adicionando a observação
        };
    }

    // Converte um documento do MongoDB para uma instância de CadastroPid
    private static fromDBObject(doc: any): CadastroPid {
        const pid = new CadastroPid();
        pid.setDocenteId(doc.docenteId);
        pid.setAno(doc.ano);
        pid.setSemestre(doc.semestre);
        pid.setAtividades(doc.atividades);
        pid.setObservacao(doc.observacao || ""); // Garantindo que a observação não fique indefinida
        return pid;
    }

    async cria(pid: CadastroPid): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);

        const existente = await collection.findOne({
            docenteId: pid.getDocenteId(),
            ano: pid.getAno(),
            semestre: pid.getSemestre(),
        })

        if(existente){
            throw new Error("Já existe um PID cadastrado para este docente no mesmo semestre e ano letivo.");

        }
        await collection.insertOne(CadastroPidMongo.toDBObject(pid));
    }

    async consulta(id: string): Promise<CadastroPid | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const doc = await collection.findOne({ _id: new ObjectId(id) });
        return doc ? CadastroPidMongo.fromDBObject(doc) : null;
    }
    
    static async buscarPIDsPorCPF(cpf: string): Promise<any[]> {
        const db = await connectDB(); // Conecta ao banco de dados
        const pids = await db.collection('pids').find({ cpf }).toArray(); // Busca os PIDs por CPF
        return pids;
    }

    static async buscarPIDsPorEmail(email: string): Promise<any[]> {
        const db = await connectDB(); // Conecta ao banco de dados
        const pids = await db.collection('pids').find({ docenteId: email }).toArray(); // Busca os PIDs por email
        return pids;
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
            ...(dados.getObservacao && { observacao: dados.getObservacao() }), // Adicionando a observação
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
