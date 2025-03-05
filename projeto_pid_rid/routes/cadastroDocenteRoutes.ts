import express, { Router, Request, Response } from 'express'; // Importando express corretamente
import { DocenteController } from '../controllers/DocenteController'; // Ajuste conforme necessário

const router: Router = express.Router();
const docenteController = new DocenteController();

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

export default router;
