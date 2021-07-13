import { Request, Response } from "express";
import crypto from "crypto";

import bucket from "../../storage";
import Image from "../models/ImageModel";
import User from "../models/UserModel";

class ImageController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: `error at create Image, req.file is null` });
      }

      const { originalname, size, mimetype } = req.file;

      const random = crypto.randomBytes(18);
      const filename = `${originalname}##${random.toString("hex")}`;
      const publicUrl = `${req.userId}/${filename}`;

      const image = await Image.create({
        size,
        filename,
        mimetype,
        originalname,
        path: publicUrl,
        user: req.userId,
      });

      await User.findByIdAndUpdate(req.userId, { perfilImg: image._id });

      const blob = bucket.file(`${req.userId}/${filename}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
      });

      blobStream.on("error", (err) => {
        throw new Error(`${err}`);
      });
      blobStream.end(req.file.buffer);

      return res.status(200).json({ image });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at create Image, error: ${error}` });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const image = await Image.findById(req.body.imageId);
      return res.status(200).json({ image });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at findById Image, error: ${error}` });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: `error at create Image, req.file is null` });
      }

      const { originalname, size, mimetype } = req.file;

      const random = crypto.randomBytes(18);
      const filename = `${originalname}##${random.toString("hex")}`;
      const publicUrl = `${req.userId}/${filename}`;

      const image = await Image.findByIdAndUpdate(
        req.body.imageId,
        {
          size,
          filename,
          mimetype,
          originalname,
          path: publicUrl,
        },
        { new: true }
      );

      const blob = bucket.file(`${req.userId}/${filename}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
      });

      blobStream.on("error", (err) => {
        throw new Error(`${err}`);
      });
      blobStream.end(req.file.buffer);

      return res.status(200).json({ image });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at update Image, error: ${error}` });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const image = await Image.findByIdAndDelete(req.body.imageId);
      const filename = image?.filename;

      await bucket.file(`${req.userId}/${filename}`).delete();

      return res.status(200).json({ deleted: true });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at delete Image, error: ${error}` });
    }
  }
}

export default new ImageController();
