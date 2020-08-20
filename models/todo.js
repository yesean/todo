const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(url, connectOptions)
  .then((result) => {
    console.log('connected to to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const todoSchema = new mongoose.Schema({
  content: String,
  dueDate: Date,
  createdDate: Date,
  finished: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
