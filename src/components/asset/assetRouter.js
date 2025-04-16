import assetController from './assetController.js';
import authenticate from '../auth/authenticate.js';

const assetRouter = async (app) => {
  app.get('/asset', authenticate, assetController.getAll);
  app.get('/asset/add', authenticate, assetController.getAddForm);
  app.get('/stock-view', authenticate, assetController.stockView);
  app.post('/asset/add', authenticate, assetController.create);
  app.get('/asset/edit/:id', authenticate, assetController.getEditForm);
  app.post('/asset/edit/:id', authenticate, assetController.update);

  app.get('/assets/branch/:branchId', authenticate, assetController.assetsByBranch);

  app.get('/asset/issue', authenticate, assetController.renderIssueAssetForm);
  app.post('/asset/issue', authenticate, assetController.issueAsset);
  app.get('/issue-asset', authenticate, assetController.renderAssetIssuePage);
  app.get('/return-asset', authenticate, assetController.renderAssetReturnPage);

  app.get('/scrap-asset', authenticate, assetController.getAllScrapasset);
  app.post('/assets/scrap/:id"', authenticate, assetController.scrap);
  app.get('/assets/scrap/new', assetController.getScrapForm); 

  app.get('/asset-history/:id', assetController.getAssetHistory);

};

export default assetRouter;
