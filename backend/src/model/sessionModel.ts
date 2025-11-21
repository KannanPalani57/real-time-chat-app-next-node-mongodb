import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./userModel";
import { SchemaType, SchemaTypes } from "mongoose";

export class Session {
  @prop({
    type: SchemaTypes.ObjectId,
    ref: () => User,
  })
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;

  @prop({ type: String })
  userAgent?: string;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
