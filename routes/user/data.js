module.exports = {
    get: function(models, req, res) {
        var user = req.user;
        const {PlayData} = models;
        PlayData.findAll({
            where: {
                createdBy: user.username
            }
        }).then((datas) => {
            var lastdata = datas.sort((data1, data2) => {
                return new Date(data2.dataValues.updatedAt) - new Date(data1.dataValues.updatedAt)
            })[0];
            var sumplaygames = 0;
            datas.forEach(data => {
                sumplaygames += data.dataValues.allplaycount;
            })
            res.render('user/dashbord/data', {
                nickname: user.nickname,
                username: user.username,
                playdatas: datas,
                lastdata: lastdata,
                sumplaygames: sumplaygames
            });
        })
        return user;
    }
}