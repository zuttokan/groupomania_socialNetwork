// call mongoose for creating a schema
const mongoose = require('mongoose');
// validation for unique fields in a Mongoose schema
const uniqueValidator = require('mongoose-unique-validator');
const MongooseErrors = require('mongoose-errors');
// User schema
const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
userSchema.plugin(MongooseErrors);

module.exports = mongoose.model('User', userSchema);
