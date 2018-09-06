module.exports = function(sequelize, DataTypes) {
    const Profile = sequelize.define("Profile", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        chatMatch: {
            type: DataTypes.STRING,
        },
        namespace: {
            type: DataTypes.STRING
        }
    });

    Profile.asociate = function(models) {
        models.Profile.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
    };

    return Profile;
};