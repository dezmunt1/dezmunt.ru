const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

require('dotenv').config()

const PORT = config.get( 'PORT' ) || 3001;
const app = express();

app.use( express.json( { extended: true } ) );

app.use( '/api/contacts/',  require('./routes/contacts.routes') );
app.use( '/api/projects/',  require('./routes/projects.routes') );
app.use( '/api/portfolio/', require('./routes/portfolio.routes') );
app.use( '/api/blogs/',     require('./routes/blogs.routes') );

if ( process.env.NODE_ENV === 'production') {
  app.use( '/', express.static(path.join(__dirname, 'client', 'build')));

  app.get( '*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

async function startServer() {
  try {
    await mongoose.connect( config.get( 'MONGO_URI' ), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }, error => {
      if (!error) console.log(`[Server]: БД MongoDB успешно подключена`)
    });
    
    const server = app.listen( PORT, () => {
      console.log(`[Server]: Соединение с сервером установлено по адресу: ${config.get('HOST')}:${server.address().port}`)
    })
  } catch (error) {
    console.log(`[ServerError]: ${ error }`);
    process.exit( 1 );
  }
}

startServer()