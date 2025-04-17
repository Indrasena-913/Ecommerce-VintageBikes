import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API_URL = "https://backend-vintagebikes.onrender.com";

const initialState = {
	items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

export const fetchCartItems = createAsyncThunk(
	"cart/fetchCartItems",
	async () => {
		const token = localStorage.getItem("accessToken");
		const res = await axios.get(`${BASE_API_URL}/cart/`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	}
);

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
	extraReducers: (builder) => {
		builder.addCase(fetchCartItems.fulfilled, (state, action) => {
			state.items = action.payload;
			localStorage.setItem("cartItems", JSON.stringify(state.items));
		});
	},
});

export const { setCart, addToCart, removeFromCart, clearCart } =
	cartSlice.actions;
export default cartSlice.reducer;
