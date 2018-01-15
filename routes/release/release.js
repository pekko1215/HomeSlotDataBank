var router = require('express').Router();
const crypto = require("crypto");


module.exports = function(models, Secret) {
    router.get('/:query', function(req, res, next) {
        try {
            var decipher = crypto.createDecipher('aes192', Secret);
            var query = decipher.update(req.params.query, 'hex', 'utf8') + decipher.final('utf8');
            var arr = query.split(',');
            if (arr.some(d => isNaN(d))) {
                throw d;
            }
            arr = arr.map(d => parseInt(d));
            models.PlayData.findAll({
                where: {
                    id: arr
                }
            }).then(datas => {
                res.render('user/dashbord/data', {
                    nickname: 'ゲスト',
                    username: '',
                    playdatas: datas
                });
            })
        } catch (e) {
            res.send('照会IDが不正です。')
            return;
        }
    });

    return router;
}