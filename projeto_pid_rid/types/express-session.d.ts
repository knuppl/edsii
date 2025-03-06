import 'express-session'; // Importa o módulo express-session

declare module 'express-session' {
  interface SessionData {
    docente?: {
      cpf: string; // CPF do docente
      nome: string; // Nome do docente
      email: string; // Email do docente
    };
  }
}