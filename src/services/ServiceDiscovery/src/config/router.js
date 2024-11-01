const mainRouter = require("express").Router();
const {
  ApiSuccess,
  ApiError,
} = require("../../../../shared/utils/ApiResponse");
const sd = require("../ServiceDiscovery");

const {
  HTTP_401_UNAUTHORIZED,
  HTTP_400_BAD_REQUEST,
} = require("../../../../shared/utils/statusCodes");

mainRouter.get("/getinstance", async (req, res) => {
  const path = req.query.servicePath;

  if (!path) {
    return ApiError(res, "Service path is required", HTTP_400_BAD_REQUEST);
  }

  /*
  TODO: Send the request to auth service to check 
  if the user has access to the service. 
  */

  let hasAccess = false;
  for (const [path, name] of Object.entries(sd.services)) {
    if (servicePath == path) {
      hasAccess = true;
      break;
    }
  }

  if (hasAccess) {
    const instance = await sd.getInstance(path);
    return ApiSuccess(res, instance);
  } else {
    return ApiError(
      res,
      "You do not have access to this service",
      HTTP_401_UNAUTHORIZED
    );
  }
});
