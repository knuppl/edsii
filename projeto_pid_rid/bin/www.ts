#!/usr/bin/env node

import app from '../app'; // Importa a instância do app.ts
import debug from 'debug'; // Importação do debug com a tipagem correta
import http, { IncomingMessage, ServerResponse } from 'http';

// Tipagem do parâmetro 'port'
const debugLog = debug('projeto-pid-rid:server');

// Função para normalizar o valor da porta
function normalizePort(val: string): string | number | false {
  const portNumber = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

// Ajuste a tipagem para permitir 'false' também
const port: string | number | false = normalizePort(process.env.PORT || '3000');
if (port === false) {
  console.error('Invalid port');
  process.exit(1);
}
app.set('port', port);

// Criando o servidor HTTP
const server = http.createServer(app);

// Iniciar o servidor
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Função para lidar com erros do servidor
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Função para escutar eventos de "listening" do servidor
function onListening(): void {
  const addr = server.address();
  if (addr === null) {
    console.error('Failed to get server address');
    return;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debugLog('Listening on ' + bind);
}