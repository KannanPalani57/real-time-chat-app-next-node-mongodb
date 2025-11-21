import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { get } from "lodash";
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  // const refreshToken = (req.headers.[x-refresh] || "").replace(
  //   /^Bearer\s/,
  //   "",
  // );
  console.log("accessToken", accessToken);
  if (!accessToken) {
    return res.status(401).send("Access denied, no token provided");
  }

  const decoded = verifyJwt(accessToken, "accessTokenPrivateKey");

  if (!decoded) {
    return res.status(401).send("Token expired or invalid token");
  }

  if (decoded) {
    res.locals.user = decoded;
  }
  return next();
};

export default deserializeUser;
