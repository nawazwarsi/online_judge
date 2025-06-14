import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  TextField
} from '@mui/material';
import Editor from '@monaco-editor/react';
import api from '../config/api';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [submission, setSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [compileOutput, setCompileOutput] = useState('');
  const [compileError, setCompileError] = useState('');
  const [testInput, setTestInput] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${id}`);
      setProblem(response.data);
      setCode(getDefaultCode(language));
      if (response.data.testCases && response.data.testCases.length > 0) {
        setTestInput(response.data.testCases[0].input);
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
      setError(error.response?.data?.message || 'Failed to fetch problem');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'cpp':
        return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <algorithm>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    string input;
    getline(cin, input);
    
    // Parse input string
    size_t numsStart = input.find('[');
    size_t numsEnd = input.find(']');
    size_t targetStart = input.find("target = ");
    
    // Extract numbers string
    string numsStr = input.substr(numsStart + 1, numsEnd - numsStart - 1);
    
    // Extract target string
    string targetStr = input.substr(targetStart + 8);
    
    // Parse numbers
    vector<int> nums;
    stringstream ss(numsStr);
    string num;
    while (getline(ss, num, ',')) {
        // Remove any whitespace
        num.erase(remove_if(num.begin(), num.end(), ::isspace), num.end());
        nums.push_back(stoi(num));
    }
    
    // Parse target
    int target = stoi(targetStr);
    
    // Find solution
    vector<int> result = twoSum(nums, target);
    
    // Output result exactly as expected
    cout << "[" << result[0] << "," << result[1] << "]";
    
    return 0;
}`;
      case 'python':
        return `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

def main():
    # Read input
    input_str = input()
    
    # Parse input
    nums_str = input_str[input_str.find('['):input_str.find(']')+1]
    target_str = input_str[input_str.find('target = ')+8:]
    
    # Convert string to list of integers
    nums = [int(x.strip()) for x in nums_str[1:-1].split(',')]
    target = int(target_str)
    
    # Find solution
    result = two_sum(nums, target)
    
    # Output result
    print(f"[{result[0]},{result[1]}]")

if __name__ == "__main__":
    main()`;
      case 'java':
        return `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[] { numMap.get(complement), i };
            }
            numMap.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        
        // Parse input
        int numsStart = input.indexOf('[');
        int numsEnd = input.indexOf(']');
        int targetStart = input.indexOf("target = ");
        
        // Extract numbers
        String numsStr = input.substring(numsStart + 1, numsEnd);
        String targetStr = input.substring(targetStart + 8);
        
        // Convert to array
        String[] numStrings = numsStr.split(",");
        int[] nums = new int[numStrings.length];
        for (int i = 0; i < numStrings.length; i++) {
            nums[i] = Integer.parseInt(numStrings[i].trim());
        }
        
        int target = Integer.parseInt(targetStr);
        
        // Find solution
        int[] result = twoSum(nums, target);
        
        // Output result
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`;
      default:
        return '';
    }
  };

  const handleCompile = async () => {
    setCompileOutput('');
    setCompileError('');
    setSubmitting(true);
    try {
      const response = await api.post('/submissions/compile', {
        code,
        language,
        input: testInput
      });
      if (response.data.error) {
        setCompileError(response.data.error);
      } else {
        setCompileOutput(response.data.output);
      }
    } catch (error) {
      console.error('Error compiling code:', error);
      setCompileError(error.response?.data?.message || 'Compilation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.post('/submissions', {
        problemId: id,
        code,
        language
      });
      
      if (response.data) {
        // Show success message
        setCompileOutput('Submission successful! Redirecting to submissions page...');
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/submissions');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setError(error.response?.data?.message || 'Failed to submit code. Please try again.');
      setCompileError(error.response?.data?.message || 'Failed to submit code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
  
  if (!problem) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {problem.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Difficulty: {problem.difficulty}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tags: {problem.tags.join(', ')}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Problem" />
            <Tab label="Submit" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {problem.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Constraints
              </Typography>
              <Typography variant="body1" paragraph>
                Time Limit: {problem.constraints.timeLimit}ms
              </Typography>
              <Typography variant="body1" paragraph>
                Memory Limit: {problem.constraints.memoryLimit}MB
              </Typography>
              <Typography variant="h6" gutterBottom>
                Examples
              </Typography>
              {problem.testCases.map((testCase, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Example {index + 1}:
                  </Typography>
                  <Typography variant="body1">
                    Input: {testCase.input}
                  </Typography>
                  <Typography variant="body1">
                    Output: {testCase.output}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>
              <Box sx={{ mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={handleLanguageChange}
                  >
                    <MenuItem value="cpp">C++</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Test Input
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input here"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCompile}
                  disabled={submitting}
                  sx={{ mr: 2 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Compile & Run'}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Box>
              {(compileOutput || compileError || error) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Output
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}
                  >
                    {compileError || error ? (
                      <Typography color="error">
                        {compileError || error}
                      </Typography>
                    ) : (
                      <Typography
                        component="pre"
                        sx={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all'
                        }}
                      >
                        {compileOutput}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProblemDetail; 