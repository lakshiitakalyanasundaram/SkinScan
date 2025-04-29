import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/lib/api';
import { toast } from 'sonner';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirm_password, ...signupData } = formData;
      const response = await signup(
        signupData.email,
        signupData.password,
        signupData.first_name,
        signupData.last_name
      );
      
      setSuccess(response.message);
      toast.success(response.message);
      
      // Don't navigate immediately, let the user see the success message
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Sign up failed. Please try again.');
      toast.error(error.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-16"
            src="https://img.icons8.com/color/96/000000/dermatology.png"
            alt="DermaScan Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join DermaScan for personalized skin care analysis
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="first-name"
                name="first_name"
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="last-name"
                name="last_name"
                type="text"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm_password"
              type="password"
              required
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>

          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="font-medium text-primary hover:text-primary-dark">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-primary hover:text-primary-dark">
              Privacy Policy
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary hover:text-primary-dark">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 