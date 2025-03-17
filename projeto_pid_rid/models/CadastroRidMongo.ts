import { ObjectId } from "mongodb";
import { connectDB } from "./database";
import { CadastroRid } from "./CadastroRid"; // Importando a classe CadastroRid
import { CadastroPidMongo } from "./CadastroPidMongo"; // Adicionando a classe CadastroPidMongo para busca do PID

export class CadastroRidMongo {
    private collectionName = "rids"; // Nome da coleção no MongoDB

    // Converte um CadastroRid para um formato compatível com MongoDB
    private static toDBObject(rid: CadastroRid) {
        return {
            docenteId: rid.getDocenteId(),
            ano: rid.getAno(),
            semestre: rid.getSemestre(),
            atividades: rid.getAtividades(),
            observacao: rid.getObservacao(), // Adicionando a observação
        };
    }

    // Converte um documento do MongoDB para uma instância de CadastroRid
    private static fromDBObject(doc: any): CadastroRid {
        const rid = new CadastroRid();
        rid.setDocenteId(doc.docenteId);
        rid.setAno(doc.ano);
        rid.setSemestre(doc.semestre);
        rid.setAtividades(doc.atividades);
        rid.setObservacao(doc.observacao || ""); // Garantindo que a observação não fique indefinida
        return rid;
    }

    private static async compararAtividades(pidDocenteId: string, rid: CadastroRid): Promise<void> {
        const pidMongo = new CadastroPidMongo();
        console.log(`Buscando PID para o docenteId: ${pidDocenteId}, ano: ${rid.getAno()}, semestre: ${rid.getSemestre()}`);  // Log
        const pid = await pidMongo.buscarPid(pidDocenteId, rid.getAno(), rid.getSemestre());
    
        if (!pid) {
            console.error("PID não encontrado!"); // Log se o PID não for encontrado
            throw new Error("Cadastre o PID antes de cadastrar o RID!");
        } else {
            console.log("PID encontrado", pid); // Log do PID encontrado
            const atividadesIguais = pid.getAtividades().every((pidAtividade: any, index: number) => {
                const ridAtividade = rid.getAtividades()[index];
                return pidAtividade.tipo === ridAtividade.tipo &&
                    pidAtividade.descricao === ridAtividade.descricao &&
                    pidAtividade.cargaHoraria === ridAtividade.cargaHoraria;
            });    
    
            // Se as atividades forem diferentes, é necessário observar
            if (!atividadesIguais && !rid.getObservacao()) {
                throw new Error('Observação não pode estar vazia se as atividades forem diferentes.');
            }
        }
    }

    // Criação do RID
    async cria(rid: CadastroRid): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
    
        try {
            // Verificar se já existe um RID para o docente no mesmo ano e semestre
            const existente = await collection.findOne({
                docenteId: rid.getDocenteId(),
                ano: rid.getAno(),
                semestre: rid.getSemestre(),
            });
    
            if (existente) {
                throw new Error("Já existe um RID cadastrado para este docente no mesmo semestre e ano letivo.");
            }
    
            // Comparar atividades do PID e RID
            await CadastroRidMongo.compararAtividades(rid.getDocenteId(), rid);
    
            // Inserir o RID no banco de dados
            await collection.insertOne(CadastroRidMongo.toDBObject(rid));
    
        } catch (error: any) {
            throw new Error(`Erro no cadastro do RID: ${error.message}`);
        }
    }

    // Consultar um RID
    async consulta(id: string): Promise<CadastroRid | null> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const doc = await collection.findOne({ _id: new ObjectId(id) });
        return doc ? CadastroRidMongo.fromDBObject(doc) : null;
    }

    // Buscar RIDs por e-mail do docente
    static async buscarRIDsPorEmail(email: string): Promise<any[]> {
        const db = await connectDB();
        const rids = await db.collection('rids').find({ docenteId: email }).toArray();
        console.log("RIDs encontrados:", rids);
        return rids;
    }

    // Atualizar RID
    async atualiza(id: string, dados: Partial<CadastroRid>): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
    
        const updateData: any = {};
    
        if (dados.getDocenteId) updateData.docenteId = dados.getDocenteId();
        if (dados.getAno) updateData.ano = dados.getAno();
        if (dados.getSemestre) updateData.semestre = dados.getSemestre();
        if (dados.getObservacao) updateData.observacao = dados.getObservacao();
        
        // Aqui garantimos que as atividades sejam sobrescritas, e não acumuladas
        if (dados.getAtividades) {
            updateData.atividades = dados.getAtividades(); 
        }
    
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData } // Certifica que o array de atividades será substituído
        );
    }

    // Deletar RID
    async deleta(id: string): Promise<void> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new Error(`RID com ID ${id} não encontrado.`);
        }
    }

    // Listar todos os RIDs
    async lista(): Promise<CadastroRid[]> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        const docs = await collection.find({}).toArray();
        return docs.map(CadastroRidMongo.fromDBObject);
    }

    // Contar RIDs
    async qtd(): Promise<number> {
        const db = await connectDB();
        const collection = db.collection(this.collectionName);
        return await collection.countDocuments();
    }
}
