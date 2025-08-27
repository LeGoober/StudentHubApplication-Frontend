import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register, getUser } from '../../services/api';
import { setToken, setUser } from '../../store/slices/authSlice';
import { getUserIdFromToken } from '../../utils/jwt';
import Input from '../ui/Input';
import Button from '../ui/Button';
import AuthHeader from '../layout/AuthHeader';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin, onSignupSuccess }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRole, setUserRole] = useState('STUDENT');
  const [studentNumber, setStudentNumber] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const userRoles = [
    { value: 'STUDENT', label: 'Student', requiresStudentNumber: true },
    { value: 'FACULTY_MEMBER', label: 'Faculty Member', requiresStaffNumber: true },
    { value: 'IT_SUPPORT_STAFF', label: 'IT Support Staff', requiresStaffNumber: true },
    { value: 'ENTREPRENEUR', label: 'Entrepreneur Student', requiresStudentNumber: true },
    { value: 'GUEST', label: 'Guest', requiresNothing: true }
  ];

  const selectedRoleConfig = userRoles.find(role => role.value === userRole);

  const validateForm = () => {
    if (!userEmail || !userPassword || !userFirstName || !userLastName || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    // Validate role-specific requirements
    if (selectedRoleConfig?.requiresStudentNumber && !studentNumber) {
      setError('Student number is required for this role');
      return false;
    }

    if (selectedRoleConfig?.requiresStaffNumber && !staffNumber) {
      setError('Staff number is required for this role');
      return false;
    }

    if (userPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (userPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate student number format (if provided)
    if (studentNumber && !/^\d{8,}$/.test(studentNumber)) {
      setError('Student number must be at least 8 digits');
      return false;
    }

    // Validate staff number format (if provided)
    if (staffNumber && !/^\d{6,}$/.test(staffNumber)) {
      setError('Staff number must be at least 6 digits');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setError('');
      setIsLoading(true);
      
      const response = await register(
        userEmail, 
        userPassword, 
        userFirstName, 
        userLastName,
        userRole,
        studentNumber || undefined,
        staffNumber || undefined
      );
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      dispatch(setToken(token));
      
      // Store user data directly from response
      if (user) {
        dispatch(setUser(user));
      } else {
        // Fallback: Get user ID from token and fetch user details
        const userId = getUserIdFromToken(token);
        if (userId) {
          try {
            const userResponse = await getUser(userId);
            dispatch(setUser(userResponse.data));
          } catch (userError) {
            console.error('Failed to fetch user details:', userError);
            // Continue with signup even if user fetch fails
          }
        }
      }
      
      // Reset form
      setUserEmail('');
      setUserPassword('');
      setUserFirstName('');
      setUserLastName('');
      setUserRole('STUDENT');
      setStudentNumber('');
      setStaffNumber('');
      setConfirmPassword('');
      
      if (onSignupSuccess) {
        onSignupSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed: Email may already be registered';
      setError(errorMessage);
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <AuthHeader title="Create Account" subtitle="Join CPUT StudentHub today" />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {userRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Conditional role-specific fields */}
            {selectedRoleConfig?.requiresStudentNumber && (
              <div>
                <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Number
                </label>
                <Input
                  id="studentNumber"
                  type="text"
                  placeholder="Enter your student number"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
            )}

            {selectedRoleConfig?.requiresStaffNumber && (
              <div>
                <label htmlFor="staffNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Number
                </label>
                <Input
                  id="staffNumber"
                  type="text"
                  placeholder="Enter your staff number"
                  value={staffNumber}
                  onChange={(e) => setStaffNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleSignup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;