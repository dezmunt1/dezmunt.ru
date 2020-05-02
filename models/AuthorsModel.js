const { model, Schema, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, default: 'Jhon Doe' },
  about: { type: String, default: ""},
  contact: {
    email: { type: String, default: "" },
    other: { type: Object, default: {} }
  },
  avatar: { type: String, default: '' },
  blogs: [ { type: Types.ObjectId, ref: 'Blogs' } ]
});

module.exports = model( 'Authors', schema );