import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Flight, Visibility } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { travelAPI } from '../services/api';
import { TravelRequestResponse } from '../types';
import TravelRequestForm from './TravelRequestForm';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TravelRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequestResponse | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await travelAPI.getMyRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: TravelRequestResponse) => {
    setSelectedRequest(request);
    setOpenDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '✅';
      case 'REJECTED':
        return '❌';
      case 'PENDING':
        return '⏳';
      default:
        return '';
    }
  };

  const getCardStyling = (status: string) => {
    const baseStyle = {
      mb: 2,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3,
      }
    };

    switch (status) {
      case 'REJECTED':
        return {
          ...baseStyle,
          border: '2px solid',
          borderColor: 'error.main',
          bgcolor: 'error.light',
        };
      case 'APPROVED':
        return {
          ...baseStyle,
          border: '1px solid',
          borderColor: 'success.light',
          bgcolor: 'success.light',
        };
      case 'PENDING':
        return {
          ...baseStyle,
          border: '1px solid',
          borderColor: 'warning.light',
          bgcolor: 'warning.light',
        };
      default:
        return {
          ...baseStyle,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        };
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.firstName} {user?.lastName}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: 2
          }}
        >
          New Travel Request
        </Button>
      </Box>

      <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
        <Box flex="0 0 300px">
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'primary.light',
            color: 'primary.contrastText'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🏖️ Leave Balance
              </Typography>
              <Typography variant="h2" color="inherit" sx={{ fontWeight: 'bold', my: 2 }}>
                {user?.leavesLeft}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                Days remaining
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1">
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              📋 My Travel Requests
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <Typography variant="body1">Loading...</Typography>
              </Box>
            ) : requests.length === 0 ? (
              <Box textAlign="center" p={4}>
                <Typography color="text.secondary" variant="body1">
                  No travel requests found. Create your first request!
                </Typography>
              </Box>
            ) : (
              <Box>
                {requests.map((request) => (
                  <Card 
                    key={request.id} 
                    sx={getCardStyling(request.status)}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex="1">
                          <Typography variant="h6" gutterBottom>
                            <Flight sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {request.fromLocation} → {request.destination}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Transport: {request.modeOfTransport} | Days: {request.daysRequested}
                          </Typography>
                          {request.status === 'REJECTED' && request.rejectionReason && (
                            <Box 
                              sx={{ 
                                mt: 2, 
                                p: 2, 
                                bgcolor: 'error.main', 
                                color: 'error.contrastText',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'error.dark',
                                boxShadow: 2
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {getStatusIcon('REJECTED')} Rejection Reason: {request.rejectionReason}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                          <Chip
                            label={`${getStatusIcon(request.status)} ${request.status}`}
                            color={getStatusColor(request.status) as any}
                            size="small"
                            sx={{
                              fontWeight: 'bold',
                              minWidth: '120px',
                              justifyContent: 'center'
                            }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(request)}
                            sx={{
                              minWidth: '120px',
                              textTransform: 'none'
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      <TravelRequestForm 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        onSubmit={fetchRequests}
      />

      {/* Request Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          📋 Travel Request Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Travel Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                From: {selectedRequest.fromLocation}
              </Typography>
              <Typography variant="body1" gutterBottom>
                To: {selectedRequest.destination}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Dates: {new Date(selectedRequest.fromDate).toLocaleDateString()} - {new Date(selectedRequest.toDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Transport: {selectedRequest.modeOfTransport}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Days Requested: {selectedRequest.daysRequested}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Purpose: {selectedRequest.purposeOfTravel}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Status Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status) as any}
                  size="small"
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                Created: {new Date(selectedRequest.createdAt).toLocaleString()}
              </Typography>
              {selectedRequest.approvedAt && (
                <Typography variant="body1" gutterBottom>
                  {selectedRequest.status === 'APPROVED' ? 'Approved' : 'Rejected'} At: {new Date(selectedRequest.approvedAt).toLocaleString()}
                </Typography>
              )}
              {selectedRequest.status === 'REJECTED' && selectedRequest.rejectionReason && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                    {getStatusIcon('REJECTED')} Request Rejected
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'error.main', 
                      color: 'error.contrastText',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: 'error.dark',
                      boxShadow: 3
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.6 }}>
                      Reason: {selectedRequest.rejectionReason}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setOpenDetails(false)}
            variant="outlined"
            sx={{ minWidth: '100px', textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDashboard;
