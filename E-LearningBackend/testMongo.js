require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

async function testConnection() {
  try {
    await mongoose.connect(process.env.URL_MONGO);
    console.log('✅ Connecté à MongoDB Atlas !');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  }
}

testConnection();