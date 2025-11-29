/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUser } from "@/lib/actions/users";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  isActive: boolean;
  username: string;
  email: string;
  photo: string | null;
  type: string;
  phone: string | null;
}

interface IState {
  data?: IUser | null;
  error: boolean;
  errorMsg?: string | null;
  loading: boolean;
}
const initialState: IState = {
  data: null,
  error: false,
  errorMsg: null,
  loading: false,
};

export const fetchUser = createAsyncThunk(
  "auth/user",
  async (data: { userId: string; email: string }, thunkAPI) => {
    try {
      const response = await getUser(data.userId, data.email);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Unknown error");
    }
  }
);

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMsg = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMsg = action.payload as string;
        state.data = null;
      });
  },
});

export default auth.reducer;
