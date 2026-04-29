import { createSlice } from "@reduxjs/toolkit";

///"patients" | "appointments" | "visits";
export type Tabs = "patients" | "appointments" | "visits";
const initialState :{type:Tabs}= {type:'patients'} 
const receptionistSlice = createSlice({
    initialState,
    name:'receptionist',
    reducers:{
        changeReciptionsTab:(state ,action )=>{
            state.type=action.payload;
        },
    }
});

export default receptionistSlice.reducer;
export const { changeReciptionsTab} = receptionistSlice.actions