module.exports = function(sequelize, DataTypes) {
    const UserAnswer = sequelize.define("UserAnswer", {
        answer: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    UserAnswer.asociate = function(models) {
        models.UserAnswer.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
    };

    UserAnswer.asociate = function(models) {
        models.UserAnswer.belongsTo(models.Question, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
    };

    return UserAnswer;
};