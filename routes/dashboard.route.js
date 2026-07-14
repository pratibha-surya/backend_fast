import { Router } from "express";

import * as dashboardController from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  dashboardController.getDashboard
);

export default router;