module.exports = function(sequelize, DataTypes) {
    const Question = sequelize.define("Question", {
        question: DataTypes.STRING
    });

    Question.associate = function(models) {
        models.Question.hasMany(models.UserAnswer);
    };

    return Question;
};