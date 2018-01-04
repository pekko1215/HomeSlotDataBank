module.exports = function(User,PlayData,user,res){
	PlayData.findAll({where:{
		createdBy:user.username
	}}).then((datas)=>{
		var lastdata = datas.sort((data1,data2)=>{
			return new Date(data2.dataValues.updatedAt) - new Date(data1.dataValues.updatedAt)
		})[0];
		var sumplaygames = 0;
		datas.forEach(data=>{
			sumplaygames += data.dataValues.allplaycount;
		})
		res.render('user/dashbord',{
			nickname:user.nickname,
			username:user.username,
			playdatas:datas,
			lastdata:lastdata,
			sumplaygames:sumplaygames
		});
	})
	return user;
}