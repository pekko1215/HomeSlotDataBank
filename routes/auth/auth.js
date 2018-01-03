const LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');

module.exports = Auth = function(User) {}
Auth.prototype.signin = function(User) {
    return new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //reqを返えさせる
    }, function(req, username, password, next) {
        process.nextTick(() => {
            User.findOne({
                where: { username: username }
            }).then((user) => {
                if (user && User.hashPassword(password) != user.password) {
                    req.flash("error", "ユーザ名、パスワードが異なります。")
                    return next(null);
                } else {
                    return next(null, username);
                }
            })
        });
    })
}
Auth.prototype.signup = function(User) {
    return function(req, res) {
        console.log(User)
        var username = req.body.username;
        var password = req.body.password;
        if (!username || !password) {
            //ユーザ名、またはパスワードが空欄
            req.flash('error', "正しく入力してください(。-`ω-)")
            res.render('main/login/', {
                error: req.flash("error")
            });
            return;
        }
        return User.findOrCreate({
                where: {
                    username: username,
                },
                defaults: {
                    password: User.hashPassword(password)
                }
            })
            .then((user, created) => {
                if (created) {
                    req.flash('error', "そのユーザ名は既に登録されています。");
                    res.render('main/login/', {
                        error: req.flash("error")
                    });
                    return
                }
                user = user.values;
                delete user.password;
                res.send(user);
            })
            .catch(Sequelize.ValidationError,function(e) {
                res.statusCode = 500;
                req.flash('error', "データベースエラー_(:3 」∠)_")
                res.send(arguments);
                console.log(e)
            })
    }
}