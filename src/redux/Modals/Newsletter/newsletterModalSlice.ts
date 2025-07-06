import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewsletterModalOpen: false,
}

const newsletterModalSlice = createSlice({
    name: "newsletterModal",
    initialState,
        reducers: {
        setIsNewsletterModalOpen: (state, action) => {
            state.isNewsletterModalOpen = action.payload;
        }
    }
})

export const { setIsNewsletterModalOpen } = newsletterModalSlice.actions;
export default newsletterModalSlice.reducer;