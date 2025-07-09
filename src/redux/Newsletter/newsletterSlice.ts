import { createSlice } from "@reduxjs/toolkit";

interface NewsletterState {
    newsletterList: any;
    activeNewsletter: any;
    newsletterData: any;
    newsletterHistoryData: any;
    newsletterHistoryDat: boolean;
    selectedTimestamp: string | null;
}

const initialState: NewsletterState = {
    newsletterList: null,
    activeNewsletter: null,
    newsletterData: null,
    newsletterHistoryData: null,
    newsletterHistoryDat: true,
    selectedTimestamp: null,
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
        },
        setNewsletterData: (state, action) => {
            state.newsletterData = action.payload;
        },
        setNewsletterHistoryData: (state, action) => {
            state.newsletterHistoryData = action.payload;
        },
        setSelectedTimestamp: (state, action) => {
            state.selectedTimestamp = action.payload;
        }
    }
})

export const {
    setNewsletterList,
    setActiveNewsletter,
    setNewsletterData,
    setNewsletterHistoryData,
    setSelectedTimestamp
} = newsletterSlice.actions;

export default newsletterSlice.reducer;