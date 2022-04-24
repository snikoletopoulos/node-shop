import Product from "./product";

class CartItem {
	constructor(public id: number, public quantity: number) {}

	async getProduct() {
		const product = await Product.findById(this.id);
		return product;
	}
}

export default CartItem;
