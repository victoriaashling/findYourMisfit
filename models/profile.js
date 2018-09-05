module.exports = function(sequelize, DataTypes) {
    const Profile = sequelize.define("Profile", {
        // not sure what we're going to put in here yet.
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