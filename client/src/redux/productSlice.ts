import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    selectedCategory: 'all',
    selectedBrand: 'all',
    searchKeyword: '',
    priceRange: [0, 100000] 
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
        }
    }
});

export const { 
    setProducts, 
    setSelectedCategory, 
    setSelectedBrand,
    setSearchKeyword, 
    setPriceRange,
    resetFilters 
} = productSlice.actions;

export default productSlice.reducer;