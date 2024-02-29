const User = require("../models/user.model");
const Group = require("../models/group.model");
const UserGroup = require("../models/user_group.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const socketIo = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const Message = require("../models/message.model");

/**
 * This function is used to get list of group.
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  if(req.session.user_type == "user"){
    const messages = await req.flash("info");
    var groups     = [];
    try {
      const user_groups = await UserGroup.find({user_id:req.session.userId}).sort({createdAt:-1});
      if (user_groups.length > 0) {
        const group_ids_list = await user_groups.map(function (elem) {
          return elem.group_id
        }).join(",");
        var group_ids = await group_ids_list.split(",");
        let query = {};

        if (req.query.search) {
          query = { name: { $regex: req.query.search, $options: 'i' } , _id: { $in: group_ids }}; // Case-insensitive search
        }
        else{
          query = { _id: { $in: group_ids } };
        }
        groups = await Group.find(query).sort({ createdAt: -1 });        
      }
      res.render("group/index", {
        groups,
        messages,
        user_type:req.session.user_type,
        searchUrl:"group"
      });
    } catch (error) {
      console.log(error);
    }
  }
  else{
    res.redirect("/user");
  }
};
/**
 * This function is used to load add user page.
 * @param {*} req 
 * @param {*} res 
 */
exports.addGroup = async (req, res) => {
  if(req.session.user_type=="user"){
    const messages = await req.flash("error");
    const users = await User.find({ _id: { $nin: [req.session.userId] },"user_type":"user" }).sort({ createdAt: -1 }); 
    return res.render("group/add",{ messages , user_type:req.session.user_type, users});
  }
  else{
    return res.redirect("/user");
  }
};

/**
 * This function is used to save group.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.saveGroup = async (req, res) => {
  try {
    var members = req.body.members;
   
    var user_id = req.body.user_id;
    if(req.session && req.session.userId){
      user_id   = req.session.userId;
    }
    var user_groups_create = [{user_id:user_id}];
    if(members.length>0){
      for (const member of members) {
        if(member!=user_id){
          user_groups_create.push({user_id:member});
        }
      }
    }
    
    const group = await Group.create({ name:req.body.name, created_by:user_id });
    const mappedArray = await user_groups_create.map((obj, index) => ({
      group_id:group._id,
      ...obj
    }));
    await UserGroup.insertMany(mappedArray);
    await req.flash("info", "Group has been added successfully.");
    res.redirect("/group");
  } catch (error) {
    console.log(error);
  }
};


/**
 * This function is used to update group
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateGroup = async (req, res) => {
  try {
    try {
      await Group.findByIdAndUpdate(req.params.id,{name:req.body.name});
      await req.flash("info", "Group has been updated successfully.");
      res.redirect("/group");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to delete group
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteGroup = async (req, res) => {
  try {
    try {
      await Group.deleteOne({_id:req.params.id});
      await UserGroup.deleteMany({group_id:req.params.id});
      await req.flash("info", "Group has been deleted successfully.");
      res.redirect("/group");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to get list of members in group.
 * @param {*} req 
 * @param {*} res 
 */
exports.viewMembers = async (req, res) => {
  if(req.session.user_type == "user"){
    const messages = await req.flash("info");
    var members     = [];
    try {
      const user_groups = await UserGroup.find({ group_id: req.params.id }).sort({ createdAt: -1 });
      if (user_groups.length > 0) {
        const user_ids_list = await user_groups.map(function (elem) {
          return elem.user_id
        }).join(",");
        var user_ids = await user_ids_list.split(",")
        members = await User.find({ _id: { $in: user_ids } }).sort({ createdAt: -1 });        
      }
      const users = await User.find({ _id: { $nin: user_ids },"user_type":"user" }).sort({ createdAt: -1 }); 
      res.render("group/view_members", {
        members,
        messages,
        users,
        user_type:req.session.user_type,
        user_id:req.session.userId,
        group_id:req.params.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  else{
    res.redirect("/group");
  }
};
/**
 * This function is used to delete member from group
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteMember = async (req, res) => {
  try {
    try {
      await UserGroup.deleteOne({user_id:req.params.id,group_id:req.params.group_id});
      await req.flash("info", "Member has been removed from this group.");
      res.redirect("/group/view_members/"+req.params.group_id);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to add members in group.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addMembers = async (req, res) => {
  try {
    var members = req.body.members;
    var user_groups_create = [];
    for (const member of members) {
      user_groups_create.push({user_id:member,group_id:req.params.group_id});
    }
    await UserGroup.insertMany(user_groups_create);
    await req.flash("info", "Group Members has been added successfully.");
    res.redirect("/group/view_members/"+req.params.group_id);
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to get Messages based on Group Id.
 * @param {*} req 
 * @param {*} res 
 */
exports.getMessagesBasedOnGroup = async (req,res) =>{
  const group  = await Group.findOne({_id:req.params.group_id});
  const messages    = await Message.aggregate([
    {
      $match : {
        group_id:new mongoose.Types.ObjectId(req.params.group_id)
      }
    },
    {
      $lookup: {
        from: 'users', // Secondary collection name
        localField: 'user_id', // Field from the primary collection
        foreignField: '_id', // Field from the secondary collection
        as: 'user_details', // Output field name containing the joined documents
      },
    },
    {
      $project: {
        _id: 1, // Exclude the _id field if needed
        content: 1, // Include the fields you want from the primary collection
        user_details: 1, // Include the joined documents from the secondary collection
        likes:1,
        updatedAt:1
      },
    },
    {
      $sort: {
        createdAt: -1, // Include the fields you want from the primary collection
      },
    }
  ]);
  res.render('group/load_chat', { group, messages, "user_type":req.session.user_type, "group_id":req.params.group_id,"user_id":req.session.userId });
}
/**
 * This function is used to get send Messages based on Group Id.
 * @param {*} req 
 * @param {*} res 
 */
exports.sendMessagesBasedOnGroup = async (req,res) =>{
  const message = new Message({ user_id:req.session.userId,group_id:req.params.group_id, content:req.body.content });
  await message.save();
  // Emit the new message to all connected clients
  io.emit('message', message);

  res.redirect('/group/get_messages/'+req.params.group_id);
}
// Socket.io configuration
io.on('connection', (socket) => {
  // Listen for new messages from clients
  socket.on('message', (data) => {
    const { user_id,group_id, content } = data;
    const message = new Message({ user_id,group_id, content });
    message.save();

    // Broadcast the new message to all connected clients
    io.emit('message', message);
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
/**
 * This function is used to like message
 * @param {*} req 
 * @param {*} res 
 */
exports.LikeMessage = async (req, res) => {
  try {
    await Message.findByIdAndUpdate({_id:req.params.message_id}, { $addToSet: { likes: req.session.userId } });
    res.status(200).send({status:"success"});
  } catch (error) {
    res.status(500).send({status:"error"});
  }
};
/**
 * This function is used to dislike message
 * @param {*} req 
 * @param {*} res 
 */
exports.DislikeMessage = async (req, res) => {
  try {
    await Message.findByIdAndUpdate({_id:req.params.message_id}, { $pull: { likes: req.session.userId } });
    res.status(200).send({status:"success"});
  } catch (error) {
    res.status(500).send({status:"error"});
  }
};