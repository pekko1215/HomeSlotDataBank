module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('playdatas', {
        createdBy:DataTypes.STRING,
        allplaycount:DataTypes.INTEGER,
        playcount:DataTypes.INTEGER,
        incoin:DataTypes.INTEGER,
        outcoin:DataTypes.INTEGER,
        count:DataTypes.STRING,
        name:DataTypes.STRING,
        comment:DataTypes.STRING
    })
    return User
}