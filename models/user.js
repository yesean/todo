/* eslint-disable no-underscore-dangle */
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

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: String,
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const nextReturnedObject = returnedObject;
    nextReturnedObject.id = nextReturnedObject._id.toString();
    delete nextReturnedObject._id;
    delete nextReturnedObject.__v;
    delete nextReturnedObject.passwordHash;
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
