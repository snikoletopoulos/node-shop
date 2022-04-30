import {
	Model,
	DataTypes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from "sequelize";

import sequelize from "../helpers/db.helpers";

interface ProductModel
	extends Model<
		InferAttributes<ProductModel>,
		InferCreationAttributes<ProductModel>
	> {
	id: CreationOptional<number>;
	title: string;
	price: number;
	description: string;
	imageUrl: string;
}

const Product = sequelize.define<ProductModel>("product", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: {
		type: DataTypes.DOUBLE,
		allowNull: false,
	},
	imageUrl: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

export default Product;
