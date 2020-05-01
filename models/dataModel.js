const pool = require('../database/db');
const promisePool = pool.promise();
let productId = 1
const getImage = async (id) => {
    try {
    const [rows] = await promisePool.execute('SELECT url FROM Picture INNER JOIN Product_picture_relation ON Product_picture_relation.product_id = ? WHERE Picture.id = Product_picture_relation.picture_id', [id]);
    
    return rows
} catch (e) {
    console.log('error', e.message);
  }
};
//
const getAllProducts = async (id) => {
  try{
    //const[rows] = await promisePool.query('SELECT Product.Name, Product.price_flex, Product.price, Product.description, Product.location, Picture.url FROM Product, Picture WHERE Product.id = Picture.id;');
    //return rows
    //const [rows] = await promisePool.query('SELECT Product.Name, Product.price_flex, Product.price, Product.description, Product.location, Picture.url FROM Product, Picture, Product_picture_relation WHERE Product.id = Product_picture_relation.product_id AND Product_picture_relation.picture_id = Picture.id;');
    //return rows
    const [rows] = await promisePool.execute('SELECT id, name, owner_id, price_flex, price, description, location FROM Product');
    return rows
    //
  }catch(e){
    console.log('error', e.message);
  }
}
const getAllImages = async (id) => {
  try{
    const [rows] = await promisePool.execute('SELECT url FROM Picture INNER JOIN Product_picture_relation ON Product_picture_relation.product_id = ? WHERE Picture.id = Product_picture_relation.picture_id', [productId]);
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
    const [dataRows] = await promisePool.query('INSERT INTO Product (name, owner_id, price_flex, price, description, location) VALUES (?, ?, ?, ?, ?, ?)', data);
    const dataInsertId = dataRows.insertId;
    console.log(dataInsertId);
  
    let pictureInsert = []
    let pictureId = []

    
    for(let z = 0; z < pictures.length; z++){
      console.log('inside loop')
    let picture = pictures[z];
    let [pictureInsert] = await promisePool.query('INSERT INTO Picture (url) VALUES (?)', picture);
    pictureId.push(pictureInsert.insertId);
    }

   
    
    for(let i = 0; i< pictureId.length; i++){
      let picId = pictureId[i]
      
      let [relation] = await promisePool.query('INSERT INTO Product_picture_relation (product_id, picture_id) VALUES (?, ?)', [dataInsertId, picId ]);
    }

    
    return dataRows, pictureInsert;
    
  } catch (e) {
    console.error('error', e.message);
  }
  //
};

const getPictures = async (id) =>{
  try{
    const [rows] = await promisePool.execute('SELECT Picture.url FROM Picture');
    return rows
  }catch(e){
    console.log('error', e.message);
  }
}

const filterProducts = async (location) =>{
  try{
    const [filtered] = promisePool.execute('SELECT id, name, owner_id, price_flex, price, description, location FROM Product WHERE location = ?', [location]);
    console.log(filtered)
    return filtered
  }catch(e){
    console.log('error', e.message);
  }
};
module.exports = {
    getImage,
    getAllProducts,
    getAllImages,
    getPictures,
    insertData,
    filterProducts,
  };