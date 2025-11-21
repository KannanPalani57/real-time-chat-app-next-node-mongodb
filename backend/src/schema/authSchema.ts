import { object, string, TypeOf} from "zod";

export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Invalid email or password"),
        password: string({
            required_error: "Password is required"
        }).min(8, "Invalid email or password")
        .refine(
            (value) =>
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/.test(value),
            {
              message:
                "Password must contain at least 1 special character and number",
            }
          ),
    })
});


export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];