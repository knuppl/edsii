export class Docente {
    private nome!: string;
    private cpf!: string;
    private siape!: string;
    private email!: string;
    private senha!: string;
    private tipoServidor!: string;
    private regimeTrabalho!: number;

    // Getters e Setters
    getNome(): string {
        if (!this.nome) throw new Error('O nome não pode estar indefinido!');
        return this.nome;
    }

    setNome(valor: string) {
        if (valor.trim() === '') throw new Error('O nome não pode estar vazio!');
        this.nome = valor;
    }

    getCpf(): string {
        if (!this.cpf) throw new Error('O CPF não pode estar indefinido!');
        return this.cpf;
    }

    setCpf(valor: string) {
        if (valor.trim() === '' || !this.validarCPF(valor)) throw new Error('O CPF deve ser válido!');
        this.cpf = valor;
    }

    private validarCPF(cpf: string): boolean {
        return /^\d{11}$/.test(cpf) && !/^(\d)\1+$/.test(cpf);
    }

    getSiape(): string {
        if (!this.siape) throw new Error('O SIAPE não pode estar indefinido!');
        return this.siape;
    }

    setSiape(valor: string) {
        if (valor.trim() === '') throw new Error('O SIAPE não pode estar vazio!');
        this.siape = valor;
    }

    getEmail(): string {
        if (!this.email) throw new Error('O email não pode estar indefinido!');
        return this.email;
    }

    setEmail(valor: string) {
        if (valor.trim() === '' || !this.validarEmail(valor)) throw new Error('O email deve ser válido!');
        this.email = valor;
    }

    private validarEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    getSenha(): string {
        if (!this.senha) throw new Error('A senha não pode estar indefinida!');
        return this.senha;
    }

    setSenha(valor: string) {
        if (valor.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres!');
        this.senha = valor;
    }

    getTipoServidor(): string {
        if (!this.tipoServidor) throw new Error('O Tipo de Servidor não pode estar indefinido!');
        return this.tipoServidor;
    }

    setTipoServidor(valor: string) {
        if (valor !== 'Efetivo' && valor !== 'Substituto') throw new Error('Tipo de Servidor inválido!');
        this.tipoServidor = valor;
    }

    getRegimeTrabalho(): number {
        if (!this.regimeTrabalho) throw new Error('O Regime de Trabalho não pode estar indefinido!');
        return this.regimeTrabalho;
    }

    setRegimeTrabalho(valor: number) {
        if (valor !== 20 && valor !== 40) throw new Error('Regime de Trabalho inválido!');
        this.regimeTrabalho = valor;
    }
}