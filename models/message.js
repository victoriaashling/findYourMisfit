module.exports = function(sequelize, DataTypes) {
    const Message = sequelize.define("Message", {
        namespace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        toUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Message;
};