import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // For v5; use useNavigate for v6
import {
  Container, Typography, TextField, Button, Box, Chip, List, ListItem, ListItemText, Autocomplete, CircularProgress, Alert
} from '@mui/material';

function Profile() {
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', location: '', bio: '', skills: [], causes: [], events: [], helpRequests: []
  });
  const [categories, setCategories] = useState({ skills: [], causes: [] });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory(); // For v5; use const navigate = useNavigate() for v6

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        setLoading(false);
        history.push('/login'); // Redirect to login; use navigate('/login') for v6
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setProfile(profileRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          history.push('/login'); // Redirect; use navigate('/login') for v6
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [history]);

  const handleEdit = () => setEditMode(true);
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleAutocompleteChange = (name) => (e, value) => setProfile({ ...profile, [name]: value });

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditMode(false);
      alert('Profile updated!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Profile Dashboard</Typography>
      <Box mb={3}>
        <TextField label="Name" name="name" value={profile.name} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
        <TextField label="Email" name="email" value={profile.email} fullWidth margin="normal" disabled />
        <TextField label="Phone" name="phone" value={profile.phone || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
        <TextField label="Location" name="location" value={profile.location || ''} onChange={handleChange} fullWidth margin="normal" disabled={!editMode} />
        <TextField label="Bio" name="bio" value={profile.bio || ''} onChange={handleChange} fullWidth margin="normal" multiline rows={3} disabled={!editMode} />
        <Box mt={2}>
          <Typography variant="h6">Skills</Typography>
          {editMode ? (
            <Autocomplete
              multiple
              options={categories.skills}
              value={profile.skills}
              onChange={handleAutocompleteChange('skills')}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.skills.map((skill, idx) => <Chip key={idx} label={skill} />)}
            </Box>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Causes</Typography>
          {editMode ? (
            <Autocomplete
              multiple
              options={categories.causes}
              value={profile.causes}
              onChange={handleAutocompleteChange('causes')}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.causes.map((cause, idx) => <Chip key={idx} label={cause} />)}
            </Box>
          )}
        </Box>
        {editMode ? (
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>Save Changes</Button>
        ) : (
          <Button variant="outlined" onClick={handleEdit} sx={{ mt: 2 }}>Edit Profile</Button>
        )}
      </Box>
      <Box mt={4}>
        <Typography variant="h5">Volunteer History</Typography>
        <Typography variant="h6">Attended Events</Typography>
        <List>
          {profile.events?.map(event => (
            <ListItem key={event.id}><ListItemText primary={event.name} secondary={event.date} /></ListItem>
          ))}
        </List>
        <Typography variant="h6">Help Requests</Typography>
        <List>
          {profile.helpRequests?.map(req => (
            <ListItem key={req.id}><ListItemText primary={req.title} /></ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default Profile;