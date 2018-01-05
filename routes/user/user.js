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

module.exports = function(models) {
    router.get('/',isAuthenticated, function(req, res, next) {
        require('./dashbord')(models,req.user,res);
    });

    router.get('/upload',isAuthenticated,function(req,res,next){
        require('./upload').get(models,req,res);
    })

    router.post('/upload',isAuthenticated,function(req,res,next){
        require('./upload').post(models,req,res);
    })

    router.get('/utils/search',isAuthenticated,function(req,res,next){
		require('./utils/search').get(models,req,res)
    })

    return router;
}