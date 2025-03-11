import { Request, Response, NextFunction } from 'express';
import { CadastroRid } from '../models/CadastroRid'; 
import { CadastroRidMongo } from '../models/CadastroRidMongo'; 
import { DocenteMongo } from '../models/DocenteMongo'; // Importando o MongoDB para Docente


class CadastroRidController {

    // Método para cadastrar um novo rid
    // async cadastrar(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { docenteId, ano, semestre, atividades, observacao } = req.body;

    //         const cadastrorid = new Cadastrorid();
    //         cadastrorid.setDocenteId(docenteId);
    //         cadastrorid.setAno(ano);
    //         cadastrorid.setSemestre(semestre);
    //         cadastrorid.setAtividades(atividades);
    //         cadastrorid.setObservacao(observacao);

    //         const cadastroridMongo = new CadastroridMongo();
    //         await cadastroridMongo.cria(cadastrorid);

    //         res.status(201).json({ message: 'rid cadastrado com sucesso!' });
    //     } catch (error: unknown) { // Aqui definimos o tipo como `unknown`
    //         if (error instanceof Error) {
    //             res.status(400).json({ message: error.message || 'Erro ao cadastrar o rid.' });
    //         } else {
    //             res.status(400).json({ message: 'Erro desconhecido ao cadastrar o rid.' });
    //         }
    //     }
    // }

     // Método para cadastrar um novo rid
     async cadastrar(req: Request, res: Response): Promise<void> {
        if (!(req.session as any).docente) {
            return res.status(401).render('login', { errorMessage: 'Você precisa estar logado para realizar o cadastro!' });
        }
    
        const { ano, semestre, observacao } = req.body;
    
        // Verifique manualmente as atividades no corpo da requisição
        const atividades = req.body.atividades.map((atividade: any) => ({
            tipo: atividade.tipo,
            descricao: atividade.descricao,
            cargaHoraria: parseInt(atividade.cargaHoraria, 10),
        }));
                    
        console.log('Atividades:', atividades); // Verifique se as atividades estão sendo montadas corretamente
        console.log('Corpo da requisição:', req.body);

        try {
            const docenteEmail = (req.session as any).docente.email;
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail);

            console.log('Docente da sessão:', (req.session as any).docente); 
    
            // Criar a instância do rid
            const rid = new CadastroRid();
            rid.setDocenteId(docenteEmail);
            console.log(docenteEmail);
            rid.setAno(ano);
            rid.setSemestre(parseInt(semestre, 10));
            rid.setAtividades(atividades);
            rid.setObservacao(observacao);
    
            const cadastroridMongo = new CadastroRidMongo();
            await cadastroridMongo.cria(rid);

            (req.session as any).successMessage = "RID CADASTRADO COM SUCESSO!";
    
            res.redirect('/docente/pids');
        } catch (error) {
            console.error(error);
            res.render('index', { errorMessage: 'Erro ao cadastrar o rid!' });
        }
    }

    // Método para atualizar um rid existente
    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { docenteId, ano, semestre, atividades, observacao } = req.body;

            const cadastrorid = new CadastroRid();
            if (docenteId) cadastrorid.setDocenteId(docenteId);
            if (ano) cadastrorid.setAno(ano);
            if (semestre) cadastrorid.setSemestre(semestre);
            if (atividades) cadastrorid.setAtividades(atividades);
            if (observacao) cadastrorid.setObservacao(observacao);

            const cadastroridMongo = new CadastroRidMongo();
            await cadastroridMongo.atualiza(id, cadastrorid);

            res.status(200).json({ message: 'rid atualizado com sucesso!' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao atualizar o rid.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao atualizar o rid.' });
            }
        }
    }

    // Método para excluir um rid
    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;

            const cadastroridMongo = new CadastroRidMongo();
            await cadastroridMongo.deleta(id);

            res.status(200).json({ message: 'rid excluído com sucesso!' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao excluir o rid.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao excluir o rid.' });
            }
        }
    }

    // Método para listar todos os rids
    // async listar(req: Request, res: Response): Promise<void> {
    //     try {
    //         const cadastroridMongo = new CadastroridMongo();
    //         const rids = await cadastroridMongo.lista();

    //         res.status(200).json(rids);
    //     } catch (error: unknown) {
    //         if (error instanceof Error) {
    //             res.status(400).json({ message: error.message || 'Erro ao listar os rids.' });
    //         } else {
    //             res.status(400).json({ message: 'Erro desconhecido ao listar os rids.' });
    //         }
    //     }
    // }

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
    
            const pids = await CadastroRidMongo.buscarRIDsPorEmail(docente.getEmail());
    
            res.render('rids', { title: 'Meus RIDs', pids, docenteNome: docente.getNome(), successMessage });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar os PIDs' });
        }
     }
    }

export { CadastroRidController };
