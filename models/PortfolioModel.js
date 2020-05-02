const { model, Schema } = require('mongoose');

const schema = new Schema({
  name: {type: String, default: "Без имени"},
  category: {type: String, default: "Заказ"},
  technology: {type: String, default: "Используемые технологии"},
  image: {type: String, default: "/defaultImage"},
  link: {type: String, default: "http://info.cern.ch/"},
  projectName: {type: String, default: "Без имени"},
});

module.exports = model( 'Portfolio', schema );