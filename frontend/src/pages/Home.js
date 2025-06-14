import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Online Judge
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Practice coding problems, improve your skills, and track your progress
        </Typography>

        {!user && (
          <Box sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
            >
              Login
            </Button>
          </Box>
        )}

        {user && (
          <Box sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/problems"
              variant="contained"
              color="primary"
              size="large"
            >
              Browse Problems
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4} sx={{ mt: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Multiple Languages
            </Typography>
            <Typography>
              Support for C++, Python, and Java. Write and submit your solutions in your preferred language.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Real-time Execution
            </Typography>
            <Typography>
              Get instant feedback on your code with our secure and efficient code execution system.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Track Progress
            </Typography>
            <Typography>
              Monitor your performance, view submission history, and track your improvement over time.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Coding?
        </Typography>
        <Button
          component={RouterLink}
          to={user ? '/problems' : '/register'}
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          {user ? 'Browse Problems' : 'Create Account'}
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 