"use client";
import SelectElement from "@/components/ui/Select";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { useTheme } from "next-themes";
import { ChangeEvent } from "react";

export default function Home() {
  const state = useSelectorHook((state) => state.countReducer);
  const dispatch = useDispatchHook();
  const { theme, setTheme } = useTheme();
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };
  return (
    <div className="">
      <select name="select-item" id="mean-select" onChange={handleChange} value={theme} >
        <option value="dark">dark</option>
        <option value="light">light</option>
      </select>

      <div className="p-4">
      </div>
      
    </div>
  );
}
