import { Request, Response, NextFunction } from 'express';
import { CadastroRid } from '../models/CadastroRid'; 
import { CadastroRidMongo } from '../models/CadastroRidMongo'; 
import { DocenteMongo } from '../models/DocenteMongo'; // Importando o MongoDB para Docente


class CadastroRidController {
    
     // Método para cadastrar um novo rid
    async cadastrar(req: Request, res: Response): Promise<void> {
        if (!(req.session as any).docente) {
            return res.status(401).render('login', { errorMessage: 'Você precisa estar logado para realizar o cadastro!' });
        }
    
        const { ano, semestre, observacao } = req.body;
    
        // Obtendo as atividades
        const atividades = req.body.atividades.map((atividade: any) => ({
            tipo: atividade.tipo,
            descricao: atividade.descricao,
            cargaHoraria: parseInt(atividade.cargaHoraria, 10),
        }));
    
        // Soma da carga horária das atividades
        const cargaHorariaTotal = atividades.reduce((total: number, atividade: { cargaHoraria: number; }) => total + atividade.cargaHoraria, 0);
    
        try {
            const docenteEmail = (req.session as any).docente.email;
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail);
    
            // Verificar se a carga horária total corresponde ao regime de trabalho do docente
            const regimeDeTrabalho = docente?.getRegimeTrabalho();
    
            if (cargaHorariaTotal !== regimeDeTrabalho) {
                return res.render('index', { errorMessage: `A carga horária total das atividades (${cargaHorariaTotal} horas) deve ser igual ao regime de trabalho do docente (${regimeDeTrabalho} horas).` });
            }
    
            console.log('Docente da sessão:', (req.session as any).docente);
    
            // Criar a instância do rid
            const rid = new CadastroRid();
            rid.setDocenteId(docenteEmail);
            rid.setAno(ano);
            rid.setSemestre(parseInt(semestre, 10));
            rid.setAtividades(atividades);
            rid.setObservacao(observacao);
    
            const cadastroridMongo = new CadastroRidMongo();
            await cadastroridMongo.cria(rid);
            console.log('rid salvo com sucesso!');
    
            (req.session as any).successMessage = "RID CADASTRADO COM SUCESSO!";
    
            res.redirect('/docente/pids');
        } catch (error) {
            console.error(error);
    
            // Se for erro de rid duplicado, exibe no formulário sem redirecionar para o login
            if (error instanceof Error && error.message.includes("Já existe um rid cadastrado")) {
                return res.render('index', { errorMessage: error.message });
            }
    
            res.render('index', { errorMessage: 'Erro ao cadastrar o rid!' });
        }
    }

    // Método para listar os rids do docente
    async listar(req: Request, res: Response): Promise<void> {
        console.log('Sessão atual:', req.session); // Verificar o conteúdo da sessão
        const successMessage = (req.session as any).successMessage;

        const docenteEmail = (req.session as any)?.docente?.email;
        if (!docenteEmail) {
            return res.render('index', { errorMessage: 'Sessão inválida ou expirada!' });
        }
    
        try {
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail);
    
            if (!docente) {
                return res.render('index', { errorMessage: 'Docente não encontrado!' });
            }
    
            const rids = await CadastroRidMongo.buscarRIDsPorEmail(docente.getEmail());
            console.log('Dados dos RIDs antes do render:', rids);
            res.render('pids', { title: 'Meus RIDs', rids, docenteNome: docente.getNome(), successMessage });
            console.log('RIDs para renderizar:', rids);
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar os RIDs' });
        }
     }

     // Método para excluir um rid
    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;

            const cadastroridMongo = new CadastroRidMongo();
            await cadastroridMongo.deleta(id);

            //res.status(200).json({ message: 'rid excluído com sucesso!' });
             // Após a exclusão, redireciona de volta para a página de PIDs/RIDs
            res.redirect('/projeto_pid_rid/pids-rids');
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao excluir o rid.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao excluir o rid.' });
            }
        }
    }

    async editar(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const cadastroRidMongo = new CadastroRidMongo();
            const rid = await cadastroRidMongo.consulta(id);
    
            if (!rid) {
                return res.render('error', { message: 'RID não encontrado.' });
            }
    
            // Agrupar atividades por tipo
            const atividadesAgrupadas = rid.getAtividades().reduce((acc, atividade) => {
                if (!acc[atividade.tipo]) {
                    acc[atividade.tipo] = [];
                }
                acc[atividade.tipo].push(atividade);
                return acc;
            }, {} as Record<string, any[]>);
    
            console.log('Dados RID:', { rid }); 
            // Passa o RID e as atividades agrupadas para a view de edição
            res.render('editarRid', { id, rid, atividadesAgrupadas, observacao: rid.getObservacao() });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar o RID para edição.' });
        }
    }

  async atualizar(req: Request, res: Response): Promise<void> {
    const { id, docenteId, ano, semestre, atividades, observacao } = req.body;

    console.log('Dados recebidos:', { id, docenteId, ano, semestre, atividades, observacao }); // Log para depuração

    try {
        const cadastroRidMongo = new CadastroRidMongo();
        const rid = new CadastroRid();
        
        rid.setAno(Number(ano)); // Converte para número
        rid.setSemestre(Number(semestre)); // Converte para número
        rid.setDocenteId(docenteId)

        // Processa as atividades
        const atividadesProcessadas = Object.values(atividades).map((atividade: any) => ({
            tipo: atividade.tipo,
            descricao: atividade.descricao,
            cargaHoraria: Number(atividade.cargaHoraria), // Converte para número
        }));

        rid.setAtividades(atividadesProcessadas); // Passando as atividades processadas
        rid.setObservacao(observacao);

        // Atualizando o RID no banco
        await cadastroRidMongo.atualiza(id, rid);

        res.redirect('/projeto_pid_rid/pids-rids'); // Redireciona após atualização
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Erro ao atualizar o RID.' });
    }
}

async visualizar(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
        const cadastroRidMongo = new CadastroRidMongo();
        const rid = await cadastroRidMongo.consulta(id);

        if (!rid) {
            return res.render('error', { message: 'RID não encontrado.' });
        }

        // Agrupar atividades por tipo
        const atividadesAgrupadas = rid.getAtividades().reduce((acc, atividade) => {
            if (!acc[atividade.tipo]) {
                acc[atividade.tipo] = [];
            }
            acc[atividade.tipo].push(atividade);
            return acc;
        }, {} as Record<string, any[]>);

        res.render('visualizarRid', { 
            id, 
            rid, 
            atividadesAgrupadas, 
            observacao: rid.getObservacao() 
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Erro ao carregar o RID para visualização.' });
    }
}
     
    }

export { CadastroRidController };
