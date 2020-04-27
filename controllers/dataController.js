const dataModel = require('../models/dataModel');
const {validationResult} = require('express-validator');


const image_get =  async (req, res) => {
    console.log('picture id parameter', req.params);
    const image = await dataModel.getImage();
    res.json(image);
  };

const products_get = async (req,res) => {
  const products = await dataModel.getAllProducts();
  res.json(products);
};

const data_post = async (req, res) => {
  
  //console.log('dataPost', req.body, req.files);
  
  const pic1 = req.files[0];
  const pic2 = req.files[1];
  const pic3 = req.files[2];
  console.log(pic1, pic2, pic3);
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  try{

  const data =[
    req.body.name,
    req.body.owner_id,
    req.body.price_flex,
    req.body.price,
    req.body.description,
    req.body.location, 
  ];

const pictures= []
  if(!pic1.filename == null){
    pictures.push(pic1.filename)
  }
  if(!pic2.filename == null){
    pictures.push(pic2.filename)
  }
  if(!pic3.filename == null){
    pictures.push(pic3.filename)
  }


  const mergedData = await dataModel.insertData(data, pictures);
  console.log('inserted', mergedData)
  
}catch(e) {
  console.log(e);
}

}
//
const pictures_get = async (req,res) => {
  const pictures = await dataModel.getPictures();
  res.json(pictures);
}
  module.exports = {
    image_get,
    products_get,
    pictures_get,
    data_post,
  };
  