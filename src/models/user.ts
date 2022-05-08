import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";

import sequelize from "../helpers/db.helpers";
import Product from "./product";
import Cart from "./cart";
import Order from "./order";

export interface UserModel
	extends Model<
		InferAttributes<UserModel>,
		InferCreationAttributes<UserModel>
	> {
	id: CreationOptional<number>;
	name: string;
	email: string;
}

const User = sequelize.define<UserModel>("user", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
});

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

export default User;
