const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");


/**
 * This function is used to load login page.
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
    const messages = await req.flash("error");
    res.render("login",{ messages });
};
/**
 * This function is used to login.
 * @param {*} req 
 * @param {*} res 
 */
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = await user._id;
            req.session.email = await user.email;
            req.session.user_type = await user.user_type;
            res.redirect('/user');
        } else {
            await req.flash("error", "Invalid Credentials.");
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        await req.flash("error", error.message);
        res.redirect('/');
    }
};
/**
 * This function is used to logout.
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');
    });
};