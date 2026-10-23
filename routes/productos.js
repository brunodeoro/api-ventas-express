import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_productos()');
    const productos = Array.isArray(rows[0]) ? rows[0] : [];

    res.status(200).json({
      status: 'success',
      total_registros: productos.length,
      data: productos
    });
  } catch (error) {
    console.log('Error en GET /productos:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al consultar productos'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || !String(nombre).trim() || precio === undefined || precio === null || precio === '' || stock === undefined || stock === null || stock === '') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Los campos nombre, precio y stock son obligatorios'
      });
    }

    const [result] = await pool.query('CALL sp_crear_producto(?, ?, ?, ?)', [
      String(nombre).trim(),
      descripcion || '',
      Number(precio),
      Number(stock)
    ]);

    const productoCreado = Array.isArray(result[0]) && result[0].length > 0
      ? result[0][0]
      : { id_producto: null };

    res.status(201).json({
      status: 'created',
      message: 'Producto registrado correctamente',
      data: productoCreado,
      producto: {
        nombre: String(nombre).trim(),
        descripcion: descripcion || '',
        precio: Number(precio),
        stock: Number(stock)
      }
    });
  } catch (error) {
    console.log('Error en POST /productos:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al insertar producto'
    });
  }
});

export default router;
