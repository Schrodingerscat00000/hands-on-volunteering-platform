import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, FormControlLabel, Switch } from '@mui/material';

function TeamCreation() {
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: true });
  const history = useHistory();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSwitch = (e) => setFormData({ ...formData, isPublic: e.target.checked });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in');
    try {
      await axios.post('http://localhost:5000/api/teams', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Team created!');
      history.push('/teams');
    } catch (err) {
      alert('Failed to create team');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Create a Team</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField label="Team Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <FormControlLabel
          control={<Switch checked={formData.isPublic} onChange={handleSwitch} />}
          label={formData.isPublic ? 'Public Team' : 'Private Team'}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Create Team</Button>
      </Box>
    </Container>
  );
}

export default TeamCreation;