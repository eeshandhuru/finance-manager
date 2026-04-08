import * as recordController from "../controllers/recordController.mjs";
import * as recordValidations from "../validations/recordValidations.mjs";
import * as pageValidations from "../validations/pageValidations.mjs";
import { protect, authorize } from "../middleware/authMiddleware.mjs";
import * as express from "express";

const recordRouter = express.Router();

recordRouter.get("/:id", protect, authorize("analyst", "admin"), [recordValidations.validateID], recordController.fetchRecord);
recordRouter.get("/", protect, authorize("analyst", "admin"), [recordValidations.validateCategoryOptional, recordValidations.validateTypeOptional,
                        recordValidations.validateDateOptional("startDate"), recordValidations.validateDateOptional("endDate"),
                        pageValidations.validateLimit, pageValidations.validatePageNo],
                        recordController.viewRecords);
recordRouter.post("/", protect, authorize("admin"), [recordValidations.validateAmountCompulsory, recordValidations.validateCategoryCompulsory,
                        recordValidations.validateTypeCompulsory, recordValidations.validateDateCompulsory("date")],
                        recordController.createRecord);
recordRouter.put("/:id", protect, authorize("admin"), [recordValidations.validateAmountOptional, recordValidations.validateCategoryOptional,
                            recordValidations.validateTypeOptional, recordValidations.validateDateOptional("date"),
                            recordValidations.validateID], recordController.updateRecord);
recordRouter.delete("/:id", protect, authorize("admin"), [recordValidations.validateID], recordController.deleteRecord);

export default recordRouter;