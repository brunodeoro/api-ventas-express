USE db_ventas_tech;

CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    precio_unitario INT NOT NULL,
    costo_proveedor INT NOT NULL,
    ubicacion_pasillo VARCHAR(10)
);

DROP PROCEDURE IF EXISTS sp_listar_productos;

DELIMITER $$

CREATE PROCEDURE sp_listar_productos()
BEGIN
    SELECT
        id_producto,
        id_categoria,
        nombre_producto,
        precio_unitario,
        costo_proveedor,
        ubicacion_pasillo
    FROM productos
    ORDER BY id_producto DESC;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_crear_producto;

DELIMITER $$

CREATE PROCEDURE sp_crear_producto(
    IN p_id_categoria INT,
    IN p_nombre_producto VARCHAR(100),
    IN p_precio_unitario INT,
    IN p_costo_proveedor INT,
    IN p_ubicacion_pasillo VARCHAR(10)
)
BEGIN
    INSERT INTO productos (
        id_categoria,
        nombre_producto,
        precio_unitario,
        costo_proveedor,
        ubicacion_pasillo
    )
    VALUES (
        p_id_categoria,
        p_nombre_producto,
        p_precio_unitario,
        p_costo_proveedor,
        p_ubicacion_pasillo
    );

    SELECT LAST_INSERT_ID() AS id_producto;
END $$

DELIMITER ;
