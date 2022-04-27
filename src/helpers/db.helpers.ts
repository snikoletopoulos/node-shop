import { Sequelize } from "sequelize";

if (
	!process.env.DATABASE_NAME ||
	!process.env.DATABASE_USER ||
	!process.env.DATABASE_PASSWORD
) {
	throw new Error("Database configuration is missing.");
}

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		dialect: "postgres",
		host: process.env.DATABASE_HOST
	}
);

export default sequelize;
