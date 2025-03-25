import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/type';

export interface IUserInfo {
    user: IUser;
    access_token: string;
    isAuth: boolean;
    isAdmin: boolean
}

const initialState: IUserInfo = { access_token: "", user: { last_name: "", name: "", id: -1, image: "", is_admin: false, role: null }, isAuth: false, isAdmin: false };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUserInfo | null>) {
            if (!action.payload) {
                state = initialState;
                return
            }
            state.user = action.payload.user;
            state.access_token = action.payload.access_token;
            state.isAdmin = action.payload.user.is_admin;
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        setToken(state, action: PayloadAction<string>) {
            state.access_token = action.payload;
            if (!action.payload) {
                state = initialState;
            }
        },
        setInfoUser(state, action: PayloadAction<IUser | null>) {
            if (!action.payload) return;
            state.user = action.payload


        },
        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        setIsAdmin(state, action: PayloadAction<boolean>) {
            state.user.is_admin = action.payload;
        },
        resetUser(state) {
            state.access_token = initialState.access_token
            state.isAdmin = initialState.isAdmin
            state.user = initialState.user
            state.isAuth = initialState.isAuth
        }
    },
});

export default userSlice.reducer;
export const { setUser, setToken, setIsAuth, setIsAdmin, setInfoUser, resetUser } = userSlice.actions;