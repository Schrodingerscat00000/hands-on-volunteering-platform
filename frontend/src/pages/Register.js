import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Alert, CircularProgress, Autocomplete
} from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', location: '', bio: '', skills: [], causes: []
  });
  const [categories, setCategories] = useState({ skills: [], causes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAutocompleteChange = (name) => (e, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful!');
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Bio" name="bio" value={formData.bio} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
        <Autocomplete
          multiple
          options={categories.skills}
          value={formData.skills}
          onChange={handleAutocompleteChange('skills')}
          renderInput={(params) => <TextField {...params} label="Skills" margin="normal" />}
        />
        <Autocomplete
          multiple
          options={categories.causes}
          value={formData.causes}
          onChange={handleAutocompleteChange('causes')}
          renderInput={(params) => <TextField {...params} label="Causes" margin="normal" />}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account? <Button href="/login" color="primary">Login</Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Register;