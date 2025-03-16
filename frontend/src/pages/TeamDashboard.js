import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

function TeamDashboard() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`http://localhost:5000/api/teams/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTeam(res.data));
  }, [id]);

  if (!team) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>{team.name} Dashboard</Typography>
      <Typography variant="body1">{team.description || 'No description'}</Typography>
      <Typography variant="body2">Privacy: {team.isPublic ? 'Public' : 'Private'}</Typography>
      <Box mt={2}>
        <Typography variant="h6">Members</Typography>
        <List>
          {team.members.map(member => (
            <ListItem key={member.id}><ListItemText primary={member.name} /></ListItem>
          ))}
        </List>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Events</Typography>
        <List>
          {team.events.map(event => (
            <ListItem key={event.id}><ListItemText primary={event.title} secondary={event.date} /></ListItem>
          ))}
        </List>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Achievements</Typography>
        <Typography>Total Events: {team.events.length}</Typography>
      </Box>
    </Container>
  );
}

export default TeamDashboard;