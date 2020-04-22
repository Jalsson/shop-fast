const pool = require('../database/db');
const promisePool = pool.promise();

const insertUser = async (user) => {
    try {
    const [rows] = await promisePool.query('INSERT INTO Users (name,email,password) VALUES (?,?,?)', [ user.name, user.email, user.password ]);
    return rows;
} catch (e) {
    console.log('error', e.message);
  }
};

module.exports = {
  insertUser
  };