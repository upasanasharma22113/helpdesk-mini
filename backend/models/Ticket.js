const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Ticket = sequelize.define("Ticket", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  priority: { type: DataTypes.ENUM("Low","Medium","High"), defaultValue: "Low" },
  status: { type: DataTypes.ENUM("Open","In Progress","Closed","Breached"), defaultValue: "Open" },
  assignedTo: { type: DataTypes.STRING },
  createdBy: { type: DataTypes.STRING, allowNull: false },
  slaDeadline: { type: DataTypes.DATE },
  version: { type: DataTypes.INTEGER, defaultValue: 1 }
});

module.exports = Ticket;
