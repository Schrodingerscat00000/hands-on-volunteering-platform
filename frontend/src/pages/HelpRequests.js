import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
  Chip
} from '@mui/material';

function HelpRequests() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', urgency: 'medium' });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const urgencyLevels = ['low', 'medium', 'urgent'];

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/help-requests');
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching help requests:', err);
        setError('Failed to load help requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const postRequest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to post a help request');
      return;
    }
    if (!newRequest.title) {
      alert('Title is required');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/help-requests', newRequest, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests([...requests, res.data]);
      setNewRequest({ title: '', description: '', urgency: 'medium' });
      alert('Help request posted!');
    } catch (err) {
      console.error('Error posting help request:', err);
      alert('Failed to post help request');
    }
  };

  const offerHelp = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to offer help');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/help-requests/${id}/offer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Help offered! Check back for coordination.');
    } catch (err) {
      console.error('Error offering help:', err);
      alert('Failed to offer help');
    }
  };

  const addComment = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to comment');
      return;
    }
    if (!comment.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5000/api/help-requests/${id}/comments`, { content: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(req => 
        req.id === id ? { ...req, comments: [...(req.comments || []), res.data] } : req
      ));
      setComment('');
      alert('Comment added!');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Community Help Requests
      </Typography>

      {/* Posting Form */}
      <Box mb={4} p={2} bgcolor="grey.100" borderRadius={2}>
        <TextField
          label="Title"
          name="title"
          value={newRequest.title}
          onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={newRequest.description}
          onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
        />
        <TextField
          select
          label="Urgency"
          name="urgency"
          value={newRequest.urgency}
          onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          {urgencyLevels.map(level => (
            <MenuItem key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={postRequest}
          fullWidth
          sx={{ mt: 2 }}
        >
          Post Help Request
        </Button>
      </Box>

      {/* Help Requests List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : requests.length === 0 ? (
        <Typography align="center">No help requests available</Typography>
      ) : (
        <List>
          {requests.map(req => (
            <ListItem
              key={req.id}
              sx={{ mb: 2, bgcolor: 'grey.50', borderRadius: 2, flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <ListItemText
                  primary={req.title}
                  secondary={req.description || 'No description'}
                />
                <Chip
                  label={req.urgency}
                  color={req.urgency === 'urgent' ? 'error' : req.urgency === 'medium' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
              <Box mt={1} width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => offerHelp(req.id)}
                  sx={{ mr: 1 }}
                >
                  Offer Help
                </Button>
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                  size="small"
                  sx={{ width: '70%', mr: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={() => addComment(req.id)}
                >
                  Comment
                </Button>
              </Box>
              {req.comments && req.comments.length > 0 && (
                <Box mt={2} width="100%">
                  <Typography variant="subtitle2">Comments:</Typography>
                  {req.comments.map(comment => (
                    <Typography key={comment.id} variant="body2" sx={{ ml: 2 }}>
                      {comment.content} - {comment.User?.name || 'Anonymous'}
                    </Typography>
                  ))}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default HelpRequests;