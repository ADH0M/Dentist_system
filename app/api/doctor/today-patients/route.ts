// app/api/doctor/today-patients/route.ts
import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    
    // Find the doctor user
    
    // 2. Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // 3. Get all visits today for this doctor
    const todayVisits = await prisma.visit.findMany({
      where: {

        visitDate: {
          gte: startOfDay,
          lte: endOfDay
        },

      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                phone: true,
                email: true,
                profile_avatar: true,
                gender: true,
                birthDate: true
              }
            }
          }
        }
      },
      orderBy: {
        visitDate: 'desc'
      }
    });
    
    // 4. Group visits by patient and add today's visits to each patient
    const patientsMap = new Map();
    
    todayVisits.forEach(visit => {
      const patientId = visit.patient.id;
      
      if (!patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          id: visit.patient.id,
          userId: visit.patient.userId,
          allergies: visit.patient.allergies,
          medications: visit.patient.medications,
          notes: visit.patient.notes,
          lastVisitAt: visit.patient.lastVisitAt,
          user: visit.patient.user,
          todayVisits: []
        });
      }
      
      patientsMap.get(patientId).todayVisits.push({
        id: visit.id,
        visitDate: visit.visitDate,
        type: visit.type,
        chiefComplaint: visit.chiefComplaint,
        diagnosis: visit.diagnosis,
        treatmentPlan: visit.treatmentPlan,
        proceduresDone: visit.proceduresDone
      });
    });
    
    // 5. Convert to array and sort by latest visit time
    const patients = Array.from(patientsMap.values());
    patients.sort((a, b) => {
      const aLatest = a.todayVisits[0]?.visitDate || new Date(0);
      const bLatest = b.todayVisits[0]?.visitDate || new Date(0);
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    });
    
    // 6. Calculate stats
    const stats = {
      totalPatients: patients.length,
      totalVisits: todayVisits.length,
      pendingVisits: patients.filter(p => p.todayVisits.some(v => !v.diagnosis)).length
    };
    
    return NextResponse.json({
      success: true,
      data: patients,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching today patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today patients' },
      { status: 500 }
    );
  }
}