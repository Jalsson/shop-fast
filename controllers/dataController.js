const dataModel = require('../models/dataModel');


const image_get =  async (req, res) => {
    console.log('picture id parameter', req.params);
    const image = await dataModel.getImage();
    res.json(image);
  };

const products_get = async (req,res) => {
  const products = await dataModel.getAllProducts();
  res.json(products);
};

const pictures_get = async (req,res) => {
  const pictures = await dataModel.getPictures();
  res.json(pictures);
}
  module.exports = {
    image_get,
    products_get,
    pictures_get,
  };