import { Router } from "express";
import multer from "multer";

// controllers
import UserController from "./app/controllers/UserController";
import ImageController from "./app/controllers/ImageController";
// middleware
import AuthMiddleware from "./app/middlewares/authMiddleware";
import MulterMiddleware from "./app/middlewares/multerMiddleware";

const routes = Router();

// user
routes.post("/loginUser", UserController.login);
routes.post("/createUser", UserController.create);
routes.get("/findByIdUser", AuthMiddleware, UserController.findById);
routes.put("/updateUser", AuthMiddleware, UserController.update);
routes.delete("/deleteUser", AuthMiddleware, UserController.delete);

// image
routes.post(
  "/createImage",
  AuthMiddleware,
  multer(MulterMiddleware).single("file"),
  ImageController.create
);

routes.put(
  "/updateImage",
  AuthMiddleware,
  multer(MulterMiddleware).single("file"),
  ImageController.update
);

routes.post("/findByIdImage", AuthMiddleware, ImageController.findById);

routes.delete("/deleteImage", AuthMiddleware, ImageController.delete);

export default routes;
