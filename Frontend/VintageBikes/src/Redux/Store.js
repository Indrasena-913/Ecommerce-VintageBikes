import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import myOrdersReducer from "./MyOrderSlice";
import wishlistReducer from "./WishListSlice";

const store = configureStore({
	reducer: {
		cart: cartReducer,
		myOrders: myOrdersReducer,
		wishlist: wishlistReducer,
	},
});

export default store;
