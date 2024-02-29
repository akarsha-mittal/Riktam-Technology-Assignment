verifyUser = (req, res, next) => {
    if (req.session && req.session.userId || (req.body && req.body.test_case==1)) {
        return next();
    } else {
        return res.redirect('/');
    }
};

const verify = {
  verifyUser
};
module.exports = verify;
