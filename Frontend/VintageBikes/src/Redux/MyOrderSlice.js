import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = "https://backend-vintagebikes.onrender.com";

const initialState = {
	orders: JSON.parse(localStorage.getItem("myOrders")) || [],
	loading: false,
	error: null,
	lastFetched: localStorage.getItem("ordersLastFetched") || null,
};

export const fetchMyOrders = createAsyncThunk(
	"myOrders/fetchMyOrders",
	async (userId, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get(`${BASE_API_URL}/myorders/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to fetch orders");
		}
	}
);

export const checkForNewOrders = createAsyncThunk(
	"myOrders/checkForNewOrders",
	async (userId, { getState, dispatch }) => {
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get(`${BASE_API_URL}/myorders/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const currentOrders = getState().myOrders.orders;
			const newOrders = res.data;

			if (JSON.stringify(currentOrders) !== JSON.stringify(newOrders)) {
				return res.data;
			}

			return currentOrders;
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to check orders");
		}
	}
);

const myOrdersSlice = createSlice({
	name: "myOrders",
	initialState,
	reducers: {
		setOrders: (state, action) => {
			state.orders = action.payload;
			localStorage.setItem("myOrders", JSON.stringify(state.orders));
		},
		addOrder: (state, action) => {
			state.orders.unshift(action.payload);
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
			localStorage.removeItem("ordersLastFetched");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMyOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMyOrders.fulfilled, (state, action) => {
				state.orders = action.payload;
				state.loading = false;
				state.error = null;
				state.lastFetched = Date.now();
				localStorage.setItem("myOrders", JSON.stringify(state.orders));
				localStorage.setItem("ordersLastFetched", state.lastFetched);
			})
			.addCase(fetchMyOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { setOrders, addOrder, removeOrder, clearOrders } =
	myOrdersSlice.actions;
export default myOrdersSlice.reducer;
