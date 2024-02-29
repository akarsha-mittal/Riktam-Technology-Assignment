const mongoose = require("mongoose");

const { Schema } = mongoose;
const MessageSchema = mongoose.model(
  "messages",
  new Schema({
    user_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true 
    },
    group_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true 
    },
    content: {type : String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },{ timestamps :true,versionKey:false}),
);

module.exports = MessageSchema;
  