import * as invoiceService from "../services/invoice.service.js";

import asyncHandler from "../middleware/asyncHandler.js";

export const downloadInvoice =
  asyncHandler(async (req, res) => {

    await invoiceService.generateInvoice(
      req.user._id,
      req.params.orderId,
      req.user.role,
      res
    );

  });