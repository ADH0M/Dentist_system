import { DisptachStore, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

export const  useSelectorHook = useSelector.withTypes<RootState>()
export const  useDispatchHook =  useDispatch.withTypes<DisptachStore>()
