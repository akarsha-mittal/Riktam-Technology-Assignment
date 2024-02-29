const mongoose = require("mongoose");

const { Schema } = mongoose;
const Group = mongoose.model(
  "groups",
  new Schema({
    name: {
      type: String,
    },
    created_by:  { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },{ timestamps :true,versionKey:false}),
);

module.exports = Group;