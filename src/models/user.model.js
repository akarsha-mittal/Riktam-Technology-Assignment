const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = mongoose.model(
  "users",
  new Schema({
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    user_type: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    }
  },{ timestamps :true,versionKey:false}),
);

module.exports = User;
