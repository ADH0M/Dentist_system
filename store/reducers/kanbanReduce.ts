import { getColumnsAction } from "@/lib/actions/notes-action";
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type IKanbanState =  {id:string , title:string  , isActive:boolean}[]


const initialState: IKanbanState =  [];

export const getColumns = createAsyncThunk("kanban/getColumns", async (userId:string) => {
    const response = await getColumnsAction(userId);    
    return response.map((res)=>({id:res.id , title:res.title , isActive:false}));
});



const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        columnIsActive :(state ,action)=>{
            state.map((col)=>col.id === action.payload ? col.isActive = true : col.isActive = false);
        },
        columnIsNotActive :(state ,action)=>{
            state.map((col)=>col.id === action.payload ? col.isActive = false : col.isActive = false);
        }
     },
    extraReducers: (builder) => {
        builder.addCase(getColumns.fulfilled, (state, action) => {
            return action.payload;                
        });
        builder.addCase(getColumns.rejected, (state, action) => {
           return [];
        }); 
        builder.addCase(getColumns.pending, (state, action) => {
            return [];
        });     
    }
});

export const {columnIsActive , columnIsNotActive} = kanbanSlice.actions;
export default kanbanSlice.reducer;