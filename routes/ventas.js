import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

//3. Endpoint GET: Consultar consolidado de ventas con parametro
router.get('/consolidado', async (req, res) => {
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

//ENDPOINTS DE VENTAS
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('CALL sp_venta_id(?)', [id]);

    const ventaEncontrada = result[0];

    if (!ventaEncontrada || ventaEncontrada.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: `No se encontró la venta con el ID ${id}`
      });
    }

    res.status(200).json({
      status: "success",
      data: ventaEncontrada[0] 
    });

  } catch (error) {
    console.log(`Error en GET /api/v1/ventas/${id}:`, error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Error en MySQL' 
    });
  }
});

//4. Endpoint POST: Ingresar nueva venta
router.post('/', async (req, res) => {
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

export default router;