import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EntrepreneurUserProfile as EProfile, UserProduct } from '../../types/entrepreneur';

interface EntrepreneurState {
    profile: EProfile | null;
    loading: boolean;
    error?: string | null;
}

const initialState: EntrepreneurState = {
    profile: null,
    loading: false,
    error: null,
};

const slice = createSlice({
    name: 'entrepreneurProfile',
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<EProfile>) {
            state.profile = action.payload;
            state.error = null;
        },
        clearProfile(state) {
            state.profile = null;
            state.error = null;
        },
        addProduct(state, action: PayloadAction<UserProduct>) {
            if (!state.profile) return;
            state.profile.userProducts = state.profile.userProducts || [];
            state.profile.userProducts.push(action.payload);
        },
        removeProduct(state, action: PayloadAction<number>) {
            if (!state.profile || !state.profile.userProducts) return;
            state.profile.userProducts = state.profile.userProducts.filter(p => p.id !== action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    }
});

export const { setProfile, clearProfile, addProduct, removeProduct, setLoading, setError } = slice.actions;

export default slice.reducer;
