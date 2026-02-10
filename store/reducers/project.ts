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
      const res = await fetch(`/api/projects?userId=${userId}`, {
        next: { tags: ["projects"] }, 
      });
      const data = await res.json()      
      return data.data;
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
    reorderProjects: (state, action) => {
      state.data = action.payload.data;
      return state;
    },
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
        return state;
      })
      .addCase(
        userProjects.fulfilled,
        (state, action: PayloadAction<ITaskData[]>) => {
          state.loading = false;
          state.data = action.payload;
          return state;
        }
      )
      .addCase(userProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMsg = action.payload as string;
        state.data = [];
        return state;
      });
  },
});

const projectReducer = slice.reducer;
export const { reorderProjects } = slice.actions;
export default projectReducer;
