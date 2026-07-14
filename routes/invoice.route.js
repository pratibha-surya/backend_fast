import { Router } from "express";

import * as invoiceController from "../controllers/invoice.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/:orderId",
  authMiddleware,
  invoiceController.downloadInvoice
);

export default router;