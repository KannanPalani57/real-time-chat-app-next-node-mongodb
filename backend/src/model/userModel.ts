import { getModelForClass, prop, DocumentType, modelOptions, Severity, pre, index } from '@typegoose/typegoose';
import log from '../utils/logger';
import argon2 from "argon2";
import { getRandomNumber } from '../controller/userController';

export const privateFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified",
  ];

@pre<User>("save", async function () {
    if (!this.isModified("password")){
        return;
    }

    const hash = await argon2.hash(this.password);

    this.password = hash;

    return;
})

@index({ email: 1 })

@modelOptions({
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    },
})

export class User {
    @prop({ required: true})
    firstName: string;

    @prop({ required: true})
    lastName: string;
    
    @prop({ lowercase: true, required: true, unique: true})
    email: string;
    
    @prop({ required: true})
    userName: string;
    
    @prop({ required: true})
    password: string;

    @prop({required: true, default: () => getRandomNumber()})
    verificationCode: string;
    
    @prop()
    passwordResetCode: string | null;

    @prop({ default: false })
    verified: boolean;

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try{
            return await argon2.verify(this.password, candidatePassword);
        }catch(e) {
            log.error(e, "Could not validate password");
            return true;
        }
    }
}

const userModal = getModelForClass(User)

export default userModal;