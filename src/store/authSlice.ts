import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectRole = (state: RootState) => state.auth.role;

export default authSlice.reducer;
