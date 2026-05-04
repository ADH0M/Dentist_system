// components/doctor/TodayPatientsList.tsx
'use client';

import { useDispatch } from 'react-redux';

import PatientCard from './PatientCard';
import { openPatientDetailsModal, setSelectedPatient, TodayPatient } from '@/store/reducers/doctorSlice';

interface TodayPatientsListProps {
  patients: TodayPatient[];
}

export default function TodayPatientsList({ patients }: TodayPatientsListProps) {
  const dispatch = useDispatch();

  const handlePatientClick = (patient: TodayPatient) => {
    dispatch(setSelectedPatient(patient));
    dispatch(openPatientDetailsModal());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onClick={() => handlePatientClick(patient)}
        />
      ))}
    </div>
  );
}