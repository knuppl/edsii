import {CadastroRid} from "../CadastroRid";
import { CadastroPid } from "../CadastroPid";

let cadrid: CadastroRid;
let cadpid: CadastroPid;

beforeEach(() => {
    cadrid = new CadastroRid();
    cadpid = new CadastroPid();
})

describe("ID do docente", () =>{
    
    it('deve ser atribuído', () =>{
        cadrid.setDocenteId("objet23");
        expect(cadrid.getDocenteId()).toBe("objet23");
    });

    it('deve lançar uma exceção quando chamar o getDocente() e this.docenteId estiver indefinido', () =>{
        expect(() => cadrid.getDocenteId()).toThrow(/^O ID do docente não pode estar indefinido!$/);
    })

    it('deve lançar uma exceção quando o docenteId estiver vazio', () =>{
        expect(() => cadrid.setDocenteId('')).toThrow(/^O ID do docente não pode estar vazio!$/)
    })
})

describe("Ano do Rid", () =>{

    it('deve ser atribuído', () =>{
        cadrid.setAno(2004);
        expect(cadrid.getAno()).toBe(2004);
    })

    it('deve lançar uma exceção quando o ano letivo for menor que 2000 e acima do ano atual', () =>{
        expect(() => cadrid.setAno(1999)).toThrow(/^Ano letivo inválido!$/);
        expect(() => cadrid.setAno(2027)).toThrow(/^Ano letivo inválido!$/);
    })

    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', () =>{
        expect(() => cadrid.getAno()).toThrow(/^O ano letivo não pode estar indefinido!$/)
    })
})

describe("Semestre do Rid", () =>{
    
    it('deve ser atribuído', () =>{
        
        cadrid.setSemestre(1)
        expect(cadrid.getSemestre()).toBe(1);
        
        cadrid.setSemestre(2)
        expect(cadrid.getSemestre()).toBe(2);
    })

    it('deve gerar uma exceção quando o semestre for inválido', () =>{
        expect(() => cadrid.setSemestre(3)).toThrow(/^Semestre inválido! Escolha 1 ou 2.$/);
    })

    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', () =>{
        expect(() => cadrid.getSemestre()).toThrow(/^O semestre letivo não pode estar indefinido!$/)
    })
})

describe("Atividade do Rid", () => {

    it('deve atribuir atividades corretamente', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        cadrid.setAtividades(atividades);
        expect(cadrid.getAtividades()).toEqual(atividades);
    });

    it('deve lançar erro se não houver atividades', () => {
        expect(() => {
            cadrid.setAtividades([]);
        }).toThrow("É necessário incluir pelo menos uma atividade!");
    });

    it('deve lançar erro se tipo ou descrição estiverem vazios', () => {
        const atividades = [
            { tipo: "", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        expect(() => {
            cadrid.setAtividades(atividades);
        }).toThrow("Tipo e descrição da atividade não podem estar vazios!");
    });

    it('deve lançar erro se a carga horária for menor ou igual a zero', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 0 }
        ];

        expect(() => {
            cadrid.setAtividades(atividades);
        }).toThrow("A carga horária deve ser maior que zero!");
    });

    it('deve retornar as atividades corretamente', () => {
        const atividades = [
            { tipo: "Aula", descricao: "Dispositivos móveis", cargaHoraria: 20 }
        ];

        cadrid.setAtividades(atividades);
        expect(cadrid.getAtividades()).toEqual(atividades);
    });

    it('deve lançar erro se as atividades não estiverem definidas ou estiverem vazias', () => {
        expect(() => {
            cadrid.getAtividades();
        }).toThrow("As atividades não podem estar indefinidas ou vazias!");
    });

    describe("Comparação entre RID e PID", () => {
        beforeEach(() => {
            cadrid.setDocenteId("prof123");
            cadrid.setAno(2024);
            cadrid.setSemestre(1);
            cadrid.setAtividades([{ tipo: "Aula", descricao: "POO", cargaHoraria: 20 }]);
    
            cadpid.setDocenteId("prof123");
            cadpid.setAno(2024);
            cadpid.setSemestre(1);
            cadpid.setAtividades([{ tipo: "Aula", descricao: "POO", cargaHoraria: 20 }]);
        });
    
        it("deve lançar erro se o PID e o RID forem de docentes diferentes", () => {
            cadpid.setDocenteId("prof999");
            expect(() => cadrid.compararComPid(cadpid)).toThrow("O PID e o RID devem pertencer ao mesmo docente, ano e semestre!");
        });
    
        it("deve lançar erro se houver diferenças e nenhuma observação for adicionada", () => {
            cadrid.setAtividades([{ tipo: "Aula", descricao: "POO", cargaHoraria: 15 }]);
            expect(() => cadrid.compararComPid(cadpid)).toThrow("Há diferenças entre o PID e o RID. Você deve adicionar uma observação!");
        });
    
        it("não deve lançar erro se houver diferenças mas a observação for preenchida", () => {
            cadrid.setAtividades([{ tipo: "Aula", descricao: "POO", cargaHoraria: 15 }]);
            cadrid.setObservacao("Ajuste na carga horária devido à reestruturação curricular.");
            expect(() => cadrid.compararComPid(cadpid)).not.toThrow();
        });
    });

    it("deve permitir definir a observação", () => {
        cadrid.setObservacao("Revisão curricular");
        expect(cadrid.getObservacao()).toBe("Revisão curricular");
    });
    
    it("deve permitir definir a observação vazia", () => {
        cadrid.setObservacao("");
        expect(cadrid.getObservacao()).toBe("");
    });

    it("deve retornar string vazia quando observação for null", () => {
        // A observação é explicitamente null
        cadrid.setObservacao(null);
        expect(cadrid.getObservacao()).toBe("");
    });

    it("deve retornar string vazia quando observação for indefinida", () => {
        cadrid.setObservacao(undefined);
        expect(cadrid.getObservacao()).toBe("");
    });
});