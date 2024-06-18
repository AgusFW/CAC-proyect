import express from 'express'
import pool from './config/db.js'

const app = express()
const port = 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

app.get('/', (req, res) => {
  let mensaje = req.query.mensaje
  res.send('Inicio ' + mensaje)
})

// CRUD routes
//Todos los usuarios
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
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
