const dataModel = require('../models/dataModel');


const image_get =  async (req, res) => {
    console.log('picture id parameter', req.params);
    const image = await dataModel.getImage();
    res.json(image);
  };

  module.exports = {
    image_get,
  };