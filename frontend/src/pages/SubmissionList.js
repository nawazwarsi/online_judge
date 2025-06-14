import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../config/api';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, [language, status]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (language) params.language = language;
      if (status) params.status = status;

      const response = await api.get('/submissions', { params });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError(error.response?.data?.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'wrong_answer':
        return 'error';
      case 'time_limit_exceeded':
      case 'memory_limit_exceeded':
        return 'warning';
      case 'runtime_error':
      case 'compilation_error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Submissions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="wrong_answer">Wrong Answer</MenuItem>
            <MenuItem value="time_limit_exceeded">Time Limit Exceeded</MenuItem>
            <MenuItem value="memory_limit_exceeded">Memory Limit Exceeded</MenuItem>
            <MenuItem value="runtime_error">Runtime Error</MenuItem>
            <MenuItem value="compilation_error">Compilation Error</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Problem</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Test Cases</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Submitted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow
                  key={submission._id}
                  hover
                  onClick={() => navigate(`/submissions/${submission._id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{submission.problem.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={submission.language.toUpperCase()}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status.replace(/_/g, ' ')}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {submission.testCasesPassed}/{submission.totalTestCases}
                  </TableCell>
                  <TableCell>{submission.executionTime}ms</TableCell>
                  <TableCell>{submission.memoryUsed}KB</TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SubmissionList; 