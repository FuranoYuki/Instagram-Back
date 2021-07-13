import { Request, Response } from "express";
import crypto from "crypto";

import User from "../models/UserModel";
import Post from "../models/PostModel";
import Image from "../models/ImageModel";

import bucket from "../../storage";

class PostController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { description } = req.body;

      if (!req.file) return res.status(400).json({ FileError: true });

      const { originalname, size, mimetype } = req.file;

      const random = crypto.randomBytes(18);
      const filename = `${originalname}##${random.toString("hex")}`;
      const publicUrl = `${req.userId}/posts/${filename}`;

      const image = await Image.create({
        size,
        mimetype,
        filename,
        originalname,
        path: publicUrl,
        user: req.userId,
      });

      const post = await Post.create({
        description,
        user: req.userId,
        image: image._id,
      });

      image.update({ post: post._id });
      image.save();

      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: post._id },
      });

      const blob = bucket.file(`${req.userId}/posts/${filename}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
      });

      blobStream.on("error", (err) => {
        throw new Error(`${err}`);
      });
      blobStream.end(req.file.buffer);

      return res.status(200).json({ post });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at create Post, error: ${error}` });
    }
  }
}

export default new PostController();
