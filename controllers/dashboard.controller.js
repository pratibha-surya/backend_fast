import * as dashboardService from "../services/dashboard.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboard = asyncHandler(async (req, res) => {

  const dashboard =
    await dashboardService.getDashboard();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Dashboard fetched successfully",
      dashboard
    )
  );

});