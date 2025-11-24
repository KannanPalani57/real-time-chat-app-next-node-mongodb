import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class Messages {
    @prop({ required: true })
    fromUserId: mongoose.Schema.Types.ObjectId;

    @prop({ required: true })
    toUserId: mongoose.Schema.Types.ObjectId;

    @prop({ default: ""})
    contentEncrypted: string;
}

const MessagesModel = getModelForClass(Messages, {
    schemaOptions: {
        timestamps: true,
    },
});

export default MessagesModel;
