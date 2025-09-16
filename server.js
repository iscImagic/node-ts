require ('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost: ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});