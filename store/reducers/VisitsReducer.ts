/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTodayVisits } from "@/lib/actions/visit-action";
import { SimpleVisitWithUserType } from "@/type/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitStateType = {
  data: SimpleVisitWithUserType[] ;
  error: boolean;
  errorMsg: string | undefined;
  loading: boolean;
};

export const getVisits = createAsyncThunk(
  "receptionist/getTodyVisits",
  async (_, thunkApi) => {
    try {
      const res = await fetch('/api/visit',{method:"GET"});
      const visits = await res.json()
      if (!visits.success && visits.error) {
          throw new Error(visits.error);
        }
      
      return visits.data || []
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message || "Unknown error");
    }
  },
);

const initialState: InitStateType = {
  data: [],
  error: false,
  errorMsg: "",
  loading: false,
};

const visitsSlice = createSlice({
  initialState,
  name: "receptionist",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVisits.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.errorMsg = "";
      state.data = [];
    });
    builder.addCase(getVisits.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.errorMsg = "";
      state.data = action.payload ;
      
    });
    builder.addCase(getVisits.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = action.error.message;
      state.data = [];
    });
  },
});

export default visitsSlice.reducer;
