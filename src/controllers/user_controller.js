const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

/**
 * This function is used to get list of all users.
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const messages = await req.flash("info");
  let perPage = 2;
  let page = req.query.page || 1;

  try {
    var query = {};
    if (req.query.search) {
      query = {
        $or: [
          { first_name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive
          { last_name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .exec();
    const count = await User.countDocuments({});

    res.render("user/index", {
      users,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
      user_type:req.session.user_type,
      searchUrl:"user"
    });
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to load add user page.
 * @param {*} req 
 * @param {*} res 
 */
exports.addUser = async (req, res) => {
  if(req.session.user_type=="admin"){
    const messages = await req.flash("error");
    return res.render("user/add",{ messages , user_type:req.session.user_type});
  }
  else{
    return res.redirect("/user");
  }
};

/**
 * This function is used to save user.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.saveCustomer = async (req, res) => {
  let { password, first_name, last_name, email, user_type, confirm_password } = req.body;
  if(password!=confirm_password){
    await req.flash("error", "Password and Confirm Password should be same.");
    res.redirect("/user/add");
  }
  else{
    password = bcrypt.hashSync(req.body.password, 8);
    const user_data = await User.find({email}).exec();
    if (user_data.length != 0) {
      await req.flash("error", "User already exist with same email.");
      res.redirect("/user/add");
    }
    else{
      try {
        const maxUserIdDocument = await User.find({}).sort({ user_id: -1 }).limit(1);
        var user_id = 1;
        if (maxUserIdDocument.length > 0) {
          const maxUserId = maxUserIdDocument[0].user_id;
          user_id = maxUserId+1;
        }
        await User.create({ first_name, last_name, email, user_type, password, user_id });
        await req.flash("info", "User has been added successfully.");
        res.redirect("/user");
      } catch (error) {
        console.log(error);
      }
    }
    
  }
  
};

/**
 * This function is used to load edit user page.
 * @param {*} req 
 * @param {*} res 
 */
exports.edit = async (req, res) => {
  try {
    if(req.session.user_type=="admin"){
      const messages = await req.flash("error");
      const user = await User.findOne({ _id: req.params.id });
      res.render("user/edit", { user,messages, user_type:req.session.user_type });
    }
    else{
      return res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
    res.render("user/edit", { user:{},messages:[], user_type:req.session.user_type });
  }
};

/**
 * This function is used to update user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateUser = async (req, res) => {
  try {
    try {
      var update_obj = { first_name : req.body.first_name, last_name : req.body.last_name, user_type : req.body.user_type};
      if(req.body.password && req.body.confirm_password){
        var password          = req.body.password;
        var confirm_password  = req.body.confirm_password;
        if(password!=confirm_password){
          await req.flash("error", "Password and Confirm Password should be same.");
          return res.redirect(`/user/edit/${req.params.id}`);
        }
        password = bcrypt.hashSync(req.body.password, 8);
        update_obj.password = password;
      }
      await User.findByIdAndUpdate(req.params.id,update_obj);
      await req.flash("info", "User has been updated successfully.");
      res.redirect("/user");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * This function is used to get user based on email.
 * @param {*} req 
 * @param {*} res 
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user){
      return res.send({status:"success",id:user._id})
    }
    else{
      return res.send({status:"error",id:''})
    }
  } catch (error) {
    return res.send({status:"error",id:''})
  }
};
/**
 * This function is used to get last inserted user.
 * @param {*} req 
 * @param {*} res 
 */
exports.LastInsertedUser = async (req, res) => {
  try {
    const user = await User.findOne({user_type:"user"}).sort({createdAt:-1});
    if(user){
      return res.send({status:"success",id:user._id})
    }
    else{
      return res.send({status:"error",id:''})
    }
  } catch (error) {
    return res.send({status:"error",id:''})
  }
};