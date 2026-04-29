// components/doctor/PatientDetailsModal.tsx
"use client";

import { RootState } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Pill,
  FileText,
} from "lucide-react";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { closePatientDetailsModal } from "@/store/reducers/doctorSlice";

export default function PatientDetailsModal() {
  const dispatch = useDispatchHook();
  const { selectedPatient, modals } = useSelectorHook(
    (state: RootState) => state.doctorReducer,
  );

  if (!selectedPatient) return null;

  const { user, allergies, medications, notes, todayVisits } = selectedPatient;

  return (
    <Dialog
      open={modals.patientDetails}
      onOpenChange={() => dispatch(closePatientDetailsModal())}
    >
      <DialogContent className="max-w-sm w-sm md:w-5xl  max-h-[90vh] overflow-y-auto border-border">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        {/* Patient Header */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profile_avatar || undefined} />
            <AvatarFallback className="text-lg bg-accent border-chart-2 border">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {user.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.birthDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(user.birthDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="medical" className="space-y-4 min-h-80 h-80 ">

          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="visits">Today&lsquo;s Visits</TabsTrigger>
            <TabsTrigger value="all">All Visits</TabsTrigger>
          </TabsList>

          <TabsContent value="medical" className="space-y-4">
            {/* Allergies */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Allergies
              </h3>
              {allergies && allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No known allergies</p>
              )}
            </div>

            {/* Medications */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-blue-500" />
                Current Medications
              </h3>
              {medications && medications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medications.map((med) => (
                    <Badge key={med} variant="secondary">
                      {med}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No current medications</p>
              )}
            </div>

            {/* Notes */}
            {notes && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Medical Notes
                </h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {notes}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visits" className="space-y-4 ">
            {todayVisits.map((visit) => (
              <div
                key={visit.id}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge>{visit.type}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(visit.visitDate).toLocaleTimeString()}
                  </span>
                </div>
                {visit.chiefComplaint && (
                  <p className="text-sm mt-2">
                    <strong>Complaint:</strong> {visit.chiefComplaint}
                  </p>
                )}
                {visit.diagnosis && (
                  <p className="text-sm mt-1">
                    <strong>Diagnosis:</strong> {visit.diagnosis}
                  </p>
                )}
                {visit.treatmentPlan && (
                  <p className="text-sm mt-1">
                    <strong>Treatment:</strong> {visit.treatmentPlan}
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="all">
            <p className="text-center text-gray-500 py-8">
              Full visit history coming soon...
            </p>
          </TabsContent>
          
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
