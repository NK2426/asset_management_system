'use strict';
import APP from "../config/index.js";

const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const Employee = sequelize.define("employees", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter the name" },
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Email already exists" },
    validate: {
      notEmpty: { msg: "Please enter an email" },
      isEmail: { msg: "Please enter a valid email address" },
    },
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter a phone number" },
    },
  },

  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter department" },
    },
  },

  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter designation" },
    },
  },

  doj: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  doe: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isDecimal: true,
    },
  },

  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING ,
   allowNull:false
  },
},
{
  timestamps: true,
});

export default Employee;
