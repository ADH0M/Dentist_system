/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTodayVisits } from "@/lib/actions/visit-action";
import { SimplePatientVisitType, SimpleVisitWithUserType } from "@/type/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitStateType = {
  data: SimplePatientVisitType[];
  error: boolean;
  errorMsg: string | undefined;
  loading: boolean;
};

export const getPatientVisitsAction = createAsyncThunk(
  "patient-visits/getPatientVisits",
  async (patientId :string, thunkApi) => {
    try {
      const res = await fetch(`/api/patient/visits/${patientId}`, { method: "GET" });
      const visits = await res.json();
      if (!visits.success && visits.error) {
        throw new Error(visits.error);
      }

      
      return visits || [];
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

const patientVisits = createSlice({
  initialState,
  name: "patient-visits",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPatientVisitsAction.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.errorMsg = "";
      state.data = [];
    });
    builder.addCase(getPatientVisitsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.errorMsg = "";
      state.data = action.payload;
      // console.log(action.payload);
      
    });
    builder.addCase(getPatientVisitsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMsg = action.error.message;
      state.data = [];
    });
  },
});

export default patientVisits.reducer;
