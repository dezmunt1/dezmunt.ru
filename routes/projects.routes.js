const { Router } = require('express');
const ProjectsModel = require('../models/ProjectsModel');

const router = Router();

router.get( '/getProjects', async (req, res) => {
  try {
    // if (!req.params.title) {
    //   return res.status(400).json({ message: "", errors: "Данные не отправлены" });
    // }
    const data = await ProjectsModel.find();

    if ( !data ) {
      return res.status(400).json({ message: "", errors: `Проекта "${req.params.title}" не существует` });
    }
    
    return res.status(200).json({ message: data, errors: "" });

  } catch (error) {
    console.log('[error]: ' + error.message)
  };
});

module.exports = router;