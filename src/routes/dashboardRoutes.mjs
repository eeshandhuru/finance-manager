import * as dashboardController from "../controllers/dashboardController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import * as express from "express";

const dashboardRouter = express.Router();

dashboardRouter.get("/total/income", protect, dashboardController.totalIncome);
dashboardRouter.get("/total/expense", protect, dashboardController.totalExpense);
dashboardRouter.get("/total", protect, dashboardController.netBalance);
dashboardRouter.get("/categories", protect, dashboardController.categoryWise);

export default dashboardRouter;