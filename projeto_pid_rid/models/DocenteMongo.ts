import { ObjectId } from "mongodb";
import { connectDB } from "./database";
import { Docente } from "./Docente";

export class DocenteMongo {
    private collectionName = "docentes"; // Nome da coleção no MongoDB

    // Converte um Docente para um formato compatível com MongoDB
    private static toDBObject(docente: Docente) {
        return {
            nome: docente.getNome(),
            cpf: docente.getCpf(),
            siape: docente.getSiape(),
            email: docente.getEmail(),
            senha: docente.getSenha(),
            tipoServidor: docente.getTipoServidor(),
            regimeTrabalho: docente.getRegimeTrabalho()
        };
    }

    // Converte um documento do MongoDB para uma instância de Docente
    private static fromDBObject(doc: any): Docente {
        const docente = new Docente();
        docente.setNome(doc.nome);
        docente.setCpf(doc.cpf);
        docente.setSiape(doc.siape);
        docente.setEmail(doc.email);
        docente.setSenha(doc.senha);
        docente.setTipoServidor(doc.tipoServidor);
        docente.setRegimeTrabalho(doc.regimeTrabalho);
        return docente;
    }

    async cria(docente: Docente): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        await collection.insertOne(DocenteMongo.toDBObject(docente));
    }

    async consulta(id: string): Promise<Docente | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const doc = await collection.findOne({ _id: new ObjectId(id) });
        return doc ? DocenteMongo.fromDBObject(doc) : null;
    }

    async atualiza(id: string, dados: Partial<Docente>): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        
        // Converte os dados parciais para um objeto que o MongoDB pode entender
        const updateData = {
            ...(dados.getNome && { nome: dados.getNome() }),
            ...(dados.getCpf && { cpf: dados.getCpf() }),
            ...(dados.getSiape && { siape: dados.getSiape() }),
            ...(dados.getEmail && { email: dados.getEmail() }),
            ...(dados.getSenha && { senha: dados.getSenha() }),
            ...(dados.getTipoServidor && { tipoServidor: dados.getTipoServidor() }),
            ...(dados.getRegimeTrabalho && { regimeTrabalho: dados.getRegimeTrabalho() })
        };

        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    }

    async deleta(id: string): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new Error(`Docente com ID ${id} não encontrado.`);
        }
    }

    async lista(): Promise<Docente[]> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const docs = await collection.find({}).toArray();
        return docs.map(DocenteMongo.fromDBObject);
    }

    async qtd(): Promise<number> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.countDocuments();
    }
}
