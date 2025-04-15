import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setCart: (state, action) => {
			state.items = action.payload;
			localStorage.setItem("cartItems", JSON.stringify(state.items));
		},
		addToCart: (state, action) => {
			const existing = state.items.find(
				(item) => item.product.id === action.payload.product.id
			);

			if (existing) {
				existing.quantity = action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}

			localStorage.setItem("cartItems", JSON.stringify(state.items));
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter(
				(item) => item.product.id !== action.payload
			);
			localStorage.setItem("cartItems", JSON.stringify(state.items));
		},
		clearCart: (state) => {
			state.items = [];
			localStorage.removeItem("cartItems");
		},
	},
});

export const { setCart, addToCart, removeFromCart, clearCart } =
	cartSlice.actions;
export default cartSlice.reducer;
