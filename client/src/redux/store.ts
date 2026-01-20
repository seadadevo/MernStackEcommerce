import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice";
import productReducer  from "./productSlice";
import cartReducer  from "./cartSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'Ecommerce',
  version: 2,
  storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    products: productReducer,
    cart: cartReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})




export default store;