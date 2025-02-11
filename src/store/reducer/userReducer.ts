import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/type';

export interface IUserInfo {
    user: IUser;
    access_token: string;
    isAuth: boolean;
}

const initialState: IUserInfo = { access_token: "", user: { last_name: "", name: "", id: -1, image: "", is_admin: false }, isAuth: false };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUserInfo>) {
            state.user = action.payload.user;
            state.access_token = action.payload.access_token;
            const isAdmin = action.payload.user.is_admin ? "true" : "";
            localStorage.setItem("token", action.payload.access_token);
            localStorage.setItem("isAdmin", isAdmin);
        },
        setToken(state, action: PayloadAction<string>) {
            state.access_token = action.payload;
            if (!action.payload) {
                state = initialState;
            }
        },

        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        setIsAdmin(state, action: PayloadAction<boolean>) {
            state.user.is_admin = action.payload;
        }
    },
});

export default userSlice.reducer;
export const { setUser, setToken, setIsAuth, setIsAdmin } = userSlice.actions;