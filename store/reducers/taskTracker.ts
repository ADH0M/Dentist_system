//task_tracker → عنده Tasks فقط لكن بخصائص مختلفة
import { createSlice } from "@reduxjs/toolkit";

interface INewProject {
  title?: string;
  type: "todo" | "project_tracker" | "meeting_notes" | "task_tracker";
}

const initialState = {};

const kanbanSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
});

export default kanbanSlice.reducer;
