import { Request, Response } from "express";
import { validatePassword } from "../service/userService";
import { createSession } from "../service/session.service";
import { signJwt } from "../utils/jwt";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user email and password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // Create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: "15m" },
  );

  // Create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: "1y" },
  );

  // Send refresh & access token back
  return res.send({ accessToken, refreshToken });
}
