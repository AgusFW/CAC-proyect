import express, { json } from 'express';
import pool from './config/db.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url); // c://sdfsdfds/index.js
const __dirname = dirname(__filename); // c://sdfsdfds/

const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  console.log("req.cookies", req.cookies)
  if (!token) {
    return res.status(403).send('Token requerido');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("decoded", decoded)
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Token no válido');
  }
}

app.get('/', (req, res) => {
  let mensaje = req.query.mensaje
  res.send('Inicio ' + mensaje)
})


// LOGIN
app.post('/login', async (req, res) => {
  const { nombre, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuariosDB WHERE nombre = ?', [nombre]);
    const user = rows[0];

    if (!user) {
      connection.release();
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      connection.release();
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ nombre: user.nombre, rol: user.rol }, SECRET_KEY, { expiresIn: '2h' });
    console.log("Token: ", token)
    res.cookie(
      'token',
      token,
      {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 60 * 60 * 1000
      }
    ).status(200).json({ message: 'Autenticación exitosa' });

    connection.release();
  } catch (error) {
    console.error('Error al autenticar al usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
})

app.get('/admin', verifyToken, (req, res) => {
  if (req.user.rol === 'admin') {
    res.sendFile(__dirname + '/UsersAdmin.html'); // c://sdfsdfds/admin.html
  }
  res.status(403).send('No tienes permisos para acceder a esta ruta');
})


//CRUD USUARIOS
app.get('/usuarios',  async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuarios');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/usuario', async (req, res) => {
  const { nombre, password, email, rol } = req.body;

  try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
          'INSERT INTO usuarios (nombre, password, email, rol) VALUES (?, ?, ?, ?)',
          [nombre, password, email, rol]
      );
      connection.release();

      res.status(201).json({ message: 'Usuario creado exitosamente', usuarioId: result.insertId });
  } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear usuario' });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  const usuarioId = req.params.id;

  try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
          'DELETE FROM usuarios WHERE _id = ?',
          [usuarioId]
      );
      connection.release();

      if (result.affectedRows > 0) {
          res.json({ message: 'Usuario eliminado exitosamente' });
      } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
      }
  } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor al eliminar usuario' });
  }
});



//CRUD SEDES

app.get('/api/sedes', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM sedes');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las sedes', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/sede', async (req, res) => {
  const { nombre, sala, direccion, direccion_img, link } = req.body;

  console.log('Datos recibidos:', req.body);

  try {
      if (!nombre || !direccion || !link || !direccion_img) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO sedes (nombre, sala, direccion, direccion_img, link) VALUES (?, ?, ?, ?, ?)',
      [nombre, sala, direccion, direccion_img, link]
    );
    connection.release();

    res.status(201).json({ message: 'Sede creada exitosamente', sedeId: result.insertId });
  } catch (error) {
    console.error('Error al crear sede:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear sede', error: error.message });
  }
});

app.put('/api/sede/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, sala, direccion, direccion_img, link } = req.body;

  try {
    if (!nombre || !direccion || !link || !direccion_img) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const connection = await pool.getConnection();

    // Obtener los datos antiguos de la sede
    const [oldData] = await connection.query('SELECT * FROM sedes WHERE id = ?', [id]);

    if (oldData.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    const [result] = await connection.query(
      'UPDATE sedes SET nombre = ?, sala = ?, direccion = ?, direccion_img = ?, link = ? WHERE id = ?',
      [nombre, sala, direccion, direccion_img, link, id]
    );
    connection.release();

    res.status(200).json({
      message: 'Sede actualizada exitosamente',
      oldData: oldData[0],
      newData: { id, nombre, sala, direccion, direccion_img, link }
    });
  } catch (error) {
    console.error('Error al actualizar sede:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al actualizar sede' });
  }
});

app.delete('/api/sede/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    // Verificar si la sede existe
    const [result] = await connection.query('SELECT * FROM sedes WHERE id = ?', [id]);

    if (result.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    // Eliminar la sede
    await connection.query('DELETE FROM sedes WHERE id = ?', [id]);
    connection.release();

    res.status(200).json({ message: 'Sede eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sede:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al eliminar sede' });
  }
});









app.get('/admin', verifyToken, (req, res) => {
  if (req.user.rol === 'admin') {
    res.sendFile(__dirname + '/UsersAdmin.html'); // c://sdfsdfds/admin.html
  }
  res.status(403).send('No tienes permisos para acceder a esta ruta');
})






app.get('/logout', (req, res) => {
  res.clearCookie('token').send('Logout exitoso');
})


/*//Todos los usuarios
app.get('/users', async (req, res) => {
  try {
    let query = req.query
    // Toma una conexión de la pool
    const connection = await pool.getConnection()
    // Cuando hace la consulta, se almacena la respuesta y se libera la conexión
    const [rows] = await connection.query('SELECT * FROM usuariosDB')
    // console.log("ROWS -->", rows);
    connection.release()
    // Envía la respuesta al cliente
    let filtrados = rows.filter((registro) => registro.rol === query.rol ) 
    console.log(filtrados)
    if (filtrados.length > 0) {
        res.json(filtrados) 
    } else {
        res.json(rows[0])
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    res.status(500).send('Internal server error')
  }
})

// Autenticación de usuarios
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuariosDB WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    if (user.password !== password) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Autenticación exitosa' });

    connection.release();
  } catch (error) {
      console.error('Error al autenticar al usuario', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//Un usuario segun id
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id

    const connection = await pool.getConnection()
    const [rows] = await connection.query(
      'SELECT * FROM usuariosDB WHERE id = ?',
      [id]
    )
    connection.release()
    if (rows.length === 0) {
      res.status(404).json({ mensaje: 'User not found' })
    } else {
        
       res.json(rows[0])
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    res.status(500).send('Internal server error')
  }
})

//crear usuario
app.post('/users', async (req, res) => {
  try {
    console.log('REQ.BODY -->', req.body)
    // Obtiene los valores del formulario
    const { nombre, email, password, rol } = req.body
    const connection = await pool.getConnection()
    // const [result] = await connection.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, password, rol]);
    const [result] = await connection.query('INSERT INTO usuariosDB SET ?', [
      req.body
    ])
    connection.release()
    res.json({ id: result.insertId, nombre, email, rol })
    // res.redirect('/' + "?mensaje=Usuario creado correctamente")
  } catch (err) {
    console.error('Error connecting to database', err)
    res.status(500).send('Internal server error')
  }
})

// Actualizar un usuario
app.post('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { nombre, email, password, rol } = req.body
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'UPDATE usuariosDB SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?',
      [nombre, email, password, rol, id]
    )
    // const [result] = await connection.query('INSERT INTO usuarios SET ?', [req.body]);
    connection.release()
    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'User not found' })
    } else {
      // res.json({ mensaje: 'User updated successfully' });
      res.redirect('/' + '?mensaje=Usuario actualizado')
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    res.status(500).send('Internal server error')
  }
})

//borrar un usuario
app.get('/users/borrar/:id', async (req, res) => {
  try {
    const id = req.params.id
    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'DELETE FROM usuariosDB WHERE id = ?',
      [id]
    )
    connection.release()
    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'User not found' })
    } else {
      res.json({ mensaje: 'User deleted successfully' })
      // res.redirect('/' + "?mensaje=Usuario eliminado");
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    res.status(500).send('Internal server error')
  }
})*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
