import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/UserModel";
import Image from "../models/ImageModel";

class UserController {
  public async token(id: string): Promise<string> {
    const token = await jwt.sign({ id }, process.env.SECURET_STRING as string, {
      expiresIn: "14d",
    });

    return token;
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;
      const emailTest = await User.findOne({ email });

      if (emailTest) {
        return res.status(400).json({ invalidEmail: true });
      }

      const user = await User.create(req.body);

      const token = this.token(user._id);

      return res.status(200).json({ user, token });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at create user, error: ${error}` });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.userId).populate("perfilImg");

      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at findById user, error: ${error}` });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByIdAndUpdate(req.userId, { ...req.body });

      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at update user, error: ${error}` });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      await Image.find({ user: req.userId }).deleteMany();

      await User.findByIdAndDelete(req.userId);

      return res.send();
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at delete user, error: ${error}` });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("password");

      if (!user) return res.status(400).json({ EmailProblem: true });

      const verify = bcrypt.compare(password, user.password);

      user.password = "";

      if (!verify) return res.status(400).json({ PasswordProblem: true });

      const token = this.token(user._id);

      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `error at login User, error: ${error}` });
    }
  }
}

export default new UserController();
