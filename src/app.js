const express = require('express');
const appRoutes = require('./routes/auth.routes'); // Assuming you have routes defined in a separate file
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


const app = express();
// Permitir CORS para todas las rutas y orígenes
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies


app.use('/api/auth', appRoutes); // Use the auth routes with a prefix
// Ruta base para test
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use(express.static(path.join(__dirname, 'public')));
module.exports = app; // Export the app for use in server.js


