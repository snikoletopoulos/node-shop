import { Schema, model, Types } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	cart: Types.Array<{ productId: Types.ObjectId; quantity: number }>;
}

const userSchema = new Schema<IUser>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

export default model<IUser>("User", userSchema);
