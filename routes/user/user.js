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

module.exports = function(User,PlayData) {
    router.get('/',isAuthenticated, function(req, res, next) {
        require('./dashbord')(User,PlayData,req.user,res);
    });

    router.get('/upload',isAuthenticated,function(req,res,next){
        require('./upload').get(User,PlayData,req,res);
    })

    router.post('/upload',isAuthenticated,function(req,res,next){
        require('./upload').post(User,PlayData,req,res);
    })

    return router;
}