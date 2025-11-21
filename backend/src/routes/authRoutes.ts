import express from "express";
import { createSessionHandler } from "../controller/authController";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/authSchema";
import { createUserSessionHandler } from "../controller/session.controller";

const router = express.Router();

router.post(
  "/apis/login",
  validateResource(createSessionSchema),
  createSessionHandler,
);

export default router;
