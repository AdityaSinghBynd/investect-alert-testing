import { createSlice } from '@reduxjs/toolkit';

export type NewsletterContent = "newsletter-tabContent" | "newsletter-emailContent";

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isAppLoading: true,
    newsletterContent: "newsletter-tabContent" as NewsletterContent,
  },
  reducers: {
    setAppLoading: (state, action) => {
      state.isAppLoading = action.payload;
    },
    setNewsletterContent: (state, action) => {
      state.newsletterContent = action.payload;
    },
  },
});

export const { setAppLoading, setNewsletterContent } = appSlice.actions;
export default appSlice.reducer;
