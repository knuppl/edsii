import { Request, Response } from 'express';
import { Docente } from '../models/Docente';  // Seu modelo de Docente
import { DocenteMongo } from '../models/DocenteMongo'; // Seu modelo MongoDB para Docente

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
}

export { DocenteController };
