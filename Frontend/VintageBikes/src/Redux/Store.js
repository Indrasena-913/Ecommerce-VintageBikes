import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import myOrdersReducer from "./MyOrderSlice";

const store = configureStore({
	reducer: {
		cart: cartReducer,
		myOrders: myOrdersReducer,
	},
});

export default store;
