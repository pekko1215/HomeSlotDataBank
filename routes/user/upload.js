module.exports = {
    get: function(models, req, res) {
		var user = req.user;
        res.render('user/dashbord/upload', {
            nickname: user.nickname,
            username: user.username,
            message:''
        });
        return user;
    },
    post:function(models, req, res){
		var User = models.User;
		var PlayData = models.PlayData
		var user = req.user;
		var data = JSON.parse(req.body.data);
		PlayData.create({
			name:req.body.name,
			createdBy:user.username,
			allplaycount:data.GameCount.TotalGames,
			playcount:data.GameCount.NowGames,
			incoin:data.Coins.TotalCoinIn,
			outcoin:data.Coins.TotalCoinOut,
			count:data.BonusCounter.Counter.join(','),
			comment:'',
		}).then(()=>{
			res.send(true);
		}).catch(()=>{
			res.send(false);
		})
    }
}