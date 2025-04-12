import { Op } from 'sequelize';
import ErrorHandler from "../utils/errorHandler.js";
import Employee from '../models/employeeModel.js';
import helper from '../utils/helper.js'



const getAllEmployees = async (req, res, next) => {
    try {
        const { page, size, search, status } = req.query;

        let cond = { status: { [Op.ne]: '-1' } };

        if (search) {
            cond = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ],
                status: { [Op.ne]: '-1' }
            };
        }

        if (status && ['active', 'inactive'].includes(status)) {
            cond.status = status === 'active' ? '1' : '0';
        }

        const { limit, offset } = helper.getPagination(page, size);

        const data = await Employee.findAndCountAll({
            where: cond,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const response = helper.getPagingData(data, page, limit);
        res.render('employee', {
            employees: data.rows,
            totalItems: data.totalItems,
            currentPage: data.currentPage,
            totalPages: data.totalPages, search
        });
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500));
    }
};

const renderAddPage = async (req, res, next) => {
    try {
        res.render('employee-add', { title: 'Add Employee' });
    } catch (err) {
        console.error(err);
        next(new ErrorHandler(err, 500));
    }
};

const createEmployee = async (req, res, next) => {
    try {
        let employee =
        {
            name: req.body.name,
            email: req.body.email,
            status: req.body.status,
            designation: req.body.designation,
            salary: req.body.salary,
            department: req.body.department,
            doj: req.body.doj,
            doe: req.body.name || "",
            address: req.body.address,
            phone: req.body.phone
        }
        await Employee.create(employee).then(emp => {
            res.redirect('/employee');
        }).catch(err => {
            console.log(err);
            return next(new ErrorHandler(err, 500));
        })

    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err, 500));
    }
};
const deleteEmployee = async (req, res) => {
    try {
      await Employee.findOne({ where: { id:req.params.id } }).then(async(emp) =>{
        if (emp) {
            await emp.update({status:-1}).then(empdeleted=>{
                res.redirect('/employee');
            }).catch(err=>{
                return next(new ErrorHandler(err, 500));
            })

          } else {
            return res.status(404).json({ message: 'Employee not found' });
          }
      }).catch(err=>{
        return next(new ErrorHandler(err, 500));
      })
    } catch (err) {
        return next(new ErrorHandler(err, 500));

    }
  };
  const getEditEmployeeForm = async (req, res) => {
    try {
      const employee = await Employee.findOne({where:{id:req.params.id}});
      if (!employee) return res.status(404).send('Employee not found');
      res.render('employee_edit', { employee });
    } catch (err) {
        return next(new ErrorHandler(err, 500));
    }
  };
  const updateEmployee = async (req, res) => {
    const id = req.params.id;
    const { name, email, status } = req.body;
  
    try {
      const employee = await Employee.findOne({
        where:{
            id:id
        }
      });
      if (!employee) return res.status(404).send('Employee not found');
  
      await employee.update({ name, email, status }).then(emp=>{
        res.redirect('/employee');
      }).catch(err=>{
        return next(new ErrorHandler(err, 500));
      })
    } catch (error) {
        return next(new ErrorHandler(err, 500));
    }
  };
  const viewEmployee = async (req, res) => {
    const id = req.params.id;
    try {
      const employee = await Employee.findOne({
        where:{
            id:id
        }
      });
      if (!employee) {
        return res.status(404).send('Employee not found');
      }
      
      res.render('partials/employee_modal', { employee });
    } catch (err) {
        return next(new ErrorHandler(err, 500));
    }
  };
  
export default {
    getAllEmployees,
    renderAddPage,
    createEmployee,
    deleteEmployee,
    updateEmployee,
    getEditEmployeeForm,
    viewEmployee
};