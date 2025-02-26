import { Request, Response, NextFunction } from 'express';
import { CadastroPid } from '../models/CadastroPid'; 
import { CadastroPidMongo } from '../models/CadastroPidMongo'; 

class CadastroPidController {

    // Método para cadastrar um novo PID
    async cadastrar(req: Request, res: Response): Promise<void> {
        try {
            const { docenteId, ano, semestre, atividades, observacao } = req.body;

            const cadastroPid = new CadastroPid();
            cadastroPid.setDocenteId(docenteId);
            cadastroPid.setAno(ano);
            cadastroPid.setSemestre(semestre);
            cadastroPid.setAtividades(atividades);
            cadastroPid.setObservacao(observacao);

            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.cria(cadastroPid);

            res.status(201).json({ message: 'PID cadastrado com sucesso!' });
        } catch (error: unknown) { // Aqui definimos o tipo como `unknown`
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao cadastrar o PID.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao cadastrar o PID.' });
            }
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
    async listar(req: Request, res: Response): Promise<void> {
        try {
            const cadastroPidMongo = new CadastroPidMongo();
            const pids = await cadastroPidMongo.lista();

            res.status(200).json(pids);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao listar os PIDs.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao listar os PIDs.' });
            }
        }
    }
}

export { CadastroPidController };
