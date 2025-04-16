'use strict';
import APP from "../config/index.js";
import AssetCategory from './assetcategory.js'
import Branch from "./branchModel.js";
import Employee from "./employeeModel.js";

const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const Asset = sequelize.define('assets', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Serial number must be unique' },
        validate: {
            notEmpty: { msg: 'Serial number is required' }
        }
    },
    make: {
        type: DataTypes.STRING,
        allowNull: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true
    },
    asset_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        
    },
    purchase_date:{
        type: DataTypes.STRING,
        allowNull: true
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    warranty_end_date:{
        type: DataTypes.STRING,
        allowNull: true
    },
    employee_id:{
        type: DataTypes.INTEGER,
  
    },
    branch_id:{
        type: DataTypes.INTEGER,
  
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});


Asset.belongsTo(AssetCategory, {
    foreignKey: 'asset_category_id',
    as: 'category'
});
Asset.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'employee'
});
Asset.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'branch'
});
export default Asset;
