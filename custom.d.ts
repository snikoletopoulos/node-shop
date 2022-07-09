import type { HydratedDocument } from "mongoose";
import type { IUser } from "./src/models/user";

declare global {
	namespace Express {
		interface Request {
			user?: HydratedDocument<IUser>;
		}
	}
}
