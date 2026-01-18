import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload ? true : false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken')
        },
        setLoading: (state, action) => {
             state.loading = action.payload;
        }
    }
})

export const {setUser, setLoading, logout} = userSlice.actions
export default userSlice.reducer