
import APP from "../config/index.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const Branch = sequelize.define('branches', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Branch name already exists' },
    validate: {
      notEmpty: { msg: 'Branch name is required' }
    }
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1 ,
  }
}, {
  timestamps: true
});

export default Branch;
