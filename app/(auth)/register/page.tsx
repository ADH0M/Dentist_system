"use client";

import { useTheme } from "next-themes";


const Page = () => {

    const {theme , setTheme } = useTheme();
    console.log(theme);
    
  return <div className="bg-gray-500 dark:bg-pink-950">page
    <button onClick={()=>{
    }}>
        dark 
    </button>
    <div></div>
    <button onClick={()=>{
    }}>
        light
    </button>
  </div>;

};

export default Page;
