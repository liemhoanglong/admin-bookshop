const User = require('./model/admins.model');
//const { forwardAuthenticated } = require('../config/auth');

var LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({
        // mặc định local strategy sử dụng username và password,
        // chúng ta cần cấu hình lại
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
    },
    function (req, email, password, done) { // callback với email và password từ html form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        // tìm một user với email
        // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
        User.findOne({'email': email}, function (err, user) {
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // thông báo lỗi chỉ này chỉ dùng khi dev
            // all is well, return successful user
            return done(null, user);
        });
    }));     
};
