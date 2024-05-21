const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Express maneja json y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* NOTAS
GET obtener recurso
POST crear recurso
PUT/PATCH actualizar recurso
DELETE eliminar recurso

-- Iniciar base de datos: node initDb.js
-- Iniciar servidor: node server.js
-- Parar: ctrl+c
*/ 


// Inicializar la base de datos
//initDb();

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./blogging.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

/*
USUARIOS
*/

// Endpoint para la ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido a la API de Blogging");
});

/* 
Endpoint - todos los usuarios

GET /users
-Petición: No requiere ningún dato en el cuerpo de la solicitud.
-Respuesta: Devuelve un arreglo JSON que contiene la lista de todos los usuarios registrados en la aplicación, incluyendo su ID, nombre y correo electrónico.
*/
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

/*
Endpoint - usuarios por su ID

GET /users/:id
-Petición: Espera el ID del usuario deseado como parte de la URL (/users/:id).
-Respuesta: Devuelve un objeto JSON que representa al usuario correspondiente al ID especificado. Si no se encuentra ningún usuario con ese ID, devuelve un objeto vacío {}.
*/
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(row || {});
    });
});

/* 
Endpoint - crear usuario

POST /users
-Petición: Espera un objeto JSON en el cuerpo de la solicitud con los siguientes campos: name (nombre del usuario) y email (correo electrónico del usuario).
-Respuesta: Devuelve un objeto JSON que representa al nuevo usuario creado, incluyendo su ID, nombre y correo electrónico. Además, devuelve un código de estado 201 (Created) indicando que la creación fue exitosa.
*/
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, email });
    });
});

/* 
Endpoint - borrar usuario por su ID

DELETE /users/:id
-Petición: Espera el ID del usuario que se desea eliminar como parte de la URL (/users/:id).
-Respuesta: En caso de éxito, devuelve un mensaje indicando que el usuario fue eliminado exitosamente. Si no se encuentra ningún usuario con ese ID, devuelve un mensaje indicando que el usuario no fue encontrado, junto con un código de estado 404 (Not Found).
*/
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).send(`Usuario con ID ${userId} eliminado exitosamente.`);
    });
});

/* Endpoint - actualizar usuario por su ID
PUT /users/:id

-Petición: Espera el ID del usuario que se desea actualizar como parte de la URL (/users/:id). Además, espera un objeto JSON en el cuerpo de la solicitud con los campos que se desean actualizar,
 como name (nombre del usuario) y email (correo electrónico del usuario).
-Respuesta: En caso de éxito, devuelve un objeto JSON que representa al usuario actualizado, incluyendo su ID, nombre y correo electrónico actualizados. Si no se encuentra ningún usuario con ese ID,
 devuelve un mensaje indicando que el usuario no fue encontrado, junto con un código de estado 404 (Not Found).
*/
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: userId, name, email });
    });
});


/*
PUBLICACIONES
*/


/*
Endpoint - todas las publicaciones

GET /posts
-Petición: No requiere ningún dato en el cuerpo de la solicitud.
-Respuesta: Devuelve un arreglo JSON que contiene la lista de todas las publicaciones disponibles en la aplicación, incluyendo su ID, ID del usuario creador, título y cuerpo del contenido.
*/
app.get('/posts', (req, res) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

/*
Endpoint - publicación por su ID

GET /posts/:id
-Petición: Espera el ID de la publicación deseada como parte de la URL (/posts/:id).
-Respuesta: Devuelve un objeto JSON que representa a la publicación correspondiente al ID especificado. Si no se encuentra ninguna publicación con ese ID, devuelve un objeto vacío {}.
*/
app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
    db.get("SELECT * FROM posts WHERE id = ?", [postId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(row || {});
    });
});

/* 
Endpoint - crear publicación

POST /posts
-Petición: Espera un objeto JSON en el cuerpo de la solicitud con los siguientes campos: userId (ID del usuario creador de la publicación), title (título de la publicación) y body (contenido de la publicación).
-Respuesta: Devuelve un objeto JSON que representa a la nueva publicación creada, incluyendo su ID, ID del usuario creador, título y cuerpo del contenido. Además, devuelve un código de estado 201 (Created) indicando que la creación fue exitosa.
*/
app.post('/posts', (req, res) => {
    const { userId, title, body } = req.body;
    db.run("INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)", [userId, title, body], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, userId, title, body });
    });
});

