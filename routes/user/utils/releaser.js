const crypto = require("crypto");

module.exports = {
    get: function(models, req, res) {
		var PlayData = models.PlayData;
		var query = req.query.list;

		PlayData.findAll({
			where:{
				id:query.split(','),
				createdBy:req.user.username
			}
		}).then((result)=>{
			if(!result){
				res.json({error:true})
			}
			var rowdata = result.map(r=>r.id).join(',');
			var cipher = crypto.createCipher('aes192', getEnv('SESSION_SECRET'));
			var cryptedquery = cipher.update(rowdata, 'utf8', 'hex') + cipher.final('hex');
			res.json({
				error:false,
				url:`https://homeslotdatabank.herokuapp.com/release/${cryptedquery}`
			});
		})
    }
}


function getEnv(key) {
    return process.env[key] || require('./../../../config.js')[key]
}