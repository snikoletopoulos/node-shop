import { User } from "@prisma/client";

declare module "express-session" {
	interface SessionData {
		user: Pick<User, "id" | "email" | "name">;
	}
}
