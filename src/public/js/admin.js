const deleteProduct = async button => {
	const productId = button.parentNode.querySelector("[name=productId]").value;
	const token = button.parentNode.querySelector("[name=_csrf]").value;
	const productElement = button.closest("article");

	try {
		await fetch(`/admin/product/${productId}`, {
			method: "DELETE",
			headers: {
				"csrf-token": token,
			},
		});

		productElement.remove();
	} catch (error) {
		console.error(error);
	}
};
