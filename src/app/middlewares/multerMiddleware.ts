import multer from "multer";
import { Express } from "express";

const MulterMiddleware = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (
    req: Express.Response,
    file: Express.Multer.File,
    cb: any
  ): void => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/pjeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"));
    }
  },
};

export default MulterMiddleware;
