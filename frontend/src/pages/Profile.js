import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/submissions');
      const submissions = response.data;

      const stats = {
        totalSubmissions: submissions.length,
        acceptedSubmissions: submissions.filter(s => s.status === 'accepted').length,
        problemsSolved: new Set(submissions.filter(s => s.status === 'accepted').map(s => s.problem._id)).size,
        languageStats: submissions.reduce((acc, sub) => {
          acc[sub.language] = (acc[sub.language] || 0) + 1;
          return acc;
        }, {}),
        statusStats: submissions.reduce((acc, sub) => {
          acc[sub.status] = (acc[sub.status] || 0) + 1;
          return acc;
        }, {}),
      };

      setStats(stats);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch profile statistics');
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  Total Submissions: {stats.totalSubmissions}
                </Typography>
                <Typography>
                  Accepted Submissions: {stats.acceptedSubmissions}
                </Typography>
                <Typography>
                  Problems Solved: {stats.problemsSolved}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Language Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(stats.languageStats).map(([lang, count]) => (
                  <Typography key={lang}>
                    {lang.toUpperCase()}: {count} submissions
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submission Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(stats.statusStats).map(([status, count]) => (
                  <Typography key={status}>
                    {status.replace(/_/g, ' ')}: {count}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 