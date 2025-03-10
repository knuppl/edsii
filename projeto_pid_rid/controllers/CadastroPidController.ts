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
        const { ano, semestre, atividades, observacao, docenteEmail } = req.body;

        try {
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail); // Usando o email para achar o docente

            if (!docente) {
                return res.render('index', { errorMessage: 'Docente não encontrado!' });
            }

            // Criar a instância do PID
            const pid = new CadastroPid();
            pid.setDocenteId(docente.getEmail()); // Usando o email como docente ID
            pid.setAno(ano);
            pid.setSemestre(semestre);
            pid.setAtividades(atividades);
            pid.setObservacao(observacao);

            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.cria(pid);  // Inserindo o PID no MongoDB

            res.redirect('/docente/pids'); // Redirecionando para a lista de PIDs

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
    const docenteEmail = req.query.docenteEmail as string; // Obter o email do docente como parâmetro

    try {
        const docenteMongo = new DocenteMongo();
        const docente = await docenteMongo.consultaPorUsuario(docenteEmail); // Consultar pelo email

        if (!docente) {
            return res.render('index', { errorMessage: 'Docente não encontrado!' });
        }

        // Buscar os PIDs do docente
        const pids = await CadastroPidMongo.buscarPIDsPorCPF(docente.getCpf()); // Usar o CPF para buscar PIDs

        // Renderiza a página de PIDs, passando os PIDs e o nome do docente
        res.render('pids', { title: 'Meus PIDs', pids: pids, docenteNome: docente.getNome() });

    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Erro ao carregar os PIDs' });
    }
}
}

export { CadastroPidController };
