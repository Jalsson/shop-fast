const dataModel = require("../models/dataModel");
const imageMeta = require("../utils/imageMeta")
const { validationResult } = require("express-validator");
let pic2 = "";
let pic3 = "";

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
//

const images_get = async (req, res) => {
  console.log("images called");
  const images = await dataModel.getAllImages();
  res.json(images);
  
};

const getFilteredImages = async (req, res) =>{
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("error in getFilteredImages");
  }
  try{

  let location = req.body.location
  const filteredProducts = await dataModel.filterProducts(location)
  res.json(filteredProducts)

  }catch(e){
    console.log(e);
  }
};


const data_post = async (req, res) => {

  console.log(req.user.id)
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
//
  try {
    

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

    //console.log(req.files[1]);
    if (!req.files[1] == "") {
      pic2 = req.files[1];
      pictures.push(pic2.filename);
      
    }
    if (!req.files[2] == "") {
      pic3 = req.files[2];
      pictures.push(pic3.filename);
      
    }

    const data = [
      req.body.name,
      req.user.id,
      req.body.price_flex,
      req.body.price,
      req.body.description,
      location,
    ];
    
    const mergedData = await dataModel.insertData(data, pictures);
    
  } catch (e) {
    console.log("dataController"+e);
  }
  
};

const pictures_get = async (req, res) => {
  const pictures = await dataModel.getPictures();
  res.json(pictures);
};
module.exports = {
  image_get,
  products_get,
  images_get,
  pictures_get,
  data_post,
  getFilteredImages,
};
