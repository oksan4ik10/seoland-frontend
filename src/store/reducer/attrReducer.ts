import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IAttrInfo {
    attr: string
}

const initialState: IAttrInfo = { attr: "color" };

export const attrSlice = createSlice({
    name: 'attr',
    initialState,
    reducers: {
        setAttr(state, action: PayloadAction<string>) {
            state.attr = action.payload;
        },
    },
});

export default attrSlice.reducer;
export const { setAttr } = attrSlice.actions;