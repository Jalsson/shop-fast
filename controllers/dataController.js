const dataModel = require("../models/dataModel");
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
console.log(products.length)
  for (let i = 0; i < products.length; i++) {
      dataModel.getImage(products[i].id)
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
        console.log(productsWithImages);
      }
      })
  }
};

const images_get = async (req, res) => {
  console.log("images called");
  const images = await dataModel.getAllImages();
  res.json(images);
  console.log(images);
};

const data_post = async (req, res) => {
  //console.log('dataPost', req.body, req.files);

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    //
    const pic1 = req.files[0];
    const pictures = [];
    pictures.push(pic1.filename);

    console.log(req.files[1]);
    if (!req.files[1] == "") {
      pic2 = req.files[1];
      pictures.push(pic2.filename);
      console.log("toinen if: " + pictures);
    }
    if (!req.files[2] == "") {
      pic3 = req.files[2];
      pictures.push(pic3.filename);
      console.log("kolmas if: " + pictures);
    }

    const data = [
      req.body.name,
      req.body.owner_id,
      req.body.price_flex,
      req.body.price,
      req.body.description,
      req.body.location,
    ];

    console.log("pictures:" + pictures);
    const mergedData = await dataModel.insertData(data, pictures);
    console.log(mergedData);
  } catch (e) {
    console.log(e);
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
};
