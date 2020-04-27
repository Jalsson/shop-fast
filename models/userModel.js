const pool = require('../database/db');
const promisePool = pool.promise();


const insertUser = async (user) => {
  try {
  const [rows] = await promisePool.query('INSERT INTO Users (username,email,password) VALUES (?,?,?)', [ user.name, user.email, user.password ]);
  return rows;
} catch (e) {
  console.log('error', e.message);
}
}

const selectUser = async (user) => {
try {
const [rows] = await promisePool.query('SELECT username ,email, password FROM Users WHERE username = ? OR  email = ?', [ user.name, user.email]);
return rows[0];
} catch (e) {
console.log('error', e.message);
}
}

module.exports = {
insertUser,
selectUser
};