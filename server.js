import express from "express";
import mysql from "mysql2/promise";
import 'dotenv/config';

const app = express();

//1. Middleware para procesar req.body
app.use(express.json());

//2. pool de conexion a Mysql
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

//3. Endpoint GET: Consultar consolidado de ventas con parametro
app.get('/api/v1/ventas/consolidado', async (req, res) => {
  try {
    const { sucursal, anio } = req.query;

    // Validacion de parametros obligatorios
    if (!sucursal || !anio) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Debe enviar ambos parámetros"
      });
    }

    // Se ejecuta el SP en BD
    const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal, anio]);

    // Enviamos la respuesta al cliente
    res.status(200).json({
      status: "success",
      total_registros: rows[0] ? rows[0].length : 0,
      data: rows[0]
    });

  } catch (error) {
    console.log('Error en GET /ventas/consolidado:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
  }
})

//4. Endpoint POST: Ingresar nueva venta
app.post('/api/v1/ventas', async (req, res) => {
  try {
    const { id_producto, id_cliente, cantidad, fecha_venta } = req.body;

    // Validacion de Datos
    if (!id_producto || !id_cliente || !cantidad || !fecha_venta) {
      return res.status(400).json({
        error: "Bad Request",
        message: "todos los parámetros obligatorios"
      });
    }

    //inserta datos en la bd
    await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [
      id_producto, id_cliente, cantidad, fecha_venta
    ]);

    //Respuesta 201 Created
    res.status(201).json({
      status: 'created',
      message: 'Venta registrada correctamente',
      datos_registrados: { id_producto, id_cliente, cantidad, fecha_venta }
    });

  } catch (error) {
    console.log('Error en POST /ventas:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Error al Insertar' });
  }
});

//5. Iniciar Servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor Express en http://localhost:${port}`);
});