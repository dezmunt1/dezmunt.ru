const { Router } = require('express');
const BlogsModel = require('../models/BlogsModel');
const AuthorsModel = require('../models/AuthorsModel');

const router = Router();

router.get( '/', async (req, res) => {
  try {
    const data = await BlogsModel.find();
    if ( !data || data.length === 0 ) {
      return res.status(400).json({ message: "", errors: `Блоги еще не созданы` });
    }
    return res.status(200).json({ message: data, errors: "" });

  } catch (error) {
    console.log(error.message)
  };
});
router.get( '/:id', async (req, res) => {
  try {
    const data = await BlogsModel.findById( req.params.id );
    if ( data === null) {
      return res.status(400).json({ message: "", errors: `Такого блога не существует` })
    };
    return res.status(200).json({ message: data, errors: `` })

  } catch (error) {
    console.log('[error]' + error.message)
  };
})

router.post( '/create', async (req, res) => {
  try {
    // const author = new AuthorsModel();
    // const blog = new BlogsModel();
    // author.blogs = blog.id;
    // await author.save();
    // blog.author = author.id;
    // await blog.save();
    // console.log('zzzzzz')
    return res.status(200);

  } catch (error) {
    console.log(error.message)
  };
});

router.get( '/new-views/:id', async (req, res) => {
  try {
    const data = await BlogsModel.findById( req.params.id );
    if ( !data ) return res.status(404).json({ message: `Блог ${req.params.id } не найден`, errors: "" });
    data.views = ++data.views
    await data.save();
    return res.status(202).json({ message: data.views, errors: "" }) 
  } catch (error) {
    console.log(error.message)
  };
});

router.post( '/rate/:id', async (req, res) => {
  try {
    const data = await BlogsModel.findById( req.params.id );
    const rateType = req.body.type;
    data.rate[rateType] = ++data.rate[rateType];
    await data.save();
    res.status(202).json({ message: {[rateType]: data.rate[rateType]} , errors: "" })
    
  } catch (error) {
    console.log(error.message);
    res.status(202).json({ message: "" , errors: error.message })
  };
})

router.get( '/get-author/:id', async (req, res) => {
  try {
    const data = await AuthorsModel.findById( req.params.id );
    if ( !data ) return res.status(404).json({ message: `Автор ${req.params.id } не найден`, errors: "" });
    return res.status(200).json({ message: data, errors: "" }) 
  } catch (error) {
    console.log(error.message)
  };
});
module.exports = router;