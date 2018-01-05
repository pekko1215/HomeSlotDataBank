module.exports = function(sequelize, DataTypes) {
    var Slot = sequelize.define('slots', {
        createdBy:DataTypes.STRING,
        name:DataTypes.STRING,
        maker:DataTypes.STRING,
        type:DataTypes.STRING,
        unittype:DataTypes.REAL
    })
    return Slot
}