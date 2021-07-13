import { Schema, model, Document } from "mongoose";

import { IUser } from "./UserModel";
import { IPost } from "./PostModel";

export interface IImage extends Document {
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  path: string;
  user: IUser["_id"];
  post?: IPost["_id"];
}

const ImageSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IImage>("Image", ImageSchema);
