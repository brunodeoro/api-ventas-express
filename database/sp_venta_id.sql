-- El esquema actual no cuenta con una columna de ciudad en clientes.
-- Se expone direccion_despacho con el alias ciudad_cliente hasta que
-- exista un atributo de ciudad independiente.
DROP PROCEDURE IF EXISTS sp_venta_id;

DELIMITER $$

CREATE PROCEDURE sp_venta_id(IN id_venta INT)
BEGIN
    SELECT
        DATE_FORMAT(v.fecha_venta, '%d-%m-%Y') AS fecha_venta,
        c.nombre_completo AS nombre_cliente,
        c.direccion_despacho AS ciudad_cliente,
        p.nombre_producto AS producto,
        v.cantidad,
        (p.precio_unitario * v.cantidad) AS monto_venta
    FROM ventas AS v
    INNER JOIN clientes AS c
        ON c.id_cliente = v.id_cliente
    INNER JOIN productos AS p
        ON p.id_producto = v.id_producto
    WHERE v.id_venta = id_venta;
END $$

DELIMITER ;
