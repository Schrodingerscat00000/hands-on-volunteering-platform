import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // For React Router v5; use useNavigate for v6
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';

function EventCreation() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory(); // For v5; replace with const navigate = useNavigate() for v6

  // Predefined categories (should match backend if validated there)
  const categories = [
    'environment',
    'education',
    'healthcare',
    'poverty',
    'animal_welfare',
    'human_rights'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.category) {
      setError('All fields except description are required.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to create an event.');
      setLoading(false);
      history.push('/login'); // Redirect to login; use navigate('/login') for v6
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/events',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Event created successfully!');
      history.push('/events'); // Redirect to events page; use navigate('/events') for v6
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.error || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create a Volunteer Event
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Event'}
        </Button>
      </Box>
    </Container>
  );
}

export default EventCreation;