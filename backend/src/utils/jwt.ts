import jwt from "jsonwebtoken";
import config from "config";
import c from "config";

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined,
) {
  // const signingKey = Buffer.from(
  //   config.get<string>(keyName),
  //   "base64",
  // ).toString("ascii");
  return jwt.sign(object, "randomevale", {
    ...(options && options),
  });
}

export function verifyJwt(
  token: string,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
) {
  //console.log("keyName", keyName);
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii",
  );
  try {
    return jwt.verify(token, publicKey);
  } catch (e) {
    console.log(e);
  }
}
