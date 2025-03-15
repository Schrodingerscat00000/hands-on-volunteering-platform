import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress
} from '@mui/material';

function Events() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });
  const [loading, setLoading] = useState(true);

  // Fetch events with filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const res = await axios.get(`http://localhost:5000/api/events?${params}`);
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters]); // Re-fetch when filters change

  // Handle filter input changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Join event function
  const joinEvent = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to join an event');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Joined event!');
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join event');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Volunteer Events
      </Typography>

      {/* Filter Inputs */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3} justifyContent="center">
        <TextField
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="Date (YYYY-MM-DD)"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        />
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        /* Event List */
        <List>
          {events.length === 0 ? (
            <Typography align="center">No events found</Typography>
          ) : (
            events.map(event => (
              <ListItem
                key={event.id}
                secondaryAction={
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => joinEvent(event.id)}
                  >
                    Join
                  </Button>
                }
                sx={{ mb: 1, bgcolor: 'grey.100', borderRadius: 1 }}
              >
                <ListItemText
                  primary={event.title || event.name} // Handle title/name variation
                  secondary={event.description || 'No description available'}
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </Container>
  );
}

export default Events;