import express, { Router, Request, Response } from 'express';
import { CadastroPidController } from '../controllers/CadastroPidController';

const router: Router = express.Router();
const cadastroPidController = new CadastroPidController();

// Rota para renderizar o formulário de cadastro de PID
router.get('/cadastrarPid', (req: Request, res: Response) => {
    const nomeDocente = req.query.docenteNome as string; // Pega o nome do docente da query string
    res.render('cadastrarPid', { title: 'Cadastro de PID', docenteNome: nomeDocente });
});

// Rota para cadastrar um novo PID
router.post('/newpid', cadastroPidController.cadastrar);

// Rota para atualizar um PID existente
router.put('/projeto_pid_rid/:id', cadastroPidController.atualizar);

// Rota para excluir um PID
router.delete('/projeto_pid_rid/:id', cadastroPidController.excluir);

// Rota para listar todos os PIDs
router.get('/', cadastroPidController.listar);

// Rota para renderizar o formulário de cadastro de PID


export default router;
