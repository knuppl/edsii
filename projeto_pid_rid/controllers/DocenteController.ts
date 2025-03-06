import { Request, Response } from 'express';
import { Docente } from '../models/Docente';  // Seu modelo de Docente
import { DocenteMongo } from '../models/DocenteMongo'; // Seu modelo MongoDB para Docente
import bcrypt from 'bcryptjs'; // Certifique-se de instalar bcryptjs para a comparação de senhas
import jwt from 'jsonwebtoken';
import 'express-session';  // Certificando-se de que o TypeScript esteja ciente da extensão da sessão


class DocenteController {
    // Método para cadastrar um novo Docente
    async cadastrar(req: Request, res: Response): Promise<void> {
        try {
            const { nome, cpf, siape, email, senha, tipoServidor } = req.body;
            const regimeTrabalho = parseInt(req.body.regimeTrabalho, 10);

            console.log(req.body);  // Isso vai mostrar todos os dados recebidos no servidor

            const docente = new Docente();
            docente.setNome(nome);
            docente.setCpf(cpf);
            docente.setSiape(siape);
            docente.setEmail(email);
            docente.setSenha(senha);
            docente.setTipoServidor(tipoServidor);
            docente.setRegimeTrabalho(regimeTrabalho);

            const docenteMongo = new DocenteMongo();
            await docenteMongo.cria(docente);  // Método para salvar no banco

            // Redireciona para a página de cadastro com uma mensagem de sucesso
            res.redirect('docente/cadastrarDocente?status=success'); // Para sucesso
            
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                // Redireciona para a página de cadastro com uma mensagem de erro
                res.redirect(`docente/cadastrarDocente?status=error&message=${encodeURIComponent(error.message)}`); // Para erro
            } else {
                // Em caso de erro desconhecido, envia uma mensagem genérica
                res.redirect('docente/cadastrarDocente?status=error&message=Erro desconhecido');
            }
        }
    }

    // Exemplo de uso no DocenteController

async login(req: Request, res: Response) {
    const { usuario, senha } = req.body;
  
    const docenteMongo = new DocenteMongo();
    const docente = await docenteMongo.consultaPorUsuario(usuario);
  
    if (docente) {
        const senhaValida = (senha === docente.getSenha());

        if(senhaValida){
        (req.session as any).docente = {
        cpf: docente.getCpf(),
        nome: docente.getNome(),
        email: docente.getEmail(),
      };
      res.redirect(`/docente/pids?docenteEmail=${docente.getEmail()}`);
    }
    } else {
      return res.status(401).send('Credenciais inválidas');
    }
  }      
      
    async logout(req: Request, res: Response): Promise<void> {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/index');
            }
            res.redirect('/index'); // Redireciona de volta para a página inicial
        });
    }
    

    // // Página para exibir os PIDs cadastrados do docente
    // async mostrarPIDs(req: Request, res: Response): Promise<void> {
    //     try {
    //         const docenteMongo = new DocenteMongo();
    //         const pids = await docenteMongo.lista(); // Lógica para buscar os PIDs cadastrados

    //         res.render('pids', { title: 'Meus PIDs', pids: pids }); // Renderizando a página de PIDs
    //     } catch (error) {
    //         console.error(error);
    //         res.render('error', { message: 'Erro ao carregar os PIDs' });
    //     }
    // }
}

export { DocenteController };
