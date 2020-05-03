const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const fs = require('fs');

let ssl_data = false;

const PORT = config.get( 'PORT' ) || 3001;
const app = express();

app.use( express.json( { extended: true } ) );

app.use( '/api/contacts/',  require('./routes/contacts.routes') );
app.use( '/api/projects/',  require('./routes/projects.routes') );
app.use( '/api/portfolio/', require('./routes/portfolio.routes') );
app.use( '/api/blogs/',     require('./routes/blogs.routes') );

app.use( (req, res, next) => {
  if( req.secure ) return next();
  return res.redirect('https://' + req.headers.host + req.url);
});

if ( process.env.NODE_ENV === 'production') {
  ssl_data = {
    key: fs.readFileSync( config.get('SSL_KEY') ),
    cert: fs.readFileSync( config.get('SSL_CERT') )
  };
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
    if (ssl_data) {
      https.createServer(ssl_data, app).listen( 443, () => console.log(`[Server]: Соединение с сервером установлено по адресу: ${config.get('HOST')}:443`))
    } 
    app.listen( PORT, () => {
      console.log(`[Server]: Соединение с сервером установлено по адресу: ${config.get('HOST')}:${PORT}`)
    })
  } catch (error) {
    console.log(`[ServerError]: ${ error }`);
    process.exit( 1 );
  }
}

startServer()