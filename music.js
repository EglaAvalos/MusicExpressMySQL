const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const dbConfig = {
    host: 'localhost',
    user: '',
    password: '',
    database: 'catalogo_musica'
};

let pool;

async function connectToDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Conexión a MySQL establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar con la base de datos de MySQL: ', error.message);
    }
}

connectToDatabase();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenidos a Catálogo Musical.');
});

app.get('/artista/:nombre', async (req, res) => {
    const nombreArtista = req.params.nombre;

    // en esta parte se valida que el nombre del artista no estee vacio
    try {
        const [rows] = await pool.query(
            'SELECT nombre, genero, origen FROM Artistas WHERE nombre = ?',
            [nombreArtista]
        );
        const artista = rows[0];
        if (!artista) {
            /*en esta parte es cuando devuelve el formato json asi 
            como lo vimos en clase*/
            res.status(404).json({
                status: 'error',codigo: 404,
                descripcion: 'Artista no encontrado en el catálogo.'
            });
        } else {
            res.json(artista);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',codigo: 500,
            descripcion: 'Error interno del servidor al buscar el artista.'
        });
    }
});

/*agregue este endpoint para listar todos los artistas, ya que lo vi necesario 
para hacer otro tipo de pruebas en postman, aun asi lo voy a comentar, porque no
lo veo en las instrucciones de la asignacion*/
/*app.get('/artistas', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT nombre, genero, origen FROM Artistas'
        );
    
        if (rows.length === 0) {
            return res.status(200).json({
                status: 'success', message: 'No hay artistas registrados en el catálogo.',
                data: []
            });
        }
        res.json({
            status: 'success', count: rows.length,data: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor al listar los artistas.');
    }
});*/

app.post('/artista', async (req, res) => {
    const { nombre, genero, origen } = req.body;
    if (!nombre || !genero || !origen) {
        return res.status(400).json({
            status: 'error', codigo: 400,
            descripcion: 'Faltan datos del artista (nombre, genero, origen son obligatorios).'
        });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO Artistas (nombre, genero, origen) VALUES (?,?,?)',
            [nombre, genero, origen]
        );
        const insertId = result.insertId;
        res.status(201).json({
            status: 'success',
            id: insertId,
            nombre,
            genero,
            origen,
            confirmacion: 'Artista creado y registrado en el catálogo.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',codigo: 500,
            descripcion: 'Error interno al crear el Artista.'
        });
    }
});

app.get('/holamundo', (req, res) => {
    res.status(200).json({
        mensaje: '¡Hola Mundo Musical! Servidor Express en funcionamiento.'
    });
});

app.post('/enviar-texto', (req, res, next) => {
    try {
        const { texto } = req.body;
        if (!texto) {
            const error = new Error('El campo "texto" es obligatorio en el cuerpo JSON.');
            error.status = 400;
            throw error;
        }
        res.status(200).json({
            status: 'success',recibido: true, texto_recibido: texto,
            confirmacion: 'Mensaje de texto JSON procesado correctamente.'
        });
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Ocurrió un error en el servidor.';
    console.error(err.stack);
    res.status(statusCode).json({
        status: 'error', codigo: statusCode,
        descripcion: message
    });
});

app.listen(port, () => {
    console.log(`El servidor está escuchando desde el puerto ${port}`);
});
