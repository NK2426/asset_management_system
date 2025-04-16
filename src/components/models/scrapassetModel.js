'use strict'
import APP from "../config/index.js";
import Asset from "./assetModel.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();
const ScrapAssets = sequelize.define('scrap_assets', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reason: {
        type: DataTypes.TEXT,
      },
      scrapped_by: {
        type: DataTypes.STRING,
      },
      employee_id:{
        type: DataTypes.INTEGER,
      },
      scrappedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
  }, {
    timestamps: false
  });

  ScrapAssets.belongsTo(Asset, {
    foreignKey: 'asset_id',
    as: 'assets'
});

export default ScrapAssets