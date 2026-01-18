import { createSlice } from "@reduxjs/toolkit";

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
        
    }
})


export const { setCart, setCartItems} = cartSlice.actions;
export default cartSlice.reducer;