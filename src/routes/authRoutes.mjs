import * as authController from "../controllers/authController.mjs";
import * as userValidations from  "../validations/userValidations.mjs";
import { protect } from "../middleware/authMiddleware.mjs";
import * as express from "express";

const authRouter = express.Router();

authRouter.post("/login", [userValidations.validateMailNotEmpty, userValidations.validatePass], authController.login);
authRouter.delete("/logout", authController.logout);
authRouter.get("/me", protect, authController.me);

export default authRouter;