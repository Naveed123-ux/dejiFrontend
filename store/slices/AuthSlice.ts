import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // ✅ import from Redux Toolkit

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    fullname: string;
    email: string;
    mobile_number: string;
    dob: string;
    role: string;
  } | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ token: string; user: AuthState["user"] }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
