const bcrypt = require('bcrypt');

const plaintextPassword = '16151662';
const saltRounds = 10;

const hash = await bcrypt.hash(plaintextPassword, saltRounds)
  console.log('Hashed password:', hash);
  // Store hash in the database
