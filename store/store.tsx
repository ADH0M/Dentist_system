"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import receptionistReducer from "./reducers/receptionistReducer";
import patientVisitReducer from "./reducers/patientVisitReducer";
import doctorReducer from "./reducers/doctorSlice";
import visitsReducer from "./reducers/VisitsReducer";
import { Provider } from "react-redux";
import { useState } from "react";

const store = configureStore({
  reducer: {
    authReducer,
    receptionistReducer,
    visitsReducer,
    patientVisitReducer,
    doctorReducer,
  },
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useState<typeof store>(() => store);
  return <Provider store={state}>{children}</Provider>;
};

export default StoreProvider;

export type RootState = ReturnType<typeof store.getState>;
export type DisptachStore = typeof store.dispatch;
