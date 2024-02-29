const mongoose = require("mongoose");

const { Schema } = mongoose;
const Group = mongoose.model(
  "user_groups",
  new Schema({
    user_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (optional, use if createdBy is an ObjectId referencing User model)
      required: true
    },
    group_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group', // Reference to the User model (optional, use if createdBy is an ObjectId referencing User model)
      required: true 
    },
  },{ timestamps :true,versionKey:false}),
);

module.exports = Group;