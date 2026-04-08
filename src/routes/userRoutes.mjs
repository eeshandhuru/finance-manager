import * as userController from "../controllers/userController.mjs";
import * as userValidations from "../validations/userValidations.mjs";
import * as pageValidations from "../validations/pageValidations.mjs";
import { protect, authorize } from "../middleware/authMiddleware.mjs";
import * as express from "express";

const userRouter = express.Router()

userRouter.get("/:email_id", protect, authorize("admin"), [userValidations.validateMail], userController.getUser);
userRouter.get("/", protect, authorize("admin"), [userValidations.validateRoleOptional, pageValidations.validateLimit, 
                        pageValidations.validatePageNo], userController.getUserList);
userRouter.post("/", protect, authorize("admin"), [userValidations.validateMailNotEmpty, userValidations.validateName, 
                        userValidations.validatePass, userValidations.validateRoleOptional], userController.createUser);
userRouter.post("/viewer", [userValidations.validateMailNotEmpty, userValidations.validateName, 
                        userValidations.validatePass], userController.createViewer);
userRouter.put("/nameChange", protect, [userValidations.validateName], userController.changeName);
userRouter.put("/roleChange", protect, authorize("admin"), [userValidations.validateMailNotEmpty, userValidations.validateRoleNotEmpty], userController.changeRole);
userRouter.put("/passwordChange", protect, [userValidations.validateMailNotEmpty, userValidations.validatePass], userController.changePassword);
userRouter.delete("/", protect, authorize("viewer", "analyst"), userController.deleteUser);

export default userRouter;