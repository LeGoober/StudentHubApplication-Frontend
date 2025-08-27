// API Diagnostics utility for troubleshooting backend connectivity
import axios from 'axios';
import { API_URL } from '../services/api';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export const runApiDiagnostics = async (): Promise<DiagnosticResult[]> => {
  const results: DiagnosticResult[] = [];
  const token = localStorage.getItem('token');

  // Test 1: Backend connectivity
  try {
    const response = await axios.get(`${API_URL}/actuator/health`, { timeout: 5000 });
    results.push({
      test: 'Backend Connectivity',
      status: 'pass',
      message: 'Backend is reachable',
      details: response.data
    });
  } catch (error: any) {
    results.push({
      test: 'Backend Connectivity',
      status: 'fail',
      message: `Cannot reach backend at ${API_URL}`,
      details: error.message
    });
  }

  // Test 2: Authentication token
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const isExpired = decoded.exp * 1000 < Date.now();
      
      results.push({
        test: 'Authentication Token',
        status: isExpired ? 'fail' : 'pass',
        message: isExpired ? 'Token is expired' : 'Token is valid',
        details: { 
          expires: new Date(decoded.exp * 1000).toISOString(),
          userId: decoded.userId || decoded.id || decoded.sub
        }
      });
    } catch (error) {
      results.push({
        test: 'Authentication Token',
        status: 'fail',
        message: 'Token is malformed',
        details: token.substring(0, 50) + '...'
      });
    }
  } else {
    results.push({
      test: 'Authentication Token',
      status: 'fail',
      message: 'No authentication token found'
    });
  }

  // Test 3: Channel endpoints accessibility
  if (token) {
    try {
      const api = axios.create({
        baseURL: API_URL,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      const response = await api.get('/channel/getAll');
      results.push({
        test: 'Channel API Access',
        status: 'pass',
        message: 'Can access channel endpoints',
        details: `Returned ${response.data?.length || 0} channels`
      });
    } catch (error: any) {
      results.push({
        test: 'Channel API Access',
        status: 'fail',
        message: 'Cannot access channel endpoints',
        details: {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        }
      });
    }
  }

  // Test 4: Channel creation endpoint specifically
  if (token) {
    try {
      const api = axios.create({
        baseURL: API_URL,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      // Try to get info about the create endpoint (this will likely return 405 Method Not Allowed for GET)
      await api.options('/channel/create');
      results.push({
        test: 'Channel Create Endpoint',
        status: 'pass',
        message: 'Channel create endpoint is accessible'
      });
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 405) {
        results.push({
          test: 'Channel Create Endpoint',
          status: 'pass',
          message: 'Channel create endpoint exists (returned 405 for OPTIONS, which is expected)'
        });
      } else if (status === 404) {
        results.push({
          test: 'Channel Create Endpoint',
          status: 'fail',
          message: 'Channel create endpoint not found (404)',
          details: 'Backend may not have /channel/create endpoint'
        });
      } else {
        results.push({
          test: 'Channel Create Endpoint',
          status: 'warning',
          message: `Channel create endpoint returned status ${status}`,
          details: error.response?.data
        });
      }
    }
  }

  return results;
};

export const logDiagnostics = async () => {
  console.group('🔍 API Diagnostics');
  const results = await runApiDiagnostics();
  
  results.forEach(result => {
    const emoji = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    console.log(`${emoji} ${result.test}: ${result.message}`);
    if (result.details) {
      console.log('Details:', result.details);
    }
  });
  
  console.groupEnd();
  return results;
};
