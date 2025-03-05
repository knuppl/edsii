import { Docente } from "../Docente";

let docente: Docente;

beforeEach(() => {
    docente = new Docente();
});


//nome do docente
describe('Nome do docente', () => {


    it('deve ser atribuído', () => {
        docente.setNome("Filipe");
        expect(docente.getNome()).toBe("Filipe");
    });


    it('deve lançar uma exceção quando chamar o getNome() e this.nome estiver indefinido', () => {
        expect(() => docente.getNome()).toThrow(/^O nome não pode estar indefinido.$/);
    })


    it('deve lançar uma exceção quando o nome estiver vazio', () => {
        expect(() => docente.setNome('')).toThrow(/^O nome não pode estar vazio.$/);
    })


});


//cpf do docente
describe('CPF do docente', () => {


    it("deve ser atribuído", () => {
        docente.setCpf('12345678909');
        expect(docente.getCpf()).toBe('12345678909');
    })


    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', () => {
        expect(() => docente.getCpf()).toThrow(/^O CPF não pode estar indefinido!$/);
    });


    it('deve lançar uma exceção quando for vazio ou se for inválido', () => {
        expect(() => docente.setCpf('')).toThrow(/^O CPF deve ser válido!$/);
        expect(() => docente.setCpf('1234')).toThrow(/^O CPF deve ser válido!$/);
    });
});


describe('Siape do Docente', () => {
    it('deve ser atribuído', () => {
        docente.setSiape("12345678");
        expect(docente.getSiape()).toBe("12345678");
    });


    it('deve lançar uma exceção quando chamar o getSiape() e this.siape estiver indefinido', () => {
        expect(() => docente.getSiape()).toThrow(/^O SIAPE não pode estar indefinido.$/);
    })


    it('deve lançar uma exceção quando o Siape estiver vazio', () => {
        expect(() => docente.setSiape('')).toThrow(/^O SIAPE não pode estar vazio.$/);
    })
});


describe("E-mail do Docente", () => {

    it('deve ser atribuído', () => {
        docente.setEmail('filipe.fernandes@ifsudestemg.edu.br');
        expect(docente.getEmail()).toBe('filipe.fernandes@ifsudestemg.edu.br');
    });


    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', () => {
        expect(() => docente.getEmail()).toThrow(/^O email não pode estar indefinido!$/);
    });

    it('deve lançar uma exceção quando o  endereço for inválido', ()=>{
        expect(() => docente.setEmail('3394')).toThrow(/^O email deve ser válido.$/)
    })
})
describe('Senha do docente', () => {


    it('deve ser atribuída', () => {
        docente.setSenha('A@1asdfg');
        expect(docente.getSenha()).toBe('A@1asdfg');
    });


    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', () => {
        expect(() => docente.getSenha()).toThrow(/^A senha não pode estar indefinida!$/);
    });


    it('deve lançar uma exceção quando for vazia e possuir menos de 8 caracteres', () => {
        expect(() => docente.setSenha('')).toThrow(/^A senha deve ter pelo menos 8 caracteres!$/);
        expect(() => docente.setSenha('2323')).toThrow(/^A senha deve ter pelo menos 8 caracteres!$/);
    })
})


describe('Tipo de Servidor docente', () => {

    it('deve ser atribuído', () => {
        docente.setTipoServidor("Efetivo");
        expect(docente.getTipoServidor()).toBe("Efetivo");


        docente.setTipoServidor("Substituto");
        expect(docente.getTipoServidor()).toBe("Substituto");
    });

    it('deve lançar uma exceção quando chamar o getTipoServidor() e this.servidor estiver indefinido', () => {
        expect(() => docente.getTipoServidor()).toThrow(/^O Tipo de Servidor não pode estar indefinido.$/);
    })

    it('deve lançar uma exceção quando o Tipo de Servidor estiver vazio e quando for diferente de Efetivo ou Substituto', () => {
        expect(() => docente.setTipoServidor('')).toThrow(/^Tipo de Servidor inválido!$/);
        expect(() => docente.setTipoServidor("Aprovado")).toThrow(/^Tipo de Servidor inválido!$/)
    })
})


describe("Regime de trabalho do docente", () =>{
    it('deve ser atribuído', () =>{


        docente.setRegimeTrabalho(40);
        expect(docente.getRegimeTrabalho()).toEqual(40);
       
        docente.setRegimeTrabalho(20);
        expect(docente.getRegimeTrabalho()).toEqual(20);
    })

    it('deve lançar uma exceção quando chamar o método get e o atributo estiver indefinido', ()=>{
        expect( ()=>docente.getRegimeTrabalho() ).toThrow(/^O Regime de Trabalho não pode estar indefinido!$/);
    });


    it('deve lançar uma exceção quando for diferente de 20 ou 40 horas semanais', ()=>{
        expect(() => docente.setRegimeTrabalho(0)).toThrow(/^Regime de Trabalho inválido!$/);
        expect(() => docente.setRegimeTrabalho(10)).toThrow(/^Regime de Trabalho inválido!$/);
    })
   
})