import { Schema, model, Document } from "mongoose";

import { IUser } from "./UserModel";
import { IImage } from "./ImageModel";

export interface IPost extends Document {
  user: IUser["_id"];
  comments?: string[];
  description: string;
  image: IImage["_id"];
  hearts?: IUser["_id"][];
}

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: String,
        required: true,
      },
    ],
    hearts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IPost>("Post", PostSchema);
