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

const getAllProducts = async (id) => {
  try{
    const[rows] = await promisePool.query('SELECT Product.price_flex, Product.price, Product.description, Product.location, Picture.url FROM Product, Picture WHERE Product.id = Picture.id;');
    return rows
  }catch(e){
    console.log('error', e.message);
  }
}

/*SELECT url
FROM Picture
  INNER JOIN Product_picture_relation ON product_id = ?
WHERE Picture.id = Product_picture_relation.picture_id
*/


const getPictures = async (id) =>{
  try{
    const [rows] = await promisePool.query('SELECT Picture.url FROM Picture');
    return rows
  }catch(e){
    console.log('error', e.message);
  }
}

module.exports = {
    getImage,
    getAllProducts,
    getPictures,
  };