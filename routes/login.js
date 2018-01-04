var router = require('express').Router();
var path = require ('path');
router.get('/',function(req,res,next){
	res.render('main/login/',{
		error:req.flash("error")
	});
});
module.exports = router