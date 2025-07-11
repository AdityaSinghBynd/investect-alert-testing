import { createSlice } from "@reduxjs/toolkit";

interface NewsletterState {
    newsletterList: any;
    activeNewsletter: any;
    newsletterData: any;
    newsletterHistoryData: any;
    newsletterHistoryDat: boolean;
    selectedTimestamp: string | null;
    deletedNewsItems: Record<string, any[]>;
}

const initialState: NewsletterState = {
    newsletterList: null,
    activeNewsletter: null,
    newsletterData: null,
    newsletterHistoryData: null,
    newsletterHistoryDat: true,
    selectedTimestamp: null,
    deletedNewsItems: {},
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
        },
        deleteNewsItem: (state, action) => {
            const { alertId, timestamp, companyId, newsItemIndex } = action.payload;
            const key = `${alertId}-${timestamp}-${companyId}`;
            
            // Find and remove the news item
            const newsletter = state.newsletterHistoryData?.find(n => n.alert_id === alertId);
            if (newsletter) {
                const run = newsletter.runs?.find(r => r.timestamp === timestamp);
                if (run) {
                    const company = run.companies?.find(c => c.id === companyId);
                    if (company && company.news) {
                        // Store the deleted item
                        if (!state.deletedNewsItems[key]) {
                            state.deletedNewsItems[key] = [];
                        }
                        state.deletedNewsItems[key].push({
                            ...company.news[newsItemIndex],
                            index: newsItemIndex
                        });
                        // Remove the item
                        company.news.splice(newsItemIndex, 1);
                    }
                }
            }
        },
        restoreNewsItem: (state, action) => {
            const { alertId, timestamp, companyId } = action.payload;
            const key = `${alertId}-${timestamp}-${companyId}`;
            
            // Get the deleted items
            const deletedItems = state.deletedNewsItems[key];
            if (!deletedItems?.length) return;
            
            // Find the newsletter and restore the item
            const newsletter = state.newsletterHistoryData?.find(n => n.alert_id === alertId);
            if (newsletter) {
                const run = newsletter.runs?.find(r => r.timestamp === timestamp);
                if (run) {
                    const company = run.companies?.find(c => c.id === companyId);
                    if (company) {
                        const itemToRestore = deletedItems.pop();
                        if (itemToRestore) {
                            if (!company.news) company.news = [];
                            company.news.splice(itemToRestore.index, 0, itemToRestore);
                        }
                        if (deletedItems.length === 0) {
                            delete state.deletedNewsItems[key];
                        }
                    }
                }
            }
        }
    }
})

export const {
    setNewsletterList,
    setActiveNewsletter,
    setNewsletterData,
    setNewsletterHistoryData,
    setSelectedTimestamp,
    deleteNewsItem,
    restoreNewsItem
} = newsletterSlice.actions;

export default newsletterSlice.reducer;