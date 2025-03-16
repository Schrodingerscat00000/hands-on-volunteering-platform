import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
} from '@mui/material';

function Home() {
  // Define feature options with titles, descriptions, and routes
  const features = [
    {
      title: 'Login',
      description: 'Sign in to your account to access personalized features.',
      path: '/login'
    },
    {
      title: 'Register',
      description: 'Create a new account to join our volunteer community.',
      path: '/register'
    },
    {
      title: 'Profile',
      description: 'View and edit your skills, causes, and activity history.',
      path: '/profile'
    },
    {
      title: 'Volunteer Events',
      description: 'Discover and join upcoming volunteer opportunities.',
      path: '/events'
    },
    {
      title: 'Create Event',
      description: 'Organize a volunteer event for your community.',
      path: '/event-creation'
    },
    {
      title: 'Help Requests',
      description: 'Browse or post community help requests.',
      path: '/help-requests'
    },
    { title: 'Create Team', description: 'Form a team for group initiatives.', path: '/team-creation' },
    { title: 'Teams', description: 'Join public teams.', path: '/teams' },
    { title: 'Leaderboard', description: 'See top teams.', path: '/leaderboard' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to HandsOn Platform
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with your community, volunteer, and make a difference!
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={3} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  component={Link}
                  to={feature.path}
                  variant="contained"
                  color="primary"
                >
                  Go to {feature.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;