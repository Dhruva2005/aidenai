import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import api from '../services/api';

interface TravelRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface TravelRequestData {
  fromLocation: string;
  destination: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  purposeOfTravel: string;
  modeOfTransport: string;
  daysRequested: number;
}

const TravelRequestForm: React.FC<TravelRequestFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TravelRequestData>({
    fromLocation: '',
    destination: '',
    fromDate: null,
    toDate: null,
    purposeOfTravel: '',
    modeOfTransport: '',
    daysRequested: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modeOptions = [
    { value: 'FLIGHT', label: 'Flight' },
    { value: 'TRAIN', label: 'Train' },
    { value: 'BUS', label: 'Bus' },
    { value: 'CAR', label: 'Car' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleInputChange = (field: keyof TravelRequestData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (field: 'fromDate' | 'toDate') => (date: Dayjs | null) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: date };
      
      // Calculate days requested when both dates are set
      if (newData.fromDate && newData.toDate) {
        const days = newData.toDate.diff(newData.fromDate, 'day') + 1;
        newData.daysRequested = Math.max(1, days);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.fromLocation || !formData.destination || !formData.fromDate || 
          !formData.toDate || !formData.purposeOfTravel || !formData.modeOfTransport) {
        throw new Error('Please fill in all required fields');
      }

      // Validate dates
      if (formData.fromDate.isBefore(dayjs(), 'day')) {
        throw new Error('From date cannot be in the past');
      }

      if (formData.toDate.isBefore(formData.fromDate)) {
        throw new Error('To date cannot be before from date');
      }

      const requestData = {
        fromLocation: formData.fromLocation,
        destination: formData.destination,
        fromDate: formData.fromDate.format('YYYY-MM-DD'),
        toDate: formData.toDate.format('YYYY-MM-DD'),
        purposeOfTravel: formData.purposeOfTravel,
        modeOfTransport: formData.modeOfTransport,
        daysRequested: formData.daysRequested
      };

      await api.post('/travel', requestData);
      
      // Reset form
      setFormData({
        fromLocation: '',
        destination: '',
        fromDate: null,
        toDate: null,
        purposeOfTravel: '',
        modeOfTransport: '',
        daysRequested: 0
      });
      
      onSubmit();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit travel request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Travel Request</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="From Location"
                  value={formData.fromLocation}
                  onChange={handleInputChange('fromLocation')}
                  fullWidth
                  required
                />
                <TextField
                  label="Destination"
                  value={formData.destination}
                  onChange={handleInputChange('destination')}
                  fullWidth
                  required
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="From Date"
                  value={formData.fromDate}
                  onChange={handleDateChange('fromDate')}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={formData.toDate}
                  onChange={handleDateChange('toDate')}
                  minDate={formData.fromDate || dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Mode of Transport"
                  value={formData.modeOfTransport}
                  onChange={handleInputChange('modeOfTransport')}
                  fullWidth
                  required
                  select
                >
                  {modeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Days Requested"
                  value={formData.daysRequested}
                  type="number"
                  fullWidth
                  disabled
                  helperText="Automatically calculated from date range"
                />
              </Box>
              
              <TextField
                label="Purpose of Travel"
                value={formData.purposeOfTravel}
                onChange={handleInputChange('purposeOfTravel')}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Please describe the purpose and business justification for this travel..."
              />
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TravelRequestForm;
