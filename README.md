# **Catálogo Musical API (ASO 09: Servidor Web Básico)**
Este proyecto implementa un **servidor web básico** utilizando **Express.js y MySQL** para gestionar un 
catálogo de artistas musicales. El código cumple con todos los requisitos de la Asignación 09, enfocándose en la modularidad, el manejo de datos JSON y la gestión de errores.

**Requisitos de la Asignación Cumplidos**
- Ruta GET /holamundo: Devuelve una respuesta JSON simple (código 200).
- Ruta POST /enviar-texto: Valida y procesa datos JSON del cuerpo de la petición.
- Middleware JSON: Uso de express.json() para el parseo correcto del body.
- Middleware de Errores: Implementado al final de las rutas para capturar errores y devolver respuestas JSON con códigos de estado HTTP apropiados (ej., 400, 500).
- Consistencia: Todas las respuestas (éxito y error) son en formato JSON.

**Antes de ejecutar, debes:**
Crear la Base de Datos: Ejecuta este script SQL en tu servidor MySQL. 
```sql 
CREATE DATABASE IF NOT EXISTS catalogo_musica; USE catalogo_musica;
CREATE TABLE IF NOT EXISTS Artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    origen VARCHAR(100)
);


