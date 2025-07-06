import { configureStore } from "@reduxjs/toolkit";
import newsletterModalReducer from "./Modals/Newsletter/newsletterModalSlice";
import newsletterReducer from "./Newsletter/newsletterSlice";

const store = configureStore({
    reducer: {
        newsletterModal: newsletterModalReducer,
        newsletter: newsletterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;