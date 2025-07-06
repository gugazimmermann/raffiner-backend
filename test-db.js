require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexão com MongoDB Atlas estabelecida!');
    
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = new TestModel({ name: 'Teste de conexão' });
    await testDoc.save();
    console.log('✅ Documento criado com sucesso!');
    
    await mongoose.connection.close();
    console.log('✅ Conexão fechada!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testConnection();
