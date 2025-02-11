import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { davDamerAPI } from './api/DavdamerAPI';

import userReducer from './reducer/userReducer';
import attrReducer from './reducer/attrReducer';



const rootReducer = combineReducers({
    userReducer,
    attrReducer,
    [davDamerAPI.reducerPath]: davDamerAPI.reducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            })
                .concat(davDamerAPI.middleware)
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];



export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;