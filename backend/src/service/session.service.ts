import SessionModel from "../model/sessionModel";

export async function createSession(userId: any, userAgent: any) {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}
