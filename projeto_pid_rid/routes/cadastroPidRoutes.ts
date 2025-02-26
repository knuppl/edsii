import express, { Router } from 'express';
import { CadastroPidController } from '../controllers/CadastroPidController'; // Ajuste o caminho conforme necessário

const router: Router = express.Router();
const cadastroPidController = new CadastroPidController();

// Rota para cadastrar um novo PID
router.post('/projeto_pid_rid/newpid', cadastroPidController.cadastrar);

// Rota para atualizar um PID existente
router.put('/projeto_pid_rid/:id', cadastroPidController.atualizar);

// Rota para excluir um PID
router.delete('/projeto_pid_rid/:id', cadastroPidController.excluir);

// Rota para listar todos os PIDs
router.get('/projeto_pid_rid', cadastroPidController.listar);

export default router;
