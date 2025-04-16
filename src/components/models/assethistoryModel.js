import APP from "../config/index.js";
import Asset from "./assetModel.js";
import Branch from "./branchModel.js";
import Employee from "./employeeModel.js";

const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const AssetHistory = sequelize.define('asset_histories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Issued', 
   
  },
 
}, {
 
  timestamps: true,  
})
AssetHistory.belongsTo(Asset, {
  foreignKey: 'asset_id',
  as: 'asset'
});
AssetHistory.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'employee'
});
AssetHistory.belongsTo(Branch, {
  foreignKey: 'branch_id',
  as: 'branch'
});

export default AssetHistory;
