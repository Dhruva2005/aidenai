import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { travelAPI } from '../services/api';
import { TravelRequestResponse } from '../types';

const statusFilters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TravelRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequestResponse | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const status = selectedTab === 0 ? undefined : statusFilters[selectedTab];
      const response = await travelAPI.getAllRequests(status);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (requestId: number) => {
    try {
      await travelAPI.approveRequest(requestId);
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: number) => {
    setRejectingRequestId(requestId);
    setOpenRejectDialog(true);
  };

  const handleConfirmReject = async () => {
    if (rejectingRequestId && rejectionReason.trim()) {
      try {
        await travelAPI.rejectRequest(rejectingRequestId, rejectionReason);
        fetchRequests();
        setOpenRejectDialog(false);
        setOpenDetails(false);
        setRejectionReason('');
        setRejectingRequestId(null);
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  const handleCancelReject = () => {
    setOpenRejectDialog(false);
    setRejectionReason('');
    setRejectingRequestId(null);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Manager Dashboard - {user?.firstName} {user?.lastName}
        </Typography>
      </Box>

      {/* Request Statistics */}
      <Box display="flex" gap={2} mb={3}>
        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>📊 Total Requests</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{requests.length}</Typography>
        </Paper>
        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          bgcolor: 'warning.main', 
          color: 'warning.contrastText',
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>⏳ Pending</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{requests.filter(r => r.status === 'PENDING').length}</Typography>
        </Paper>
        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          bgcolor: 'success.main', 
          color: 'success.contrastText',
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>✅ Approved</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{requests.filter(r => r.status === 'APPROVED').length}</Typography>
        </Paper>
        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          bgcolor: 'error.main', 
          color: 'error.contrastText',
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>❌ Rejected</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{requests.filter(r => r.status === 'REJECTED').length}</Typography>
        </Paper>
      </Box>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="📊 All Requests" />
          <Tab label="⏳ Pending" />
          <Tab label="✅ Approved" />
          <Tab label="❌ Rejected" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Travel Dates</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Transport</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Days</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Leaves Left</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow 
                  key={request.id}
                  sx={{ 
                    bgcolor: 
                      request.status === 'REJECTED' ? 'error.light' :
                      request.status === 'APPROVED' ? 'success.light' :
                      request.status === 'PENDING' ? 'warning.light' :
                      'inherit',
                    '&:hover': { 
                      bgcolor: 
                        request.status === 'REJECTED' ? 'error.main' :
                        request.status === 'APPROVED' ? 'success.main' :
                        request.status === 'PENDING' ? 'warning.main' :
                        'grey.50',
                      color: 
                        request.status !== 'PENDING' ? 'white' : 'inherit',
                      '& .MuiTableCell-root': {
                        color: request.status !== 'PENDING' ? 'white' : 'inherit'
                      }
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {getStatusIcon(request.status)} {request.employeeFirstName} {request.employeeLastName}
                  </TableCell>
                  <TableCell>
                    {new Date(request.fromDate).toLocaleDateString()} - 
                    {new Date(request.toDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {request.fromLocation} → {request.destination}
                  </TableCell>
                  <TableCell>{request.modeOfTransport}</TableCell>
                  <TableCell>{request.daysRequested}</TableCell>
                  <TableCell>{request.employeeLeavesLeft}</TableCell>
                  <TableCell>
                    {request.status === 'REJECTED' && request.rejectionReason ? (
                      <Tooltip title={`Rejection Reason: ${request.rejectionReason}`} arrow>
                        <Chip
                          label={`${getStatusIcon(request.status)} ${request.status}`}
                          color={getStatusColor(request.status) as any}
                          size="small"
                          sx={{ 
                            cursor: 'help',
                            fontWeight: 'bold',
                            minWidth: '120px'
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Chip
                        label={`${getStatusIcon(request.status)} ${request.status}`}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          minWidth: '120px'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(request)}
                        sx={{ textTransform: 'none', minWidth: '80px' }}
                      >
                        View
                      </Button>
                      {request.status === 'PENDING' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(request.id)}
                            sx={{ textTransform: 'none', minWidth: '100px' }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(request.id)}
                            sx={{ textTransform: 'none', minWidth: '90px' }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
                Employee Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Name: {selectedRequest.employeeFirstName} {selectedRequest.employeeLastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Leaves Left: {selectedRequest.employeeLeavesLeft}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
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
              {selectedRequest.managerFirstName && (
                <Typography variant="body1" gutterBottom>
                  Manager: {selectedRequest.managerFirstName} ({selectedRequest.managerUsername})
                </Typography>
              )}
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
                    {getStatusIcon('REJECTED')} Rejection Details
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
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      <strong>Reason Provided:</strong> {selectedRequest.rejectionReason}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {selectedRequest?.status === 'PENDING' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  handleApprove(selectedRequest.id);
                  setOpenDetails(false);
                }}
                sx={{ minWidth: '120px', textTransform: 'none' }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleReject(selectedRequest.id)}
                sx={{ minWidth: '100px', textTransform: 'none' }}
              >
                Reject
              </Button>
            </>
          )}
          <Button 
            onClick={() => setOpenDetails(false)}
            variant="outlined"
            sx={{ minWidth: '100px', textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCancelReject} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'error.contrastText',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {getStatusIcon('REJECTED')} Reject Travel Request
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom sx={{ lineHeight: 1.6 }}>
            Please provide a detailed reason for rejecting this travel request. This will be visible to the employee and help them understand the decision.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g., Insufficient budget, conflicting dates, required documentation missing..."
            sx={{ mt: 3 }}
            helperText="Please be specific and constructive to help the employee understand the decision."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCancelReject}
            variant="outlined"
            sx={{ minWidth: '100px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReject} 
            color="error" 
            variant="contained"
            disabled={!rejectionReason.trim()}
            startIcon={<Cancel />}
            sx={{ minWidth: '120px', textTransform: 'none' }}
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerDashboard;
