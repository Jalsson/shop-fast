const userModel = require('../models/userModel');

const addUser =  async (req, res) => {
    const image = await userModel.insertUser(req.params.id);
    res.json(image);
  };
  
  const userGet = async (req,res) => {
    const user = await userModel.findUser(req.params);
    res.json(products);
  };
  module.exports = {
    addUser
  };