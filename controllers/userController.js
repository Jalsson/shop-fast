const userModel = require('../models/userModel');

const addUser =  async (req, res) => {
    const image = await userModel.insertUser(req.params.id);
    res.json(image);
  };

  module.exports = {
    addUser
  };