import express from 'express';
import assetcaegoryController from './assetcategoryController.js';
import authenticate from '../auth/authenticate.js';


const categoryRouter = async (app) => {
app.get('/assetcategory', authenticate, assetcaegoryController.getAll)
app.get('/asset-category/add',authenticate, assetcaegoryController.getAddForm);
app.post('/asset-category/add', authenticate, assetcaegoryController.create);
}

export default categoryRouter;
