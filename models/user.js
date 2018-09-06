module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("User", {
        handle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = function(models) {
        models.User.hasMany(models.Profile);
    };

    User.associate = function(models) {
        models.User.hasMany(models.UserAnswer);
    };

    return User;
};