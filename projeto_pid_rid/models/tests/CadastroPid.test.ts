import {CadastroPid} from "../CadastroPid";

let cadpid: CadastroPid;

beforeEach(() => {
    cadpid = new CadastroPid();
})

describe("ID do docente", () =>{
    
    it('deve ser atribuído', () =>{
        cadpid.setDocenteId("objet23");
        expect(cadpid.getDocenteId()).toBe("objet23");
    });

    it('deve lançar uma exceção quando chamar o getDocente() e this.docenteId estiver indefinido', () =>{
        expect(() => cadpid.getDocenteId()).toThrow(/^O ID do docente não pode estar indefinido!$/);
    })

    it('deve lançar uma exceção quando o docenteId estiver vazio', () =>{
        expect(() => cadpid.setDocenteId('')).toThrow(/^O ID do docente não pode estar vazio!$/)
    })
})

describe("Ano do PID", () =>{

    it('deve ser atribuído', () =>{
        cadpid.setAno(2004);
        expect(cadpid.getAno()).toBe(2004);
    })

    it('deve lançar uma exceção quando o ano letivo for menor que 2000 e acima do ano atual', () =>{
        expect(() => cadpid.setAno(1999)).toThrow(/^Ano letivo inválido!$/);
        expect(() => cadpid.setAno(2027)).toThrow(/^Ano letivo inválido!$/);
    })
})

describe("Semestre do PID", () =>{
    
    it('deve ser atribuído', () =>{
        
        cadpid.setSemestre(1)
        expect(cadpid.getSemestre()).toBe(1);
        
        cadpid.setSemestre(2)
        expect(cadpid.getSemestre()).toBe(2);
    })

    it('deve gerar uma exceção quando o semestre for inválido', () =>{
        expect(() => cadpid.setSemestre(3)).toThrow(/^Semestre inválido! Escolha 1 ou 2.$/);
    })
})

describe("Atividade do PID", () => {

    it('deve atribuir atividades corretamente', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        cadpid.setAtividades(atividades);
        expect(cadpid.getAtividades()).toEqual(atividades);
    });

    it('deve lançar erro se não houver atividades', () => {
        expect(() => {
            cadpid.setAtividades([]);
        }).toThrow("É necessário incluir pelo menos uma atividade!");
    });

    it('deve lançar erro se tipo ou descrição estiverem vazios', () => {
        const atividades = [
            { tipo: "", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        expect(() => {
            cadpid.setAtividades(atividades);
        }).toThrow("Tipo e descrição da atividade não podem estar vazios!");
    });

    it('deve lançar erro se a carga horária for menor ou igual a zero', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 0 }
        ];

        expect(() => {
            cadpid.setAtividades(atividades);
        }).toThrow("A carga horária deve ser maior que zero!");
    });

    it('deve retornar as atividades corretamente', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        cadpid.setAtividades(atividades);
        expect(cadpid.getAtividades()).toEqual(atividades);
    });

    it('deve lançar erro se as atividades não estiverem definidas ou estiverem vazias', () => {
        expect(() => {
            cadpid.getAtividades();
        }).toThrow("As atividades não podem estar indefinidas ou vazias!");
    });

    describe('Observação do Pid', () =>{

        it('deve ser atribuído', () =>{
            cadpid.setObservacao("Mudança de planos em Dispositivos Móveis 2");
            expect(cadpid.getObservacao()).toBe("Mudança de planos em Dispositivos Móveis 2");
        })

        it('deve lançar uma exceção quando chamar o getObservacao() e this.observacao estiver indefinida!', () => {
            expect(() => cadpid.getObservacao()).toThrow(/^A observação não pode estar indefinida!$/);
        })
    
        it('deve lançar uma exceção quando a observação estiver vazia', () => {
            expect(() => cadpid.setObservacao('')).toThrow(/^A observação não pode estar vazia!$/);
        })
    })
});