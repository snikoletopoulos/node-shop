import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize/types";

import sequelize from "../helpers/db.helpers";

interface CartItemModel
	extends Model<
		InferAttributes<CartItemModel>,
		InferCreationAttributes<CartItemModel>
	> {
	id: CreationOptional<number>;
	quantity: number;
	productId: ForeignKey<number>;
}

const CartItem = sequelize.define<CartItemModel>("cart-item", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	productId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "product",
			key: "id",
		},
	},
});

export default CartItem;
