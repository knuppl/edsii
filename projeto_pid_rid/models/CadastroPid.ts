export class CadastroPid {
    private docenteId!: string;
    private ano!: number;
    private semestre!: number;
    private atividades!: { tipo: string; descricao: string; cargaHoraria: number }[];

    // Getter e Setter para Docente ID
    getDocenteId(): string {
        if (!this.docenteId) throw new Error("O ID do docente não pode estar indefinido!");
        return this.docenteId;
    }

    setDocenteId(valor: string) {
        if (valor.trim() === "") throw new Error("O ID do docente não pode estar vazio!");
        this.docenteId = valor;
    }

    // Getter e Setter para Ano
    getAno(): number {
        if (!this.ano) throw new Error("O ano letivo não pode estar indefinido!");
        return this.ano;
    }

    setAno(valor: number) {
        const anoAtual = new Date().getFullYear();
        if (valor < 2000 || valor > anoAtual + 1) throw new Error("Ano letivo inválido!");
        this.ano = valor;
    }

    // Getter e Setter para Semestre
    getSemestre(): number {
        if (!this.semestre) throw new Error("O semestre letivo não pode estar indefinido!");
        return this.semestre;
    }

    setSemestre(valor: number) {
        if (valor !== 1 && valor !== 2) throw new Error("Semestre inválido! Escolha 1 ou 2.");
        this.semestre = valor;
    }

    // Getter e Setter para Atividades
    getAtividades(): { tipo: string; descricao: string; cargaHoraria: number }[] {
        if (!this.atividades || this.atividades.length === 0) throw new Error("As atividades não podem estar indefinidas ou vazias!");
        return this.atividades;
    }

    setAtividades(valor: { tipo: string; descricao: string; cargaHoraria: number }[]) {
        if (!Array.isArray(valor) || valor.length === 0) throw new Error("É necessário incluir pelo menos uma atividade!");
        for (const atividade of valor) {
            if (!atividade.tipo.trim() || !atividade.descricao.trim()) throw new Error("Tipo e descrição da atividade não podem estar vazios!");
            if (atividade.cargaHoraria <= 0) throw new Error("A carga horária deve ser maior que zero!");
        }
        this.atividades = valor;
    }
}
