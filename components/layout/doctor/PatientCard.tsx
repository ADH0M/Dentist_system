// components/doctor/PatientCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, Pill, Eye } from "lucide-react";
import { TodayPatient } from "@/store/reducers/doctorSlice";
import { useRouter } from "next/navigation";
import React from "react";

interface PatientCardProps {
  patient: TodayPatient;
  onClick: () => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const { user, allergies, medications, todayVisits } = patient;
  const lastVisit = todayVisits[0];
  const visitCount = todayVisits.length;
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer  border-border hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profile_avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-primary">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
          </div>
          {visitCount > 1 && (
            <Badge variant="secondary" className="text-xs">
              {visitCount} visits
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Last Visit Info */}
        {lastVisit && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-3 w-3" />
            <span>
              {lastVisit.type} at{" "}
              {new Date(lastVisit.visitDate).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Chief Complaint */}
        {lastVisit?.chiefComplaint && (
          <div className="text-sm">
            <span className="font-medium">Complaint:</span>
            <p className="text-gray-600 mt-1 line-clamp-2">
              {lastVisit.chiefComplaint}
            </p>
          </div>
        )}

        {/* Allergies */}
        {allergies && allergies.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {allergies.slice(0, 3).map((allergy) => (
                <Badge key={allergy} variant="destructive" className="text-xs">
                  {allergy}
                </Badge>
              ))}
              {allergies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{allergies.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Medications */}
        {medications && medications.length > 0 && (
          <div className="flex items-start gap-2">
            <Pill className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {medications.slice(0, 2).map((med) => (
                <Badge key={med} variant="secondary" className="text-xs">
                  {med}
                </Badge>
              ))}
              {medications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{medications.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {lastVisit?.diagnosis ? (
          <Badge
            variant="default"
            className="w-full justify-center border-chart-1 text-chart-2 py-2 "
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/doctor/patient/${patient.id}`);
            }}
          >
            Diagnosis Completed
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="w-full justify-center border-chart-5 text-chart-5 select-none py-2
              active:bg-accent active:border-chart-2
            "
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/doctor/patient/${patient.id}`);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
