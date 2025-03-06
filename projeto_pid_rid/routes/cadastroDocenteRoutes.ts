import express, { Router, Request, Response } from 'express'; // Importando express corretamente
import { DocenteController } from '../controllers/DocenteController'; // Ajuste conforme necessário
import { CadastroPidController } from '../controllers/CadastroPidController';

const router: Router = express.Router();
const docenteController = new DocenteController();
const cadastroPidController = new CadastroPidController(); // Corrigir para "CadastroPidController" com a inicial maiúscula

// Rota para cadastrar um novo Docente
router.post('/', docenteController.cadastrar);

// Rota para renderizar o formulário de cadastro de Docente
router.get('/cadastrarDocente', (req: Request, res: Response) => {
    const status = req.query.status as string; // Pegando o status da URL
    const message = req.query.message as string; // Pegando a mensagem de erro
    res.render('cadastrarDocente', { 
      title: 'Cadastro de Docente',
      status: status,
      message: message // Passando a mensagem para o template
    });
});

// Rota para o login (GET)
router.get('/login', (req: Request, res: Response) => {
  res.render('index', { title: 'Login Docente' });
});

// Rota para o login (POST)
router.post('/login', docenteController.login);

// Substitua a chamada para mostrarPIDs pela chamada para listar no CadastroPidController
router.get('/pids', cadastroPidController.listar);


export default router;