/* 
Endpoint - eliminar publicación por su ID

DELETE /posts/:id
-Petición: Espera el ID de la publicación que se desea eliminar como parte de la URL (/posts/:id).
-Respuesta: En caso de éxito, devuelve un mensaje indicando que la publicación fue eliminada exitosamente. Si no se encuentra ninguna publicación con ese ID, 
 devuelve un mensaje indicando que la publicación no fue encontrada, junto con un código de estado 404 (Not Found).
*/
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
    db.run("DELETE FROM posts WHERE id = ?", [postId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).send(`Publicación con ID ${postId} eliminada exitosamente.`);
    });
});

/* 
Endpoint - actualizar publicación por ID

PUT /posts/:id
-Petición: Espera el ID de la publicación que se desea actualizar como parte de la URL (/posts/:id). Además, espera un objeto JSON en el cuerpo de la
 solicitud con los campos que se desean actualizar, como title (título de la publicación) y body (contenido de la publicación).
-Respuesta: En caso de éxito, devuelve un objeto JSON que representa a la publicación actualizada, incluyendo su ID, ID del usuario creador, título y cuerpo del
 contenido actualizados. Si no se encuentra ninguna publicación con ese ID, devuelve un mensaje indicando que la publicación no fue encontrada, junto con un código de estado 404 (Not Found).
*/
app.put('/posts/:id', (req, res) => {
    const postId = req.params.id;
    const { title, body } = req.body;
    db.run("UPDATE posts SET title = ?, body = ? WHERE id = ?", [title, body, postId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: postId, title, body });
    });
});


/*
COMENTARIOS
*/


/* 
Endpoint - todos los comentarios

GET /comments
-Petición: No requiere ningún dato en el cuerpo de la solicitud.
-Respuesta: Devuelve un arreglo JSON que contiene la lista de todos los comentarios disponibles en la aplicación, incluyendo su ID, ID de la publicación asociada y el cuerpo del comentario.
*/
app.get('/comments', (req, res) => {
    db.all("SELECT * FROM comments", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});
/* 
Endpoint - todos los comentarios de una publicación por ID

GET /posts/:postId/comments
-Petición: Espera el ID de la publicación deseada como parte de la URL (/posts/:postId/comments).
-Respuesta: Devuelve un arreglo JSON que contiene la lista de todos los comentarios asociados a la publicación con el ID especificado. Cada comentario incluye su ID, ID de la publicación asociada y el cuerpo del comentario.
*/
app.get('/posts/:postId/comments', (req, res) => {
    const postId = req.params.postId;
    db.all("SELECT * FROM comments WHERE postId = ?", [postId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

/*
Endpoint - crear un nuevo comentario en una publicación

POST /posts/:postId/comments
-Petición: Espera el ID de la publicación a la que se desea agregar el comentario como parte de la URL (/posts/:postId/comments). Además, espera un objeto JSON en el cuerpo de la solicitud con el campo body (contenido del comentario).
-Respuesta: Devuelve un objeto JSON que representa al nuevo comentario creado, incluyendo su ID, ID de la publicación asociada y el cuerpo del comentario. Además, devuelve un código de estado 201 (Created) indicando que la creación fue exitosa.
*/
app.post('/posts/:postId/comments', (req, res) => {
    const postId = req.params.postId;
    const { body } = req.body;
    db.run("INSERT INTO comments (postId, body) VALUES (?, ?)", [postId, body], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, postId, body });
    });
});

/* 
Endpoint - eliminar un comentario por su ID

DELETE /comments/:id
-Petición: Espera el ID del comentario que se desea eliminar como parte de la URL (/comments/:id).
-Respuesta: En caso de éxito, devuelve un mensaje indicando que el comentario fue eliminado exitosamente. Si no se encuentra ningún comentario con ese ID,
 devuelve un mensaje indicando que el comentario no fue encontrado, junto con un código de estado 404 (Not Found).
*/
app.delete('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    db.run("DELETE FROM comments WHERE id = ?", [commentId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).send(`Comentario con ID ${commentId} eliminado exitosamente.`);
    });
});

/*
Endpoint - actualizar un comentario por su ID

PUT /comments/:id
-Petición: Espera el ID del comentario que se desea actualizar como parte de la URL (/comments/:id). Además, espera un objeto JSON en el cuerpo de la solicitud con el campo body (contenido del comentario).
-Respuesta: En caso de éxito, devuelve un objeto JSON que representa al comentario actualizado, incluyendo su ID, ID de la publicación asociada y el cuerpo del comentario actualizado. Si no se encuentra ningún
 comentario con ese ID, devuelve un mensaje indicando que el comentario no fue encontrado, junto con un código de estado 404 (Not Found).
*/
app.put('/comments/:id', (req, res) => {
    const commentId = req.params.id;
    const { body } = req.body;
    db.run("UPDATE comments SET body = ? WHERE id = ?", [body, commentId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: commentId, body });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
});
