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

interface Order
	extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
	id: CreationOptional<number>;
}

const Order = sequelize.define<Order>("order", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

Order.belongsTo(User);
Order.belongsToMany(Product, { through: "order-item" });

export default Order;
