import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize/types";

import sequelize from "../helpers/db.helpers";
import Product from "./product";
import User from "./user";

interface CartModel
	extends Model<
		InferAttributes<CartModel>,
		InferCreationAttributes<CartModel>
	> {
	id: CreationOptional<number>;
}

const Cart = sequelize.define<CartModel>("cart", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: "cart-item" });

export default Cart;
