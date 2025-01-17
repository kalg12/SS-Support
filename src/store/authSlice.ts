import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  nombre: string | null;
  apellido: string | null;
  foto: string | null;
  becarioId: number | null; // Añadir becarioId
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  role: null,
  nombre: null,
  apellido: null,
  foto: null,
  becarioId: null, // Añadir becarioId
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        role: string;
        nombre: string;
        apellido: string;
        foto: string;
        becarioId: number; // Añadir becarioId
      }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.nombre = action.payload.nombre;
      state.apellido = action.payload.apellido;
      state.foto = action.payload.foto;
      state.becarioId = action.payload.becarioId; // Añadir becarioId
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.nombre = null;
      state.apellido = null;
      state.foto = null;
      state.becarioId = null; // Añadir becarioId
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectRole = (state: RootState) => state.auth.role;
export const selectNombre = (state: RootState) => state.auth.nombre;
export const selectApellido = (state: RootState) => state.auth.apellido;
export const selectFoto = (state: RootState) => state.auth.foto;
export const selectToken = (state: RootState) => state.auth.token;
export const selectBecarioId = (state: RootState) => state.auth.becarioId; // Añadir selectBecarioId

export default authSlice.reducer;
