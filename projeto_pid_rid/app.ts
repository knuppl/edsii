import createError from 'http-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import cadastroPidRoutes from './routes/cadastroPidRoutes'; // Importando as rotas do PID
import cadastroDocenteRoutes from './routes/cadastroDocenteRoutes';

const exphbs = require('express-handlebars');
const app: Express = express(); // Define o tipo da variável app como Express

// Configuração do Handlebars
const hbs = exphbs.create({
  defaultLayout: path.join(__dirname, 'views', 'layout.hbs'), // Caminho completo para o layout
  helpers: {
    eq: function (a: string, b: string): boolean {
      return a === b;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projeto_pid_rid', cadastroPidRoutes); // Usando as rotas do PID
app.use('/docente', cadastroDocenteRoutes); // Usando as rotas de cadastro de docentes

// Rota para renderizar o formulário de cadastro de PID
app.get('/cadastrarPid', (req: Request, res: Response) => {
  res.render('cadastrarPid');
});

// Tratamento de erros
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;