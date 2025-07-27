export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'EMPLOYEE' | 'MANAGER';
  leavesLeft: number;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'MANAGER';
}

export interface TravelRequest {
  id?: number;
  fromDate: string;
  toDate: string;
  fromLocation: string;
  destination: string;
  modeOfTransport: string;
  purposeOfTravel: string;
}

export interface TravelRequestResponse {
  id: number;
  employeeFirstName: string;
  employeeLastName: string;
  fromDate: string;
  toDate: string;
  fromLocation: string;
  destination: string;
  modeOfTransport: string;
  purposeOfTravel: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  daysRequested: number;
  employeeLeavesLeft: number;
  managerFirstName?: string;
  managerUsername?: string;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}
