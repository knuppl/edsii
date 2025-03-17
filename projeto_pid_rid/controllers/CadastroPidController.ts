import { Request, Response, NextFunction } from 'express';
import { CadastroPid } from '../models/CadastroPid'; 
import { CadastroPidMongo } from '../models/CadastroPidMongo'; 
import { DocenteMongo } from '../models/DocenteMongo'; // Importando o MongoDB para Docente
import { CadastroRidMongo } from '../models/CadastroRidMongo';


class CadastroPidController {

    // Método para cadastrar um novo PID
    async cadastrar(req: Request, res: Response): Promise<void> {
        if (!(req.session as any).docente) {
            return res.status(401).render('login', { errorMessage: 'Você precisa estar logado para realizar o cadastro!' });
        }
    
        const { ano, semestre, observacao } = req.body;
    
        // Obtendo as atividades
        const atividades = req.body.atividades.map((atividade: any) => ({
            tipo: atividade.tipo,
            descricao: atividade.descricao,
            cargaHoraria: parseInt(atividade.cargaHoraria, 10),
        }));
    
        // Soma da carga horária das atividades
        const cargaHorariaTotal = atividades.reduce((total: number, atividade: { cargaHoraria: number; }) => total + atividade.cargaHoraria, 0);
    
        try {
            const docenteEmail = (req.session as any).docente.email;
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteEmail);
    
            // Verificar se a carga horária total corresponde ao regime de trabalho do docente
            const regimeDeTrabalho = docente?.getRegimeTrabalho();
    
            if (cargaHorariaTotal !== regimeDeTrabalho) {
                return res.render('index', { errorMessage: `A carga horária total das atividades (${cargaHorariaTotal} horas) deve ser igual ao regime de trabalho do docente (${regimeDeTrabalho} horas).` });
            }
    
            console.log('Docente da sessão:', (req.session as any).docente);
    
            // Criar a instância do PID
            const pid = new CadastroPid();
            pid.setDocenteId(docenteEmail);
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
    
            // Se for erro de PID duplicado, exibe no formulário sem redirecionar para o login
            if (error instanceof Error && error.message.includes("Já existe um PID cadastrado")) {
                return res.render('index', { errorMessage: error.message });
            }
    
            res.render('index', { errorMessage: 'Erro ao cadastrar o PID!' });
        }
    }

    // Método para listar os PIDs do docente
    async listar(req: Request, res: Response): Promise<void> {
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

             // Consulta os RIDs
            const rids = await CadastroRidMongo.buscarRIDsPorEmail(docenteEmail);

            // Passa ambos os dados para a view
        res.render('pids', { 
            title: 'Meus PIDs e RIDs', 
            pids, 
            rids, 
            docenteNome: docente.getNome(), 
            successMessage 
        });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar os PIDs e RIDs' });
        }
     }

     // Método para excluir um PID
    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const cadastroPidMongo = new CadastroPidMongo();
            await cadastroPidMongo.deleta(id);

            //res.status(200).json({ message: 'PID excluído com sucesso!' });
             // Após a exclusão, redireciona de volta para a página de PIDs
            res.redirect('/projeto_pid_rid/pids-rids');
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message || 'Erro ao excluir o PID.' });
            } else {
                res.status(400).json({ message: 'Erro desconhecido ao excluir o PID.' });
            }
        }
    }


    async editar(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const cadastroPidMongo = new CadastroPidMongo();
            const pid = await cadastroPidMongo.consulta(id);
    
            if (!pid) {
                return res.render('error', { message: 'PID não encontrado.' });
            }
    
            // Agrupar atividades por tipo
            const atividadesAgrupadas = pid.getAtividades().reduce((acc, atividade) => {
                if (!acc[atividade.tipo]) {
                    acc[atividade.tipo] = [];
                }
                acc[atividade.tipo].push(atividade);
                return acc;
            }, {} as Record<string, any[]>);

            console.log('Dados PID:', { pid }); 
            // Passa o PID e as atividades agrupadas para a view de edição
            res.render('editarPid', { id, pid, atividadesAgrupadas, observacao: pid.getObservacao() });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao carregar o PID para edição.' });
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        const { id, docenteId, ano, semestre, atividades, observacao } = req.body;
        
        try {
            const cadastroPidMongo = new CadastroPidMongo();
            const docenteMongo = new DocenteMongo();
            const docente = await docenteMongo.consultaPorUsuario(docenteId);
    
            if (!docente) {
                return res.render('error', { message: 'Docente não encontrado.' });
            }
    
            const regimeDeTrabalho = Number(docente.getRegimeTrabalho()); // Garantindo que é número

            // Processar atividades
            const atividadesProcessadas = Object.values(atividades).map((atividade: any) => ({
                tipo: atividade.tipo,
                descricao: atividade.descricao,
                cargaHoraria: Number(atividade.cargaHoraria) || 0,
            }));
    
            // Verificar carga horária total
            const cargaHorariaTotal = atividadesProcessadas.reduce((total, atividade) => total + atividade.cargaHoraria, 0);
    
            if (cargaHorariaTotal !== regimeDeTrabalho) {
                return res.render('index', {
                    errorMessage: `A carga horária das atividades (${cargaHorariaTotal} horas) deve ser igual ao regime de trabalho do docente (${regimeDeTrabalho} horas).`,                    id,
                    docenteId,
                    ano,
                    semestre,
                    atividades: atividadesProcessadas,
                    observacao
                }); 
            }
    
            // Criar e atualizar PID
            const pid = new CadastroPid();
            pid.setAno(Number(ano));
            pid.setSemestre(Number(semestre));
            pid.setDocenteId(docenteId);
            pid.setAtividades(atividadesProcessadas);
            pid.setObservacao(observacao);
    
            await cadastroPidMongo.atualiza(id, pid);
    
            res.redirect('/projeto_pid_rid/pids-rids'); // Redireciona após atualização
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Erro ao atualizar o PID.' });
        }
    }    

async visualizar(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
        const cadastroPidMongo = new CadastroPidMongo();
        const pid = await cadastroPidMongo.consulta(id);

        if (!pid) {
            return res.render('error', { message: 'PID não encontrado.' });
        }

        // Agrupar atividades por tipo
        const atividadesAgrupadas = pid.getAtividades().reduce((acc, atividade) => {
            if (!acc[atividade.tipo]) {
                acc[atividade.tipo] = [];
            }
            acc[atividade.tipo].push(atividade);
            return acc;
        }, {} as Record<string, any[]>);

        res.render('visualizarPid', { 
            id, 
            pid, 
            atividadesAgrupadas, 
            observacao: pid.getObservacao() 
        });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Erro ao carregar o PID para visualização.' });
    }
}

     
}

export { CadastroPidController };
