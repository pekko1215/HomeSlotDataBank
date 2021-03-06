const LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');
var router = require('express').Router();

module.exports = Auth = function(models) {}
Auth.prototype.signin = function(models) {
    var {User} = models;
    return new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //reqを返えさせる
    }, function(req, username, password, next) {
        process.nextTick(() => {
            User.findOne({
                where: { username: username }
            }).then((user) => {
                if (!user || User.hashPassword(password) != user.password) {
                    req.flash("error", "ユーザ名、パスワードが異なります。")
                    return next(null);
                } else {
                    return next(null, {
                        username: username,
                        nickname:user.nickname
                    });
                }
            })
        });
    })
}
Auth.prototype.signup = function(models) {
    var {User} = models;
    router.post('/',function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (!username || !password) {
            //ユーザ名、またはパスワードが空欄
            req.flash('error', "正しく入力してください(。-`ω-)")
            res.render('main/signup/', {
                error: req.flash("error")
            });
            return;
        }
        return User.findCreateFind({
                where: {
                    username: username,
                },
                defaults: {
                    password: User.hashPassword(password),
                    nickname: username
                }
            })
            .spread((user, created) => {
                if (!created) {
                    req.flash('error', "そのユーザ名は既に登録されています。");
                    res.render('main/signup/', {
                        error: req.flash("error")
                    });
                    return
                }
                user = user.values;
                res.redirect(307,'/login');
            })
            .catch(Sequelize.ValidationError, function(e) {
                switch(e.name){
                    case 'SequelizeValidationError':
                        req.flash('error',"ユーザ名が正しくありません");
                        res.statusCode = 500;
                        res.render('main/signup',{error:req.flash('error')});
                        return
                    break
                }
                req.flash('error', "データベースエラー_(:3 」∠)_")
                res.statusCode = 500;
                res.send(arguments);
            })
    });
    router.get('/',function(req,res,next){
        res.render('main/signup',{error:''})
    })
    return router
}