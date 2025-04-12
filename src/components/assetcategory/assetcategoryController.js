import AssetCategory from "../models/assetcategory.js";
import ErrorHandler from "../utils/errorHandler.js";
import helper from "../utils/helper.js";
import { Op } from 'sequelize';
const getAll = async (req, res, next) => {
 try {
        const { page, size, search, status } = req.query;

        let cond = { status: { [Op.ne]: '-1' } };

        if (search) {
            cond = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                   
                ],
                status: { [Op.ne]: '-1' }
            };
        }

        if (status && ['active', 'inactive'].includes(status)) {
            cond.status = status === 'active' ? '1' : '0';
        }

        const { limit, offset } = helper.getPagination(page, size);

        const data = await AssetCategory.findAndCountAll({
            where: cond,
            limit,
            offset
        });

        const response = helper.getPagingData(data, page, limit);
        res.render('assetcategory', {
            categories: data.rows,
            totalItems: data.totalItems,
            currentPage: data.currentPage,
            totalPages: data.totalPages, search
        });
    } catch (err) {
        console.error(err);
        return next(new ErrorHandler(err.message, 500));
    }
  };
  const getAddForm = (req, res) => {
    res.render("asset-category-add", { title: "Add Asset Category" });
  };
  const create = async (req, res, next) => {
    try {
    let assetCat= {
        name:req.body.name,
        status:req.body.status
    }
      await AssetCategory.create(assetCat).then(asset=>{
        res.redirect("/assetcategory");
      }).catch(err=>{
        return next (new ErrorHandler(err.message, 500));
      })
      
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  };

  export default {
    create,getAddForm,getAll
  }