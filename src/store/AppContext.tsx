import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppState, Incident, VolunteerProfile, InventoryItem, Donation, VolunteerAssignment, AuditEntry } from '../types';
import { mockData } from '../data/mockData';

type Action =
  | { type: 'UPDATE_INCIDENT'; payload: Incident }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_VOLUNTEER'; payload: VolunteerProfile }
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem }
  | { type: 'UPDATE_DONATION'; payload: Donation }
  | { type: 'ADD_DONATION'; payload: Donation }
  | { type: 'UPDATE_ASSIGNMENT'; payload: VolunteerAssignment }
  | { type: 'ADD_ASSIGNMENT'; payload: VolunteerAssignment }
  | { type: 'ADD_AUDIT_ENTRY'; payload: AuditEntry };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i => i.id === action.payload.id ? action.payload : i),
      };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'UPDATE_VOLUNTEER':
      return {
        ...state,
        volunteers: state.volunteers.map(v => v.id === action.payload.id ? action.payload : v),
      };
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map(i => i.id === action.payload.id ? action.payload : i),
      };
    case 'UPDATE_DONATION':
      return {
        ...state,
        donations: state.donations.map(d => d.id === action.payload.id ? action.payload : d),
      };
    case 'ADD_DONATION':
      return { ...state, donations: [action.payload, ...state.donations] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a => a.id === action.payload.id ? action.payload : a),
      };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [action.payload, ...state.assignments] };
    case 'ADD_AUDIT_ENTRY':
      return { ...state, auditLog: [action.payload, ...state.auditLog] };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, mockData);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
