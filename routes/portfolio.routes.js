const { Router } = require('express');
const PortfolioModel = require('../models/PortfolioModel');

const router = Router();

router.get( '/get-portfolio', async (req, res) => {
  try {
    const data = await PortfolioModel.find();
    if ( !data || data.length === 0 ) {
      return res.status(400).json({ message: "", errors: `Ваше портфолио пустое` });
    }
    
    return res.status(200).json({ message: data, errors: "" });

  } catch (error) {
    console.log(error.message)
  };
});

module.exports = router;