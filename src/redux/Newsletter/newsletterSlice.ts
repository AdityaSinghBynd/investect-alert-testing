import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newsletterList: null,
    activeNewsletter: null,
}

const newsletterSlice = createSlice({
    name: "newsletter",
    initialState,
    reducers: {
        setNewsletterList: (state, action) => {
            state.newsletterList = action.payload;
        },
        setActiveNewsletter: (state, action) => {
            state.activeNewsletter = action.payload;
        }
    }
})

export const { setNewsletterList, setActiveNewsletter } = newsletterSlice.actions;
export default newsletterSlice.reducer;