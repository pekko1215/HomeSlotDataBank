var router = require('express').Router();
var path = require('path');

function isAuthenticated(req, res, next){
    if (req.isAuthenticated()) {  // 認証済
        return next();
    }
    else {  // 認証されていない
        res.redirect('/login');  // ログイン画面に遷移
    }
}

module.exports = function(User) {
    router.get('/',isAuthenticated, function(req, res, next) {
		console.log(req.user);
        res.render('user/dashbord');
    });
    return router;
}