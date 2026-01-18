import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

const initialState = {
    cart: [],
    cartItems: []
}


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state,action) => {
            state.cart = action.payload;
        },
        setCartItems: (state,action) => {
            state.cartItems = action.payload;
        },
        
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.cartItems = [];
            state.cart = [];
        } )
    }
})


export const { setCart, setCartItems} = cartSlice.actions;
export default cartSlice.reducer;