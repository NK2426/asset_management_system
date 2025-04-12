'use strict'
import APP from "../config/index.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();


const User = sequelize.define("users", {
          uid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Employee ID already exists" }
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Username already exists" }
          },
          name: {
            type: DataTypes.STRING
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: { msg: "Please enter an email" },
              isEmail: { msg: "Please enter an email id" }
            },
            unique: { msg: "Email already exists" }
          },
          
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: { msg: "Please enter valid password" }
            }
          },
          roleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
            validate: {
              notEmpty: { msg: "User Role Missing" }
            }
          },
          
          createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          modifiedBy: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          status: {
            type: DataTypes.INTEGER,
          },
        },
        {
          timestamps: true
        })

export default User
