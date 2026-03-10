"use client";
import { useState } from "react";

interface AssistantPatient {
  name: string;
  phone?: string;
  email?: string;
  gender: "male"|"female";
  address?: string;
  birthdate: string;
  visitType: "initial" | "follow-up";
  payment?: {
    amount?: number;
    method?: "Cash" | "Card" | "Online";
    notes?: string;
  };
}

const emptyAssistantPatient: AssistantPatient = {
  name: "",
  phone: "",
  email: "",
  address: "",
  gender: "male",
  birthdate: new Date().toDateString(),
  visitType: "initial",
  payment: {
    amount: undefined,
    method: "Cash",
    notes: "",
  },
};

export default function AssistantPatientForm() {
  const [patient, setPatient] = useState<AssistantPatient>(
    emptyAssistantPatient,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Add Patient Info
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div>
              <label className="auth-label">Patient Name</label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) =>
                  setPatient({ ...patient, name: e.target.value })
                }
                className="auth-input"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="auth-label">Phone</label>
              <input
                type="text"
                value={patient.phone || ""}
                onChange={(e) =>
                  setPatient({ ...patient, phone: e.target.value || undefined })
                }
                className="auth-input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
                className="auth-input"
              />
            </div>

            {/* Address */}
            <div>
              <label className="auth-label">Address</label>
              <input
                type="text"
                value={patient.address || ""}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    address: e.target.value || undefined,
                  })
                }
                className="auth-input"
              />
            </div>

            {/* birthdate */}
            <div>
              <label className="auth-label">Birthdate</label>
              <input
                type="date"
                value={patient.birthdate}
                onChange={(e) => {
                  setPatient({
                    ...patient,
                    birthdate: e.target.value || new Date().toDateString(),
                  });
                }}
                className="auth-input"
              />
            </div>

            {/* gender */}
            <div className="">
              <label className="auth-label">Gender</label>
              <select
                value={patient.gender}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    gender: e.target.value as "male" | "female",
                  })
                }
                className="auth-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Visit Type */}
            <div className="md:col-span-2">
              <label className="auth-label">Visit Type</label>
              <select
                value={patient.visitType}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    visitType: e.target.value as "initial" | "follow-up",
                  })
                }
                className="auth-input"
              >
                <option value="initial">Initial Visit</option>
                <option value="follow-up">Follow-up Visit</option>
              </select>
            </div>

            {/* Payment */}
            <div className="md:col-span-2 border-t border-border pt-4 ">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Payment Details
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-2">
                <input
                  type="number"
                  placeholder="Amount Paid"
                  value={patient.payment?.amount || ""}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      payment: {
                        ...patient.payment,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                  className="auth-input"
                  min={0}
                />

                <textarea
                  placeholder="Payment Notes"
                  value={patient.payment?.notes || ""}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      payment: { ...patient.payment, notes: e.target.value },
                    })
                  }
                  className="auth-input mt-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={false}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 w-full"
              >
                {true ? "Saving..." : "Save Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
