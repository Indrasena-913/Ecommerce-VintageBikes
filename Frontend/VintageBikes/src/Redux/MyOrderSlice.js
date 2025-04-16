import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	orders: JSON.parse(localStorage.getItem("myOrders")) || [],
};

const myOrdersSlice = createSlice({
	name: "myOrders",
	initialState,
	reducers: {
		setOrders: (state, action) => {
			state.orders = action.payload;
			localStorage.setItem("myOrders", JSON.stringify(state.orders));
		},
		addOrder: (state, action) => {
			state.orders.push(action.payload);
			localStorage.setItem("myOrders", JSON.stringify(state.orders));
		},
		removeOrder: (state, action) => {
			state.orders = state.orders.filter(
				(order) => order.id !== action.payload
			);
			localStorage.setItem("myOrders", JSON.stringify(state.orders));
		},
		clearOrders: (state) => {
			state.orders = [];
			localStorage.removeItem("myOrders");
		},
	},
});

export const { setOrders, addOrder, removeOrder, clearOrders } =
	myOrdersSlice.actions;
export default myOrdersSlice.reducer;
