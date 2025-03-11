import { Request, Response, NextFunction } from 'express';
import { CadastroPid } from '../models/CadastroPid'; 
import { CadastroPidMongo } from '../models/CadastroPidMongo'; 
import { DocenteMongo } from '../models/DocenteMongo'; // Importando o MongoDB para Docente


class CadastroPidController {

    // Método para cadastrar um novo PID
    // async cadastrar(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { docenteId, ano, semestre, atividades, observacao } = req.body;

    //         const cadastroPid = new CadastroPid();
    //         cadastroPid.setDocenteId(docenteId);
    //         cadastroPid.setAno(ano);
    //         cadastroPid.setSemestre(semestre);
    //         cadastroPid.setAtividades(atividades);
    //         cadastroPid.setObservacao(observacao);

    //         const cadastroPidMongo = new CadastroPidMongo();
    //         await cadastroPidMongo.cria(cadastroPid);

    //         res.status(201).json({ message: 'PID cadastrado com sucesso!' });
    //     } catch (error: unknown) { // Aqui definimos o tipo como `unknown`
    //         if (error instanceof Error) {
    //             res.status(400).json({ message: error.message || 'Erro ao cadastrar o PID.' });
    //         } else {
    //             res.status(400).json({ message: 'Erro desconhecido ao cadastrar o PID.' });
    //         }
    //     }
    // }

     // Método para cadastrar um novo PID
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
                    


        try {
            const docenteEmail = (req.session as any).docente.email;
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail);

            console.log('Docente da sessão:', (req.session as any).docente); 
    
            // Criar a instância do PID
            const pid = new CadastroPid();
            pid.setDocenteId(docenteEmail);
            console.log(docenteEmail);
            pid.setAno(ano);
            pid.setSemestre(parseInt(semestre, 10));
            pid.setAtividades(atividades);
            pid.setObservacao(observacao);
    
            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.cria(pid);
            console.log('PID salvo com sucesso!');

            (req.session as any).successMessage = "PID CADASTRADO COM SUCESSO!";
            
            res.redirect('/docente/pids');
        } catch (error) {
            console.error(error);
            res.render('index', { errorMessage: 'Erro ao cadastrar o PID!' });
        }
    }

    // Método para atualizar um PID existente
    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { docenteId, ano, semestre, atividades, observacao } = req.body;

            const cadastroPid = new CadastroPid();
            if (docenteId) cadastroPid.setDocenteId(docenteId);
            if (ano) cadastroPid.setAno(ano);
            if (semestre) cadastroPid.setSemestre(semestre);
            if (atividades) cadastroPid.setAtividades(atividades);
            if (observacao) cadastroPid.setObservacao(observacao);

            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.atualiza(id, cadastroPid);

            res.status(200).json({ message: 'PID atualizado com sucesso!' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao atualizar o PID.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao atualizar o PID.' });
            }
        }
    }

    // Método para excluir um PID
    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;

            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.deleta(id);

            res.status(200).json({ message: 'PID excluído com sucesso!' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao excluir o PID.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao excluir o PID.' });
            }
        }
    }

    // Método para listar todos os PIDs
    // async listar(req: Request, res: Response): Promise<void> {
    //     try {
    //         const cadastroPidMongo = new CadastroPidMongo();
    //         const pids = await cadastroPidMongo.lista();

    //         res.status(200).json(pids);
    //     } catch (error: unknown) {
    //         if (error instanceof Error) {
    //             res.status(400).json({ message: error.message || 'Erro ao listar os PIDs.' });
    //         } else {
    //             res.status(400).json({ message: 'Erro desconhecido ao listar os PIDs.' });
    //         }
    //     }
    // }

     // Método para listar os PIDs do docente
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
    
            const pids = await CadastroPidMongo.buscarPIDsPorEmail(docente.getEmail());
            console.log('PIDs encontrados:', pids);  // Adicione isso para verificar os dados
            res.render('pids', { title: 'Meus PIDs', pids, docenteNome: docente.getNome(), successMessage });
            console.log('PIDs para renderizar:', pids);
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar os PIDs' });
        }
     }
    }

export { CadastroPidController };
