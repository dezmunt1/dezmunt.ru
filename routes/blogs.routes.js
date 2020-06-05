const { Router } = require('express');
const { promises: fs} = require('fs');
const {remove: fsRemove} = require('fs-extra');
const path = require('path');
const config = require('config');
const BlogsModel = require('../models/BlogsModel');
const { Types } = require('mongoose');
const AuthorsModel = require('../models/AuthorsModel');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const isProduction = process.env.NODE_ENV === 'production';

const router = Router();
const resError = (res, status, message,) => res.status(status).json({ message: "", errors: message });

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

router.get('/page/:page', async (req, res) => {
  try {
    if ( typeof +req.params.page !== "number") {
      return res.status(400).json({ message: "", errors: `Не корректный запрос` });
    };
    const numberParams = +req.params.page;
    const page = numberParams === 1 ? 0 : numberParams - 1;
    const data = await BlogsModel
                          .find()
                          .sort({created: -1})
                          .skip( page * 10 )
                          .limit( 10 );
    const lengthCollection = await BlogsModel.countDocuments();
    if ( !data || data.length === 0 ) {
      return res.status(400).json({ message: "", errors: `Блоги еще не созданы2` });
    }
    return res.status(200).json({ message: { data, lengthCollection }, errors: "" });
                      
      
  } catch (error) {
    console.log('[error]' + error.message)
  }

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

router.post( '/create', upload.any(), async (req, res) => {
  try {
    const blog = new BlogsModel();
    const blogPath = path.resolve( './client/public/img/blogs', blog.id );
    const forImagePath = path.resolve( `${ isProduction ? "" : '/img' }/blogs`, blog.id );
    
    await fs.mkdir( `${blogPath}`, {recursive: true} );

    req.files.forEach( element => {
      const mime = element.mimetype.split('/')[1];
      fs.rename( path.resolve( element.path ), path.resolve( blogPath, `${element.fieldname}.${mime}` ) );
      if ( element.fieldname === 'previewImage' ) blog.blogPost.preview.image = path.resolve( forImagePath, `${element.fieldname}.${mime}` );
      blog.blogPost.full.images[ element.fieldname ] = path.resolve( forImagePath, `${element.fieldname}.${mime}` );
    });
    
    blog.link = `/blog/article/${blog.id}`;
    blog.author = { name: req.body.authorName, link: Types.ObjectId( req.body.authorId ) };
    blog.blogPost.preview.header = req.body.blogHeader;
    blog.blogPost.full.header = req.body.blogHeader;
    blog.blogPost.preview.text = req.body.previewText;
    blog.blogPost.full.text = req.body.textArea;

    const author = await AuthorsModel.findById( req.body.authorId );
    author.blogs.push( blog._id );
    await author.save();
    await blog.save();
    
    return res.status(200).json({ message: `Успешно`, errors: "" });

  } catch (error) {
    console.log(error.message)
  };
});

router.post( '/edit', upload.any(), async (req, res) => {
  try {
    const { blogId } = req.body;
    const updateArr = getUpdateArray(req.body, req.files);
    await BlogsModel.updateMany({_id: Types.ObjectId(blogId)}, updateArr);

    return res.status(200).json({ message: `Блог ${blogId} успешно обновлен`, errors: "" });

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
    return res.status(400).json({ message: "", errors: `[server_error]: ${error.message}` })
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

router.get( '/get-author/:id&:page', async (req, res) => {
  try {
    
    const data = await AuthorsModel.findById( req.params.id );
    
    if( !data ) return resError( res, 404, `Автор ${req.params.id } не найден`);
    if( typeof +req.params.page !== "number" ) return resError( res, 404, `Параметр ${req.params.page } не корректный`);

    const numberParams = +req.params.page;
    const page = numberParams === 1 ? 0 : numberParams - 1;
    const blogsData = await BlogsModel
                          .find({_id: data.blogs})
                          .sort({created: -1})
                          .skip( page * 5 )
                          .limit( 5 );

    return res.status(200).json({ message: {author: data, blogs: { data: blogsData, lengthCollection: data.blogs.length}}, errors: "" }) 

  } catch (error) {
    console.log(error.message)
  };
});

router.delete( '/delete/:blogid&:authorid', async (req, res) => {
  try {
    const blogId = req.params.blogid;
    const authorid = req.params.authorid;
    const blogDir = path.resolve( './client/public/img/blogs', blogId );
    await BlogsModel.deleteOne({_id: Types.ObjectId( blogId )});
    await AuthorsModel.updateOne({_id: Types.ObjectId(authorid)}, {$pull: { blogs: Types.ObjectId(blogId)}}); // найти в массиве puull delete
    await fsRemove( blogDir );
    res.status(200).json({ message: `Блог "${blogId}" успешно удален` , errors: "" });
  } catch (error) {
    console.log(error.message)
  }
});

router.post( '/get-author/', async (req, res) => {
  try {
    const { author, secret } = req.body;
    const data = await AuthorsModel.findOne( {name: author} );
    if( !data ) return resError(res, 404, `Автор ${author} не найден`);

    if ( config.get('SECRET_BLOG') !== secret ) return resError(res, 401, `Секрет не верный, доступ закрыт`);

    return res.status(200).json({ message: data, errors: "" }) 


  } catch (error) {
    console.log(error.message)
  }
});
module.exports = router;


function getUpdateArray( textFields, fileFields ) {
  const updates = [];
  for (let field of Object.keys(textFields)) {
    // Text Fields
    if ( textFields[field] === 'withoutChanges' ) {
      continue;
    };
    const dbDataPath = field === 'blogHeader' ? 'blogPost.preview.header'
      : field === 'previewImage' ? 'blogPost.preview.image'
      : field === 'previewText' ? 'blogPost.preview.text'
      : field === 'textArea' ? 'blogPost.full.text'
      : undefined;

    if ( !dbDataPath ) continue;
    updates.push( {$set: { [dbDataPath]: textFields[field]}} );
  };
  // File Fields
  const blogPath = path.resolve( './client/public/img/blogs', textFields.blogId );
  const forImagePath = path.resolve( `${ isProduction ? "" : '/img' }/blogs`, textFields.blogId );

  fileFields.forEach( element => {
    const mime = element.mimetype.split('/')[1];
    fs.rename( path.resolve( element.path ), path.resolve( blogPath, `${element.fieldname}.${mime}` ) );
    if ( element.fieldname === 'previewImage' ) {
      const inDBPath = path.resolve( forImagePath, `${element.fieldname}.${mime}` );
      updates.push( {$set: { 'blogPost.preview.image': inDBPath }} );
    };
    const inDBPath = path.resolve( forImagePath, `${element.fieldname}.${mime}` );
    updates.push( {$set: { [`blogPost.full.images.${element.fieldname}`]: inDBPath }} );
  });
  return updates;
}