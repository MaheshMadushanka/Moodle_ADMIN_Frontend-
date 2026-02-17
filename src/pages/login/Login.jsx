import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/vtclogo.jpeg";
import { loginUser, sendOTP } from '../../Api/Api';
import Swal from 'sweetalert2';

function Login() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      const response = await loginUser(formData.email, formData.password);
      
      if (response.data.status) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.result.token);
        localStorage.setItem('userDetails', JSON.stringify(response.data.result.userDetails));
        console.log('User Details:', response.data.result.userDetails);
        
        // Determine user role and redirect accordingly
        const userDetails = response.data.result.userDetails;
        let redirectPath = '/dashboard';
        
        if (userDetails.admins && userDetails.admins.length > 0) {
          redirectPath = '/dashboard';
        } else if (userDetails.lectures && userDetails.lectures.length > 0) {
          redirectPath = '/lecturer';
        } else if (userDetails.students && userDetails.students.length > 0) {
          redirectPath = '/student';
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: response.data.message,
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          nav(redirectPath);
        });
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to login. Please try again.';
      setError(errorMsg);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      if (!forgotEmail) {
        Swal.fire({
          icon: 'warning',
          title: 'Email Required',
          text: 'Please enter your email address',
          confirmButtonColor: '#3b82f6'
        });
        setForgotLoading(false);
        return;
      }

      const response = await sendOTP(forgotEmail);
      
      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'Please check your email for the OTP code',
          confirmButtonColor: '#3b82f6'
        });
        setShowForgotPassword(false);
        setForgotEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to send OTP',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Transparent Login Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {!showForgotPassword ? (
            <>
              {/* Logo Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white/30 shadow-lg">
                  <img 
                    src={Logo} 
                    alt="VTC Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-300 text-sm">Sign in to your admin account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={20} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                      placeholder="admin@example.com"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={20} className="text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                      placeholder="Enter your password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-slate-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-slate-400">Admin Portal</span>
                  </div>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-sm text-slate-400">
                Protected by advanced security measures
              </p>
            </>
          ) : (
            <>
              {/* Forgot Password Section */}
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-slate-300 text-sm text-center">Enter your email address and we'll send you an OTP code</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-slate-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={20} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                      placeholder="your.email@example.com"
                      disabled={forgotLoading}
                      required
                    />
                  </div>
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:scale-100"
                >
                  {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                {/* Back to Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail('');
                  }}
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  Back to Login
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-6">
                Check your email for the OTP code to reset your password
              </p>
            </>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

export default Login;
