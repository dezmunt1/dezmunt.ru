const { model, Schema } = require('mongoose');

const schema = new Schema({
  name: {type: String, default: "name"},
  open: {type: Boolean, default: false},
  projectName: {type: String, default: "name"},
  title: {type: String, default: "Название проекта"},
  technology: {type: String, default: "Используемые технологии"},
  target: {type: String, default: "Цель проекта"},
  capabality: {type: String, default: "Возможности"},
  fix: {type: String, default: "Что надо исправить"},
  next: {type: String, default: "Что надо добавить"}
});

module.exports = model( 'Projects', schema );