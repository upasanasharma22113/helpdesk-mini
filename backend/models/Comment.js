const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Ticket = require("./Ticket");

const Comment = sequelize.define("Comment", {
  content: { type: DataTypes.TEXT, allowNull: false },
  createdBy: { type: DataTypes.STRING, allowNull: false }
});

Ticket.hasMany(Comment, { as: "comments" });
Comment.belongsTo(Ticket);

module.exports = Comment;
