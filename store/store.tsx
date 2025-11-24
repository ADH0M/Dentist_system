"use client";
import { configureStore } from "@reduxjs/toolkit";
import countReducer from "./reducers/count";
import kanbanReducer from "./reducers/kanbanReduce";
import { Provider } from "react-redux";
import { useState } from "react";

const store = configureStore({
  reducer: {
    countReducer,
    kanbanReducer
  },
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useState<typeof store>(() => store );
  return <Provider store={state}>{children}</Provider>;
};

export default StoreProvider;

export type RootState = ReturnType<typeof store.getState>;
export type DisptachStore = typeof store.dispatch;
