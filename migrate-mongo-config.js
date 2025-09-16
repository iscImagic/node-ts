require('dotenv').config();
const path = require('path');

module.exports = {
  mongodb: {
    url: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Usa ruta absoluta a la carpeta migrations
  migrationsDir: path.join(__dirname, 'migrations'),

  // Usa extensión explícita y clara
  migrationFileExtension: '.js',

  // Nombre de la colección donde guarda historial
  changelogCollectionName: 'migrations'
};
