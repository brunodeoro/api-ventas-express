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
    const {
      id_categoria,
      nombre_producto,
      precio_unitario,
      costo_proveedor,
      ubicacion_pasillo
    } = req.body;

    if (
      !id_categoria ||
      !nombre_producto || !String(nombre_producto).trim() ||
      precio_unitario === undefined || precio_unitario === null || precio_unitario === '' ||
      costo_proveedor === undefined || costo_proveedor === null || costo_proveedor === ''
    ) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Los campos id_categoria, nombre_producto, precio_unitario y costo_proveedor son obligatorios'
      });
    }

    const [result] = await pool.query('CALL sp_crear_producto(?, ?, ?, ?, ?)', [
      Number(id_categoria),
      String(nombre_producto).trim(),
      Number(precio_unitario),
      Number(costo_proveedor),
      ubicacion_pasillo !== undefined && ubicacion_pasillo !== null ? String(ubicacion_pasillo).trim() : null
    ]);

    const productoCreado = Array.isArray(result[0]) && result[0].length > 0
      ? result[0][0]
      : { id_producto: null };

    res.status(201).json({
      status: 'created',
      message: 'Producto registrado correctamente',
      data: productoCreado,
      producto: {
        id_categoria: Number(id_categoria),
        nombre_producto: String(nombre_producto).trim(),
        precio_unitario: Number(precio_unitario),
        costo_proveedor: Number(costo_proveedor),
        ubicacion_pasillo: ubicacion_pasillo !== undefined && ubicacion_pasillo !== null ? String(ubicacion_pasillo).trim() : null
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
