import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../api";

const initialState = {
	items: JSON.parse(localStorage.getItem("wishlistItems")) || [],
	loading: false,
	error: null,
	lastFetched: localStorage.getItem("wishlistLastFetched") || null,
};

export const fetchWishlistItems = createAsyncThunk(
	"wishlist/fetchItems",
	async (userId, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get(`${BASE_API_URL}/wishlist/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || "Failed to fetch wishlist"
			);
		}
	}
);

export const checkForWishlistChanges = createAsyncThunk(
	"wishlist/checkForChanges",
	async (userId, { getState, dispatch }) => {
		try {
			const token = localStorage.getItem("accessToken");
			const res = await axios.get(`${BASE_API_URL}/wishlist/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const currentItems = getState().wishlist.items;
			const newItems = res.data;

			if (JSON.stringify(currentItems) !== JSON.stringify(newItems)) {
				return res.data;
			}

			return currentItems;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || "Failed to check wishlist"
			);
		}
	}
);

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		setWishlistItems: (state, action) => {
			state.items = action.payload;
			localStorage.setItem("wishlistItems", JSON.stringify(state.items));
		},
		addToWishlist: (state, action) => {
			state.items.unshift(action.payload);
			localStorage.setItem("wishlistItems", JSON.stringify(state.items));
		},
		removeFromWishlist: (state, action) => {
			state.items = state.items.filter((item) => item.id !== action.payload);
			localStorage.setItem("wishlistItems", JSON.stringify(state.items));
		},
		clearWishlist: (state) => {
			state.items = [];
			localStorage.removeItem("wishlistItems");
			localStorage.removeItem("wishlistLastFetched");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWishlistItems.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWishlistItems.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
				state.error = null;
				state.lastFetched = Date.now();
				localStorage.setItem("wishlistItems", JSON.stringify(state.items));
				localStorage.setItem("wishlistLastFetched", state.lastFetched);
			})
			.addCase(fetchWishlistItems.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(checkForWishlistChanges.fulfilled, (state, action) => {
				if (JSON.stringify(state.items) !== JSON.stringify(action.payload)) {
					state.items = action.payload;
					localStorage.setItem("wishlistItems", JSON.stringify(state.items));
					state.lastFetched = Date.now();
					localStorage.setItem("wishlistLastFetched", state.lastFetched);
				}
			});
	},
});

export const {
	setWishlistItems,
	addToWishlist,
	removeFromWishlist,
	clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
