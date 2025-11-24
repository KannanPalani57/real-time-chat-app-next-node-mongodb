import UserModel, { User } from "../model/userModel";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export async  function findAllUser() {
  return await UserModel.find().lean()
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export async function findUserByCode(verificationCode: any) {
  return await UserModel.findOne({ verificationCode });
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return false;
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return false;
    }

    return user;
  } catch (e) {
    console.log(e);
  }
}
