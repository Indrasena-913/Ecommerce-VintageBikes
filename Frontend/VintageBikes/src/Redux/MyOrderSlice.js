import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../api";

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
	extraReducers: (builder) => {
		builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
			state.orders = action.payload;
			localStorage.setItem("myOrders", JSON.stringify(state.orders));
		});
	},
});

export const fetchMyOrders = createAsyncThunk(
	"myOrders/fetchMyOrders",
	async (userId) => {
		const token = localStorage.getItem("accessToken");
		const res = await axios.get(`${BASE_API_URL}/myorders/${userId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	}
);

export const { setOrders, addOrder, removeOrder, clearOrders } =
	myOrdersSlice.actions;
export default myOrdersSlice.reducer;
