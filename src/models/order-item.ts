import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize/types";

import sequelize from "../helpers/db.helpers";

interface OrederItem
	extends Model<
		InferAttributes<OrederItem>,
		InferCreationAttributes<OrederItem>
	> {
	id: CreationOptional<number>;
	quantity: number;
}

const OrderItem = sequelize.define<OrederItem>("orderItem", {
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
});

export default OrderItem;
