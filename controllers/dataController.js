const dataModel = require("../models/dataModel");
const imageMeta = require("../utils/imageMeta")
const { validationResult } = require("express-validator");
let pic2 = "";
let pic3 = "";


//returns image as a json response
const image_get = async (req, res) => {
  console.log("picture id parameter", req.params);
  const image = await dataModel.getImage();
  res.json(image);
};

//returns products as json response and combines them with their images
//images are returned as object which is inside object
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




//Inserts products data and pictures into object and then pushes themn to db
//Coordinates are being taken from first img file using exif data 
const data_post = async (req, res) => {

  console.log(req.user.id)
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {

    const pic1 = req.files[0];
    const path = req.files[0].path;
    
    const pictures = [];
    pictures.push(pic1.filename);

    let coords = ""
    //coordinates from picture
    try{coords = await imageMeta.getCoordinates(path);
    }catch(e){
      console.log("no coordinates in image")
    }
    
    let location = "";
    if(!coords == ""){
    //coordinates inserted to location
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
  //reloads the page 
  res.redirect("/app/frontpage")
};

//gets all images as json
const pictures_get = async (req, res) => {
  const pictures = await dataModel.getPictures();
  res.json(pictures);
};

//checks if input has tags which may harm the server
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
