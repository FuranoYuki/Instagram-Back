import { model, Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

import { IImage } from "./ImageModel";
import { IPost } from "./PostModel";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  nickname: string;
  perfilImg?: IImage["_id"];
  defaultPerfilImg: string;
  description?: string;
  link?: string;
  followers?: IUser["_id"][];
  following?: IUser["_id"][];
  posts?: IPost["_id"][];
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    nickname: {
      type: String,
      required: true,
    },

    perfilImg: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },

    defaultPerfilImg: {
      type: String,
      default: "instagram_perfil.jpg",
    },

    description: String,

    link: String,

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 11);
  this.password = hash;
  next();
});

export default model<IUser>("User", UserSchema);
