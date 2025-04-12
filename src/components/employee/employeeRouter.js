import express from 'express';
import employeeController from './employeeController.js';
import authenticate from '../auth/authenticate.js';


const EmployeeRouter = async (app) => {
app.get('/employee', authenticate, employeeController.getAllEmployees)
app.get('/employee/add',authenticate, employeeController.renderAddPage);
app.post('/employee/add', authenticate, employeeController.createEmployee);
app.delete('/employee/delete/:id', employeeController.deleteEmployee);
app.get('/employee/edit/:id', employeeController.getEditEmployeeForm);
app.put('/employee/edit/:id', employeeController.updateEmployee);
app.get('/employee/view/:id', employeeController.viewEmployee);
}

export default EmployeeRouter;
