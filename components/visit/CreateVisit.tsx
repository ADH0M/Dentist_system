"use client";

import { useState } from "react";
import CreateVisitSheet from "./CreateVisitSheet";

type Patient = {
  id: string|undefined;
  name: string | undefined;
  phone: string | undefined;
  gender: "male" | "female" | null;
  totalVisits: number | undefined;
};

const CreateVisit = ({ patient }: { patient: Patient }) => {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      <h3>New Visit</h3>
      <p className="text-sm text-muted-foreground">
        Create a new Visit quickly
      </p>
      <CreateVisitSheet onOpenChange={setOpen} open={open} patient={patient} />
    </div>
  );
};

export default CreateVisit;
