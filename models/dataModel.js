const pool = require('../database/db');
const promisePool = pool.promise();

const getImage = async (id) => {
    try {
    const [rows] = await promisePool.query('SELECT test.filename FROM test');
    return rows
} catch (e) {
    console.log('error', e.message);
  }
};

module.exports = {
    getImage,
  };