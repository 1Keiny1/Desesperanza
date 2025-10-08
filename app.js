const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'n0m3l0',
    database:'conexion'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))

function validarNombre(req, res, next) {
    const nombre = removeTags(req.body.nombre || req.body.nombre_b || req.body.nombre_ant || req.body.nombre_nuevo);
    if (!nombre || numeroRegex.test(nombre)) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Error</h1>
                                        <p>No se permiten números</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);
    }
    req.nombreLimpio = nombre; // lo guardamos para usarlo en la query
    next();
}


const numeroRegex = /\d/;

function removeTags(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/<\?php.*?\?>/gs, '');
    }

app.use(express.static('public'))

app.post('/agregarUsuario', validarNombre, (req, res) => {
    let nombre =  removeTags(req.body.nombre);

    con.query(
        'INSERT INTO usuario (nombre) VALUES (?)',
        [nombre],
        (err, respuesta, fields) => {
            if (err) {
                console.log("Error al insertar", err);
                return res.status(500).send("Error al insertar");
            }
            return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario agregado</h1>
                                        <p>Nombre: ${nombre}</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
            `);
        }
    );
});


app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fin consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;
        
        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                    <h1 class="card-title text-center mb-4">Obtener Usuarios</h1>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-hover align-middle">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Nombre</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${userHTML}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);


    });
});

app.post('/borrarUsuario', validarNombre, (req, res) => {
    const nombre_b =  removeTags(req.body.nombre_b);

    con.query('DELETE FROM usuario WHERE nombre = ?', [nombre_b], (err, resultado) => {
        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send(`
                 <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Eliminado</h1>
                                        <p>"Error al borrar el usuario"</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
            `);
        }

        if (resultado.affectedRows === 0) {
            return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Eliminado</h1>
                                        <p>No se encontró ningún usuario con el nombre "${nombre_b}"</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>

                `);
        }

        return res.send(`
        <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Eliminado</h1>
                                        <p>Usuario "${nombre_b}" borrado correctamente</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
            `);
    });
});

app.post('/modificarUsuario', validarNombre, (req, res) => {
    const nombre_ant =  removeTags(req.body.nombre_ant);
    const nombre_nuevo =  removeTags(req.body.nombre_nuevo);

    con.query(
        'UPDATE usuario SET nombre = ? WHERE nombre = ?',
        [nombre_nuevo, nombre_ant],
        (err, resultado) => {
            if (err) {
                console.error('Error al modificar el usuario:', err);
                return res.status(500).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Modificado</h1>
                                        <p>"Error al modificar el usuario"</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
                    
                    `);
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Modificado</h1>
                                        <p>No se encontró ningún usuario con el nombre "${nombre_ant}"</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
                    
                    `);
            }

            return res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Lista de Usuarios</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="card shadow-lg border-0 rounded-4">
                                <div class="card-body">
                                        <h1>Usuario Modificado</h1>
                                        <p>Usuario "${nombre_ant}" modificado correctamente a "${nombre_nuevo}"</p>
                                    <div class="text-center mt-3">
                                        <a class="btn btn-outline-secondary" href="/">Volver</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
                `);
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));