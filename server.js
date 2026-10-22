import express from "express";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ventasRoutes from './routes/ventas.js';
import 'dotenv/config';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//1. Middleware para procesar req.body
app.use(express.json());

// CORS para clientes web
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Documentación del API
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

//2. Montamos las rutas con el prefijo /api/v1/ventas
app.use('/api/v1/ventas', ventasRoutes);

//5. Iniciar Servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor Express en http://localhost:${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/docs`);
});