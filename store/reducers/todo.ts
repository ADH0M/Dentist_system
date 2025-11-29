//Todo  →   Tasks
import { createSlice } from "@reduxjs/toolkit";

interface ITask {
  title: string;
  state: boolean;
  order?: number;
  projectId?: string;
  columnId?: string;
  type:"todo"
}

const initialState: ITask = {
  title: "",
  state: false,
  type:"todo"
};

const kanbanSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
});

export default kanbanSlice.reducer;
