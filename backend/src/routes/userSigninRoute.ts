import express from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controller/userController";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/userSchema";

const router = express.Router();

router.post(
  "/apis/users",
  validateResource(createUserSchema),
  createUserHandler,
);

router.post(
  "/apis/users/verify/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler,
);

router.post(
  "/apis/users/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler,
);

router.post(
  "/apis/users/resetpassword/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler,
);

router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;
