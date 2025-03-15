import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress, Alert, Box } from '@mui/material'; // Add Box here

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/teams');
        setTeams(res.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const joinTeam = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in');
    try {
      await axios.post(`http://localhost:5000/api/teams/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Joined team!');
    } catch (err) {
      alert('Failed to join team');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Public Teams</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : teams.length === 0 ? (
        <Typography>No public teams available</Typography>
      ) : (
        <List>
          {teams.map(team => (
            <ListItem key={team.id} secondaryAction={<Button onClick={() => joinTeam(team.id)}>Join</Button>}>
              <ListItemText primary={team.name} secondary={`Owner: ${team.owner?.name || 'Unknown'} | ${team.description || 'No description'}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default Teams;