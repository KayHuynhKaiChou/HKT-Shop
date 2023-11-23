import express from 'express';
import dashboardController from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/reports', dashboardController.getReports);
dashboardRouter.get('/statistic', dashboardController.getStatistic);

export default dashboardRouter