import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const countSlice = createSlice({
  name: "count",
  initialState: { value: 100 },
  reducers: {
    increment: (state, action: PayloadAction<{ value: number }>) => {
      state.value += action.payload.value;
    },
    decrement: (state, action) => {
      if (state.value - action.payload.value < 0) {
        state.value = 0;
      } else {
        state.value -= action.payload.value;
      }
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});


export default countSlice.reducer;
export const {increment , decrement ,reset } = countSlice.actions;