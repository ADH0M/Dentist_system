/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchWithPhone } from "@/lib/validations/schema";
import { InfoIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PatientCard from "./PatientCard";
import { Gender } from "@/generated/prisma";

export type UserSimpleInfo = {
  userId: string;
  patientId: string;
  username: string;
  gender: Gender;
  phone: string;
};

const ReceptionistSearch = () => {
  const [search, setSearch] = useState("");
  const data = useDebounce(search);
  const validation = SearchWithPhone.safeParse(data);

  const controllerRef = useRef<AbortController | null>(null);

  const [patientList, setPatientList] = useState<UserSimpleInfo[]>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const timeout = AbortSignal.timeout(5000);
    const signal = AbortSignal.any([controllerRef.current.signal, timeout]);

    const getPatients = async () => {
      setIsPending(true);
      try {
        const res = await fetch("/api/receptionist", {
          signal,
          method: "POST",
          body: JSON.stringify({ phone: data }),
        });

        const r = await res.json();

        if (r.success) {
          console.log(r.data.data);

          setPatientList(r.data.data);
        } else {
          setPatientList([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError" && err.name !== "TimeoutError") {
          console.log(err);
        }
      } finally {
        setIsPending(false);
      }
    };

    if (data && data.length >= 3 && validation.success) {
      getPatients();
    } else {
      setPatientList([]);
    }

    return () => {
      controllerRef.current?.abort();
    };
  }, [data, validation.success]);

  return (
    <div className="relative ">
      <Input
        placeholder="Search patient by phone..."
        value={search}
        max={11}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-2"
      />

      <div className="text-destructive text-xs flex items-center gap-1 px-1 h-5 w-full max-w-md">
        {!validation.success && data && (
          <>
            <InfoIcon size={16} />
            <span>{validation.error.issues[0].message}</span>
          </>
        )}
      </div>

      {data && validation.success && (
        <div
          className="absolute bottom-0 rounded-md border border-border overflow-hidden z-50 
          translate-y-full left-0 w-full max-w-md backdrop-blur-3xl h-60 px-1 py-2"
        >
          <button
            className="absolute top-2  text-muted-foreground cursor-pointer hover:border-destructive
          left-2 z-50 border border-border p-1 hover:text-destructive rounded-full"
            onClick={() => {
              setSearch("");
            }}
          >
            <XIcon size={14} className="w-full" />
          </button>
          {isPending && (
            <div className="mt-4 flex justify-center items-center flex-col">
              <Spinner />
              <p className="text-sm text-secondary mt-1">
                Processing your request
              </p>
              <button
                className="text-xs mt-1 border py-1 px-2 rounded-sm border-border"
                onClick={() => {
                  controllerRef.current?.abort();
                  setIsPending(false);
                  setSearch("");
                }}
              >
                cancel
              </button>
            </div>
          )}

          {!isPending && patientList.length === 0 && validation.success && (
            <p className="text-sm text-muted-foreground">No patients found</p>
          )}

          {patientList.length > 0 && (
            <ul className="space-y-2 mt-2 px-6 overflow-y-scroll h-full custom-scroll">
              {patientList.map((patient, ind) => (
                <PatientCard
                  patient={patient}
                  num={ind}
                  componentType="list"
                  key={patient.userId}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceptionistSearch;
