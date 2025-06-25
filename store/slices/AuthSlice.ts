import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"; // ✅ import from Redux Toolkit
import { UserInfo } from "@/hooks/types/types";
import { privateApi } from "@/lib/axios";
import toast from "react-hot-toast";
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    fullname: string;
    email: string;
    mobile_number: string;
    dob: string;
    role: string;
  } | null;
  token: string | null;
}
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await privateApi.get<UserInfo>("/user/me");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to user");
    }
  }
);
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
  extraReducers: (builder) => {
    let toastingId: string;

    builder.addCase(
      fetchUserInfo.fulfilled,
      (state, action: PayloadAction<UserInfo>) => {
        state.user = action.payload;
        toast.success("Patients loaded successfully");
        if (toastingId) {
          toast.dismiss(toastingId);
          toastingId = "";
        }
      }
    );
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
