import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { version } from "react";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';









const persistConfig = {
    key:'root',
    version: 1,
    storage,
    whitelist: ['user', ],
}

const rootReducer = combineReducers({
    
    
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware({
        serializableCheck: false,
        
    }),
})

export const persistedStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;