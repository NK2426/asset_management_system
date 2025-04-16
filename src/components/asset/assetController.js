import Asset from "../models/assetModel.js"
import AssetCategory from "../models/assetcategory.js";
import AssetHistory from "../models/assethistoryModel.js";
import Branch from "../models/branchModel.js";
import Employee from "../models/employeeModel.js";
import ScrapAssets from "../models/scrapassetModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import helper from "../utils/helper.js";
import { Op } from "sequelize";


const getAll = async (req, res, next) => {
  try {
    const { page, size, search, status, category_id } = req.query;

    let cond = {
      status: { [Op.ne]: '-1' }
    };


    if (search) {
      cond = {
        ...cond,
        [Op.or]: [
          { make: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { serial_number: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    if (status) {
      cond.status = status
    }
    if (category_id) {
      cond.asset_category_id = category_id;
    }

    const { limit, offset } = helper.getPagination(page, size);

    await Asset.findAndCountAll({
      where: cond,
      include: [{ model: AssetCategory, as: 'category' }, { model: Branch, as: 'branch' }],
      limit,
      offset
    }).then(async (data) => {
      const categories = await AssetCategory.findAll({
        where: { status: 1 }
      });

      res.render("asset", {
        assets: data.rows,
        totalItems: data.count,
        currentPage: page || 1,
        totalPages: Math.ceil(data.count / limit),
        categories,
        search,
        status,
        category_id
      });
    }).catch(err => {
      return next(new ErrorHandler(err.message, 400));
    })

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};


const getAddForm = async (req, res, next) => {
  try {
    const categories = await AssetCategory.findAll({
      where: { status: 1 }
    });
    const branches = await Branch.findAll();

    res.render('asset-add', {
      branches: branches,
      categories: categories
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};


const create = async (req, res, next) => {
  try {
    const asset = {
      serial_number: req.body.serial_number,
      make: req.body.make,
      model: req.body.model,
      asset_category_id: req.body.asset_category_id,
      status: req.body.status,
      price: req.body.price,
      warranty_end_date: req.body.warranty,
      purchase_date: req.body.purchase_date,
      description: req.body.description,
      branch_id: req.body.branch_id
    };

    await Asset.create(asset)
      .then(() => res.redirect("/asset"))
      .catch(err => next(new ErrorHandler(err.message, 500)));
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};
const getEditForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Asset.findOne({
      where: {
        id: id
      }
    }).then(async (asset) => {
      if (!asset) {
        return next(new ErrorHandler("Asset not found", 404));
      }

      const categories = await AssetCategory.findAll({ where: { status: 1 } });

      res.render("asset-edit", {
        asset,
        categories
      });
    }).catch(err => {
      return next(new ErrorHandler(err.message, 500));
    })


  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return next(new ErrorHandler("Asset not found", 404));
    }

    const assetData = {
      serial_number: req.body.serial_number.toUpperCase(),
      make: req.body.make,
      model: req.body.model,
      asset_category_id: req.body.asset_category_id,
      status: req.body.status,
      purchase_date: req.body.purchase_date,
      price: req.body.price,
      warranty_end_date: req.body.warranty,
      description: req.body.description,
      branch_id: req.body.branch_id
    };


    await asset.update(assetData).then(data => {
      res.redirect("/asset");
    }).catch(err => {
      return next(new ErrorHandler(err.message, 400));
    })


  } catch (err) {
    console.error(err);
    next(new ErrorHandler(err.message, 500));
  }
};
const stockView = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();
    const assetsByBranch = {};
    let totalValue = 0;

    for (let branch of branches) {
      const assets = await Asset.findAll({
        where: { branch_id: branch.id },
      });
      assetsByBranch[branch.id] = assets;

      const branchValue = assets.reduce((sum, asset) => sum + parseFloat(asset.price), 0);
      totalValue += branchValue;
    }

    res.render('stock-view', { branches, assetsByBranch, totalValue });

  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
}

const assetsByBranch = async (req,res,next)=>{
  try {
  
      const branchId = req.params.branchId;
  
 
      const branch = await Branch.findByPk(branchId);
  
      if (!branch) {
        return res.status(404).send("Branch not found");
      }

      const assets = await Asset.findAll({
        where: { branch_id: branchId, status: { [Op.ne]: '-1' } }, 
        include: [
          { model: Branch, as: 'branch' }
        ]
      });
  
   
      const totalValue = assets.reduce((acc, asset) => acc + (asset.price || 0), 0);
  
      res.render('assets-branch-details', {
        branchName: branch.name,
        assets,
        totalValue
      })  

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
}
const renderIssueAssetForm = async (req, res, next) => {
  try {
    
    const availableAssets = await Asset.findAll({
      where: { status: 'Active' }
    });
    const employees = await Employee.findAll();
    const branches = await Branch.findAll();

    res.render('issue-asset', {
      availableAssets,
      employees,
      branches
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};
const issueAsset = async (req, res, next) => {
  try {
    const { assetId, employeeId, issueDate, returnDate, status } = req.body;

    const asset = await Asset.findByPk(assetId);
    const employee = await Employee.findByPk(employeeId);

    if (!asset || !employee) {
      return res.status(404).send("Asset or Employee not found");
    }

    if (asset.status !== 'Available') {
      return res.status(400).send("Asset is not available for issue");
    }

    
    const assetHistory = await AssetHistory.create({
      asset_id: assetId,
      employee_id: employeeId,
      issue_date: issueDate,
      return_date: returnDate || null,
      status: status || 'Issued'  
    });

 
    await asset.update({ status: 'Issued' });

    res.status(200).send({
      message: 'Asset issued successfully',
      assetHistory,
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler(err.message, 500));
  }
};

const renderAssetIssuePage = async (req, res, next) => {
  try {
    const availableAssets = await Asset.findAll({ where: { status: 'Active' } ,attributes:['id','model'],logging:console.log});
    const employees = await Employee.findAll();
    const branches = await Branch.findAll();

    const assetHistories = await AssetHistory.findAll({
      where: {
        status: 'Issued'  
      },
      include: [
        { 
          model: Asset, 
          as: 'asset',
          include: [{ model: Branch, as: 'branch' }]  
        },
        { 
          model: Employee, 
          as: 'employee' 
        }
      ],
      order: [['issue_date', 'DESC']]
    });
    

    res.render('issue-asset', {
      makes: ['Dell', 'HP', 'Apple', 'Lenovo', 'Acer'],
      modelsByMake: {
        Dell: ['XPS 13', 'Latitude 7400'],
        HP: ['Spectre x360', 'Elite Dragonfly'],
        Apple: ['MacBook Pro', 'MacBook Air'],
        Lenovo: ['ThinkPad X1 Carbon', 'ThinkPad T490'],
        Acer: ['Aspire 5', 'Predator Helios']
      },
      assetsByModel: {
        'XPS 13': [{ id: 1, name: 'Dell XPS 13 - SN1234' }],
        'Latitude 7400': [{ id: 2, name: 'Latitude 7400 - SN5678' }],
   
      },
      employees,
      branches,
      assetHistories
    });
    
  } catch (err) {
    console.error(err);
    next(new ErrorHandler(err.message, 500));
  }
};
const renderAssetReturnPage = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    const branches = await Branch.findAll();

    const assetHistories = await AssetHistory.findAll({
      where: {
        status: 'Issued'  
      },
      include: [
        { 
          model: Asset, 
          as: 'asset',
          include: [{ model: Branch, as: 'branch' }]  
        },
        { 
          model: Employee, 
          as: 'employee' 
        }
      ],
      order: [['issue_date', 'DESC']]
    });
    

    res.render('return-asset', {
      makes: ['Dell', 'HP', 'Apple', 'Lenovo', 'Acer'],
      modelsByMake: {
        Dell: ['XPS 13', 'Latitude 7400'],
        HP: ['Spectre x360', 'Elite Dragonfly'],
        Apple: ['MacBook Pro', 'MacBook Air'],
        Lenovo: ['ThinkPad X1 Carbon', 'ThinkPad T490'],
        Acer: ['Aspire 5', 'Predator Helios']
      },
      assetsByModel: {
        'XPS 13': [{ id: 1, name: 'Dell XPS 13 - SN1234' }],
        'Latitude 7400': [{ id: 2, name: 'Latitude 7400 - SN5678' }],
     
      },
      employees,
      branches,
      assetHistories
    });
    
  } catch (err) {
    console.error(err);
    next(new ErrorHandler(err.message, 500));
  }
};
const getAllScrapasset = async (req, res, next) => {
  try {
    const { page, size, search } = req.query;
    const { limit, offset } = helper.getPagination(page, size);

    let cond = {};
    if (search) {
      cond = {
        [Op.or]: [
          { reason: { [Op.iLike]: `%${search}%` } },
          { scrapped_by: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const [scrappedData, activeAssets] = await Promise.all([
      ScrapAssets.findAndCountAll({
        where: cond,
        include: [{ model: Asset,as:'assets' }],
        limit,
        offset,
        order: [["scrappedAt", "DESC"]]
      }),
      Asset.findAll({
        where: { status: '1' }, 
        attributes: ['id', 'make', 'model'], 
        order: [["make", "ASC"], ["model", "ASC"]] 
      })
    ]);

    res.render("scrap-asset", {
      scrappedAssets: scrappedData.rows,
      totalItems: scrappedData.count,
      currentPage: page || 1,
      totalPages: Math.ceil(scrappedData.count / limit),
      activeAssets,
      search,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};
const scrap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, scrapped_by } = req.body;

    await ScrapAssets.create({
      asset_id: id,
      reason,
      scrapped_by,
    });

    res.redirect("/assets");
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Failed to scrap asset", 500));
  }
};
const getScrapForm = async (req, res, next) => {
  try {
    const activeAssets = await Asset.findAll({ where: { status: 'Active' } });
    res.render('scrap-asset-add', { activeAssets });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
const getAssetHistory = async (req, res, next) => {
  try {
    const assetId = req.params.id;

    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).send('Asset not found');

    const history = await AssetHistory.findAll({
      where: { asset_id: assetId },
    
    });

    const scrap = await ScrapAssets.findOne({ where: { asset_id: assetId } });

    res.render('asset-history', {
      asset,
      history,
      scrap
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export default {
  getAll,
  renderIssueAssetForm,
  getAddForm,
  create,
  getEditForm,
  update,
  stockView,
  assetsByBranch,
  issueAsset,
  renderAssetIssuePage,
  renderAssetReturnPage,
  scrap,
  getAllScrapasset,
  getScrapForm,
  getAssetHistory
};
