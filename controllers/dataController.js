const dataModel = require("../models/dataModel");
const imageMeta = require("../utils/imageMeta")
const { validationResult } = require("express-validator");
let pic2 = "";
let pic3 = "";
//
var gm = require('gm')
  , width = 200
  , height = 400


const image_get = async (req, res) => {
  console.log("picture id parameter", req.params);
  const image = await dataModel.getImage();
  res.json(image);
};


const products_get = async (req, res) => {
  let products = await dataModel.getAllProducts();
  var productsWithImages = [];
  
  for (let i = 0; i < products.length; i++) {
   await dataModel.getImage(products[i].id)
    .then(tempUrls => {
      productsWithImages.push({
        id: products[i].id,
        name: products[i].name,
        owner_id: products[i].owner_id,
        price_flex: products[i].price_flex,
        price: products[i].price,
        description: products[i].description,
        location: products[i].location,
        urls: tempUrls, 
      });
      if(i === products.length -1){
      res.json(productsWithImages);
      console.log(productsWithImages)
    }
    })
}
};


const images_get = async (req, res) => {
  console.log("images called");
  const images = await dataModel.getAllImages();
  res.json(images);
  
};


const data_post = async (req, res) => {

  console.log(req.user.id)
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {

  for(let i = 0; i < req.files.length; i++){
    gm(req.files[i].path)
    .crop(width, height, 0, 0)
  .write( function (err) {
    if (err) {"rip"}
    });
  }

    const pic1 = req.files[0];
    const path = req.files[0].path;
    
    const pictures = [];
    pictures.push(pic1.filename);

    let coords = ""
    try{coords = await imageMeta.getCoordinates(path);
    }catch(e){
      console.log("no coordinates in image")
    }
    
    let location = "";
    if(!coords == ""){
      location = coords;
    }else{
      location = req.body.location;
    }
    
    if (!req.files[1] == "") {
      pic2 = req.files[1];
      pictures.push(pic2.filename);
    }
    if (!req.files[2] == "") {
      pic3 = req.files[2];
      pictures.push(pic3.filename);
    }
    name = removeTags(req.body.name);
    description = removeTags(req.body.description);
    const data = [
      name,
      req.user.id,
      req.body.price_flex,
      req.body.price,
      description,
      location,
    ];
    
    const mergedData = await dataModel.insertData(data, pictures);
    
  } catch (e) {
    console.log("dataController"+e);
  }
  req.flash('success_msg', 'Product inserted succesfully')
  res.redirect("/app/data/pic")
};

const pictures_get = async (req, res) => {
  const pictures = await dataModel.getPictures();
  res.json(pictures);
};

function removeTags(str) {
  str = str.trim()
  if ((str===null) || (str===''))
  return false;
  else
  str = str.toString();
  return str.replace( /(<([^>]+)>)/ig, '');
}

module.exports = {
  image_get,
  products_get,
  images_get,
  pictures_get,
  data_post,
};
