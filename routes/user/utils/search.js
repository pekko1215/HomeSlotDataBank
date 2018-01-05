module.exports = {
    get: function(models, req, res) {
		var Slot = models.Slot;
		var query = req.query.q;

		Slot.findAll({
			where:{
				$or:[
					{
						name:{$like:`%${query}%`}
					},
					{
						maker:{$like:`%${query}%`}
					},
					{
						type:{$like:`%${query}%`}
					}
				]
			}
		}).then((result)=>{
			res.json(result.map(r=>r.dataValues));
		})
    }
}