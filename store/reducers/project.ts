/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProjects } from "@/lib/actions/projects";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITask {
  loading: boolean;
  error: boolean;
  data?: ITaskData[];
  errorMsg?: string;
}

interface ITaskData {
  createdAt: any;
  id?: string;
  title?: string;
  state?: boolean;
  order?: number;
  userId?: string;
  projectId?: string;
  columnId?: string;
  columns?: [];
  image?: string | null;
  task?: [];
  type?: "todo" | "project_tracker" | "meeting_notes" | "task_tracker";
}

export const userProjects = createAsyncThunk(
  "getProjects/projects",
  async (userId: string, thunkAPI) => {
    try {
      const res = await getProjects(userId);
      console.log("res----------0-----------", res);

      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Unknown error");
    }
  }
);

const initialState: ITask = {
  loading: false,
  error: false,
  data: [],
  errorMsg: "",
};

const slice = createSlice({
  name: "project",
  initialState,
  reducers: {
    todo(state, action) {},
    project_tracker(state, action) {},
    task(state, action) {},
    meeting_notes(state, action) {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProjects.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMsg = undefined;
      })
      .addCase(
        userProjects.fulfilled,
        (state, action: PayloadAction<ITaskData[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(userProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMsg = action.payload as string;
        state.data = [];
      });
  },
});

const projectReducer = slice.reducer;

export default projectReducer;
