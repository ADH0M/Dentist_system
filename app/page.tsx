"use client";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";


export default function Home() {
  const state = useSelectorHook((state) => state.countReducer);
  const dispatch = useDispatchHook();

  
  return (
    <div className="">

      <div className="p-4">
      </div>
      
    </div>
  );
}
