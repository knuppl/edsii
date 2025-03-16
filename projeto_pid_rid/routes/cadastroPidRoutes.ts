import express, { Router, Request, Response } from 'express';
import { CadastroPidController } from '../controllers/CadastroPidController';
import { CadastroRidController } from '../controllers/CadastroRidController';


const router: Router = express.Router();
const cadastroPidController = new CadastroPidController();
const cadastroRidController = new CadastroRidController();


// Rota para renderizar o formulário de cadastro de PID
router.get('/cadastrarPid', (req: Request, res: Response) => {
    const nomeDocente = req.query.docenteNome as string; // Pega o nome do docente da query string
    res.render('cadastrarPid', { title: 'Cadastro de PID', docenteNome: nomeDocente });
});

// Rota para cadastrar um novo PID
router.post('/newpid', cadastroPidController.cadastrar);

// Rota para renderizar o formulário de cadastro de RID
router.get('/cadastrarRid', (req: Request, res: Response) => {
    const nomeDocente = req.query.docenteNome as string; // Pega o nome do docente da query string
    res.render('cadastrarRid', { title: 'Cadastro de RID', docenteNome: nomeDocente });
});

// Rota para cadastrar um novo RID
router.post('/newrid', cadastroRidController.cadastrar);


// Rota para excluir um PID
router.post('/pids/:id/delete', cadastroPidController.excluir);

// Rota para excluir um RID
router.post('/rids/:id/delete', cadastroRidController.excluir);


// Rota para listar todos os PIDs e RIDs
router.get('/pids-rids', cadastroPidController.listar);


// Rota para carregar o formulário de edição
router.get('/editarPid/:id', cadastroPidController.editar);

// Rota para atualizar o PID
router.put('/projeto_pid_rid/atualizarPid/:id', cadastroPidController.atualizar);




export default router;
