USE db_ventas_tech;

CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP PROCEDURE IF EXISTS sp_listar_productos;

DELIMITER $$

CREATE PROCEDURE sp_listar_productos()
BEGIN
    SELECT
        id_producto,
        nombre,
        descripcion,
        precio,
        stock,
        fecha_creacion
    FROM productos
    ORDER BY id_producto DESC;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_crear_producto;

DELIMITER $$

CREATE PROCEDURE sp_crear_producto(
    IN p_nombre VARCHAR(100),
    IN p_descripcion VARCHAR(255),
    IN p_precio DECIMAL(10,2),
    IN p_stock INT
)
BEGIN
    INSERT INTO productos (
        nombre,
        descripcion,
        precio,
        stock
    )
    VALUES (
        p_nombre,
        p_descripcion,
        p_precio,
        p_stock
    );

    SELECT LAST_INSERT_ID() AS id_producto;
END $$

DELIMITER ;
