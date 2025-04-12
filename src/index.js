'use strict'
import categoryRouter from './components/assetcategory/assetcategoryRouter.js';
import authRoute from './components/auth/authRouter.js';
import EmployeeRouter from './components/employee/employeeRouter.js';

export default (app)=>{
    authRoute(app)
    EmployeeRouter(app)
    categoryRouter(app)
  
 
}