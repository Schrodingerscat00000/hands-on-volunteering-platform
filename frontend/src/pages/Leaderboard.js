import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Box } from '@mui/material'; // Add Box here

function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/teams/leaderboard');
        setTeams(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Team Leaderboard</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : teams.length === 0 ? (
        <Typography>No teams with events yet</Typography>
      ) : (
        <List>
          {teams.map((team, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${team.name}`} secondary={`Events: ${team.eventCount}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default Leaderboard;