import { Button } from "@/components/ui/button";
import React, { memo } from "react";

const FallbackPatientList = () => {
  const filtered = [1, 2, 3];
  return (
    <>
      {filtered.map((patient) => (
        <div
          key={patient}
          className="bg-card relative border border-border rounded-lg p-4 shadow-sm flex 
          flex-col gap-2 cursor-pointer hover:bg-accent transition"
        >
          <span className="bg-primary absolute top-2 animate-pulse right-2 w-8 h-8 flex justify-center items-center rounded-full text-center"></span>
          <h4 className="font-semibold text-foreground h-4" />

          <p className="text-sm text-muted-foreground h-4" />

          <p className="text-sm text-muted-foreground h-4" />

          <Button size="sm" className="animate-pulse" />
        </div>
      ))}
    </>
  );
};

export default memo(FallbackPatientList);
