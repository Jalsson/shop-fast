const pool = require('../database/db');
const promisePool = pool.promise();
let productId = 1

//returns one image which has right owner id
const getImage = async (id) => {
    try {
    const [rows] = await promisePool.execute('SELECT url FROM Picture INNER JOIN Product_picture_relation ON Product_picture_relation.product_id = ? WHERE Picture.id = Product_picture_relation.picture_id', [id]);
    
    return rows
} catch (e) {
    console.log('error', e.message);
  }
};

//returns all products in db
const getAllProducts = async (id) => {
  try{
    
    const [rows] = await promisePool.execute('SELECT id, name, owner_id, price_flex, price, description, location FROM Product');
    return rows
    //
  }catch(e){
    console.log('error', e.message);
  }
}



//Inserts all the mandatory data to db
//first is inserted products data
const insertData = async (data, pictures) => {
  try {
    const [dataRows] = await promisePool.query('INSERT INTO Product (name, owner_id, price_flex, price, description, location) VALUES (?, ?, ?, ?, ?, ?)', data);
    const dataInsertId = dataRows.insertId;
    
    let pictureInsert = []
    let pictureId = []

    //pictures added next
    for(let z = 0; z < pictures.length; z++){
      console.log('inside loop')
    let picture = pictures[z];
    let [pictureInsert] = await promisePool.query('INSERT INTO Picture (url) VALUES (?)', picture);
    pictureId.push(pictureInsert.insertId);
    }

   //finally picture and product relation with their correct id's
    for(let i = 0; i< pictureId.length; i++){
      let picId = pictureId[i]
      
      let [relation] = await promisePool.query('INSERT INTO Product_picture_relation (product_id, picture_id) VALUES (?, ?)', [dataInsertId, picId ]);
    }

    return dataRows, pictureInsert;
    
  } catch (e) {
    console.error('error', e.message);
  }
  
};
//returns every pictures
const getPictures = async (id) =>{
  try{
    const [rows] = await promisePool.execute('SELECT Picture.url FROM Picture');
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