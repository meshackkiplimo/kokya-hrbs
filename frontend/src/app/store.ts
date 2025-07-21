import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { version } from "react";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { UserApi } from "../Features/users/userAPI";
import { loginAPI } from "../Features/users/loginAPI";
import userSlice from "../Features/login/userSlice";
import { bookingApi } from "../Features/bookings/bookingAPI";
import { paymentApi } from "../Features/payment/paymentAPI";
import { roomsApi } from "../Features/rooms/roomsAPI";
import { hotelApi } from "../Features/hotels/hotelAPI";









const persistConfig = {
    key:'root',
    version: 1,
    storage,
    whitelist: ['user', ],
}

const rootReducer = combineReducers({
    [UserApi.reducerPath]: UserApi.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [hotelApi.reducerPath]: hotelApi.reducer,
    
    user:userSlice,
    
    
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware({
        serializableCheck: false,
        
    }).concat(UserApi.middleware)
       .concat(loginAPI.middleware)
       .concat(bookingApi.middleware)
         .concat(paymentApi.middleware)
            .concat(roomsApi.middleware)
            .concat(hotelApi.middleware)
        

})

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;