import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    selectedCategory: 'all',
    selectedBrand: 'all',
    searchKeyword: '',
    priceRange: [0, 100000] ,
    productsCount: 0,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload; 
        },
        setSelectedBrand: (state, action) => {
            state.selectedBrand = action.payload;
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
        },
        setPriceRange: (state, action) => {
            state.priceRange = action.payload;  
        },
        resetFilters: (state) => {
            state.selectedCategory = 'all';
            state.selectedBrand = 'all';
            state.searchKeyword = '';
            state.priceRange = [0, 100000];
        },
        setProductCount: (state, aciton) => {
            state.productsCount = aciton.payload;
        },
        addProduct: (state, action) => {
        state.products.unshift(action.payload);
        state.productsCount += 1;
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload);
            state.productsCount -= 1
        }
    }
});

export const { 
    setProducts, 
    setSelectedCategory, 
    setSelectedBrand,
    setSearchKeyword, 
    setPriceRange,
    resetFilters,
    setProductCount,
    addProduct,
    deleteProduct
} = productSlice.actions;

export default productSlice.reducer;