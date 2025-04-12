'use strict'
import APP from "../config/index.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const AssetCategory = sequelize.define('assetcategories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Category name already exists' },
    validate: {
      notEmpty: { msg: 'Category name is required' }
    }
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1 ,
  }
}, {
  timestamps: true
});

export default AssetCategory;
