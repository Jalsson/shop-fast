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
    const[rows] = await promisePool.query('SELECT Product.Name, Product.price_flex, Product.price, Product.description, Product.location, Picture.url FROM Product, Picture WHERE Product.id = Picture.id;');
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

const insertData = async (data, pictures) => {
  try {
    //console.log('inserting data', data, picture);
    const [dataRows] = await promisePool.execute('INSERT INTO Product (Name, owner_id, price_flex, price, description, location) VALUES (?, ?, ?, ?, ?, ?)', data);
    //const dataPic1, dataPic2, dataPic3 = []
    for(let z = 1; z <= 3; z++){
    const [dataPic1] = await promisePool.execute('INSERT INTO Picture (url) VALUES (?)', pictures[z]);
    }
    const relation = []
    for(let i = 1; i<=3; i++){
      relation = await promisePool.execute('INSERT INTO Product_picture_relation (product_id, picture_id) VALUES (?, ?)', dataRows.insertId, dataPic.insertId )
    }
    console.log("inserted ID " + dataRows.insertId)
    return dataRows, dataPic1, dataPic2, dataPic3;
  } catch (e) {
    console.error('error', e.message);
  }
  
};



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
    insertData,
  };