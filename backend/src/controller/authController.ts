import { Request, Response } from "express";
import { get } from "lodash";
import User from "../model/userModel";
import { CreateSessionInput } from "../schema/authSchema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../service/authService";
import { findUserByEmail, findUserById } from "../service/userService";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).send(message);
  }

  // if (!user.verified) {
  //   return res.status(401).send("User is not verified");
  // }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.status(401).send(message);
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id.toString() });

  // res.cookie("accessToken", accessToken, {
  //   // maxAge: 1000 * 60 * 15, // 15 minutes
  //   maxAge: 1000 * 60 * 60 * 24 * 7, // 15 minutes
  //   httpOnly: true,
  //   domain: "localhost",
  //   path: "/",
  //   sameSite: "lax",
  //   secure: false,
  // });

  // res.cookie("refreshToken", refreshToken, {
  //   maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  //   httpOnly: true,
  //   domain: "localhost",
  //   path: "/",
  //   sameSite: "lax",
  //   secure: false,
  // });

  // send the tokens
  return res.send({
    success: true,
    message: "Login success",
    accessToken,
    // refreshToken,
  });
}

// export async function refreshAccessTokenHandler(req: Request, res: Response) {
//   const refreshToken: string = req.headers["x-refresh"] as string;

//   if (!refreshToken) {
//     return res.send({
//       status: false,
//       message: "Refresh token required",
//     });
//   }

//   const decoded = verifyJwt<{ session: string }>(
//     refreshToken,
//     "refreshTokenPublicKey",
//   );

//   if (!decoded) {
//     return res.status(401).send("Could not refresh access token");
//   }

//   const session = await findSessionById(decoded.session);

//   if (!session || !session.valid) {
//     return res.status(401).send("Could not refresh access token");
//   }

//   const user = await findUserById(String(session.user));

//   if (!user) {
//     return res.status(401).send("Could not refresh access token");
//   }

//   const accessToken = signAccessToken(user);

//   return res.send({ accessToken });
// }
