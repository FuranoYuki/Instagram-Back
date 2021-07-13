import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json("header authorization doesn't exist");
  }

  const parts = authHeader.split(" ");

  if (parts.length < 2) {
    return res.status(400).json("header authorization incomplete");
  }

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema)) {
    return res
      .status(400)
      .json("the Bearer in the header authorization is missing");
  }

  const data = jwt.verify(token, process.env.SECURET_STRING as string);

  const { id, exp } = data as TokenPayload;

  if (!exp) {
    return res.status(400).json({ tokenExpired: true });
  }

  req.userId = id;
  next();
}

export default AuthMiddleware;
