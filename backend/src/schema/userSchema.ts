import { boolean, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "FirstName is required",
    }),
    lastName: string({
      required_error: "LastName is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be atleast 8 characters long")
      .refine(
        (value) =>
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/.test(value),
        {
          message:
            "Password must contain at least 1 special character and number",
        },
      ),
    passwordConfirm: string({
      required_error: "Doesnt match",
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    // id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password is too short - should be min 8 chars")
      .refine(
        (value) =>
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/.test(value),
        {
          message:
            "Password must contain at least 1 special character and number",
        },
      ),
    passwordConfirm: string({
      required_error: "Password doesnt match",
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
