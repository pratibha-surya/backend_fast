import { Router } from "express";

import { changePassword, deleteAccount, getProfile, updateProfile } from "../controllers/user.controller.js";
import { changePasswordValidator, updateProfileValidator } from "../validators/user.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

const router = Router();

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validateMiddleware,
  updateProfile
);

router.route("/change-password")
  .patch(authMiddleware, changePasswordValidator, validateMiddleware, changePassword)
  .post(authMiddleware, changePasswordValidator, validateMiddleware, changePassword);

router.delete(
  "/account",
  authMiddleware,
  deleteAccount
);

export default router;