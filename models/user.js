module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: { isAlphanumeric: true }
        },
        password: 'char(40)' //SHA-1ハッシュで保管
    })
    User.hashPassword = function(pass) {
        var sha1 = require('crypto').createHash('sha1');
        sha1.update(pass, 'utf8');
        return sha1.digest('hex');
    }
    return User
}