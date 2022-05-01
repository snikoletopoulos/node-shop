import type { UserModel } from "./src/models/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}