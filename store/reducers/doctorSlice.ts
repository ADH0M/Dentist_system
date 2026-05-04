/* eslint-disable @typescript-eslint/no-explicit-any */
// store/features/doctorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Types
export interface TodayVisit {
  id: string;
  visitDate: string;
  type: string;
  chiefComplaint: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  proceduresDone: string | null;
}

export interface TodayPatient {
  id: string;
  userId: string;
  allergies: string[];
  medications: string[];
  notes: string | null;
  lastVisitAt: string | null;
  user: {
    id: string;
    username: string;
    phone: string;
    email: string | null;
    profile_avatar: string | null;
    gender: string | null;
    birthDate: string | null;
  };
  todayVisits: TodayVisit[];
}

interface DoctorState {
  todayPatients: TodayPatient[];
  selectedPatient: TodayPatient | null;
  loading: boolean;
  error: string | null;
  stats: {
    totalPatients: number;
    totalVisits: number;
    pendingVisits: number;
  };
  modals: {
    addVisit: boolean;
    patientDetails: boolean;
  };
}

const initialState: DoctorState = {
  todayPatients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  stats: {
    totalPatients: 0,
    totalVisits: 0,
    pendingVisits: 0,
  },
  modals: {
    addVisit: false,
    patientDetails: false,
  },
};

// Async Thunks
export const fetchTodayPatients = createAsyncThunk(
  'doctor/fetchTodayPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/doctor/today-patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewVisit = createAsyncThunk(
  'doctor/addNewVisit',
  async (visitData: {
    patientId: string;
    chiefComplaint: string;
    diagnosis?: string;
    treatmentPlan?: string;
    type?: string;
  }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/doctor/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add visit');
      }
      
      const data = await response.json();
      
      // Refresh today's patients after adding visit
      await dispatch(fetchTodayPatients());
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<TodayPatient | null>) => {
      state.selectedPatient = action.payload;
    },
    openAddVisitModal: (state) => {
      state.modals.addVisit = true;
    },
    closeAddVisitModal: (state) => {
      state.modals.addVisit = false;
    },
    openPatientDetailsModal: (state) => {
      state.modals.patientDetails = true;
    },
    closePatientDetailsModal: (state) => {
      state.modals.patientDetails = false;
      state.selectedPatient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Today Patients
      .addCase(fetchTodayPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.todayPatients = action.payload.data;
        state.stats = action.payload.stats;
      })
      .addCase(fetchTodayPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add New Visit
      .addCase(addNewVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewVisit.fulfilled, (state) => {
        state.loading = false;
        state.modals.addVisit = false;
      })
      .addCase(addNewVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedPatient,
  openAddVisitModal,
  closeAddVisitModal,
  openPatientDetailsModal,
  closePatientDetailsModal,
  clearError,
} = doctorSlice.actions;

export default doctorSlice.reducer;