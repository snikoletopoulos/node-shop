import {
	Model,
	DataTypes,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	ForeignKey,
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
	userId: ForeignKey<number>;
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
	userId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: "user",
			key: "id",
		},
	},
});

export default Product;
