const { model, Schema, Types } = require('mongoose');

const schema = new Schema({
  views: { type: Number, default: 0 },
  created: { type: Date, default: () => Date.now() },
  author: {
    name: { type: String, default: "Jhon Doe" },
    link: {type: Types.ObjectId, ref: 'Authors'}
  },
  blogPost: {
    preview: {
      image: { type: String, default: "" },
      header: { type: String, default: "" },
      text: { type: String, default: "" }
    },
    full: {
      images: { type: Object, default: {} },
      header:  { type: String, default: "" },
      text: { type: String, default: "" }
    }
  },
  link: { type: String, default: '' },
  rate: {
    like: { type: Number, default: 0 }, 
    dislike: { type: Number, default: 0 }
  }
});

module.exports = model( 'Blogs', schema );