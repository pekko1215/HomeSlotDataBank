var router = require('express').Router();
var path = require('path');

module.exports = function(User) {
    router.get('/', function(req, res, next) {
        res.render('user/dashbord');
    });
    return router;
}