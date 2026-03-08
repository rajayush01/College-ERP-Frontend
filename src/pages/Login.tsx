import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { GraduationCap, BookOpen, Users, Sparkles } from 'lucide-react';
import * as adminApi from '@/api/admin.api';
import * as teacherApi from '@/api/teacher.api';
import * as studentApi from '@/api/student.api';

export const Login: React.FC = () => {
  const [role, setRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('STUDENT');
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      let userData;

      if (role === 'ADMIN') {
        response = await adminApi.adminLogin(credentials.identifier, credentials.password);
        userData = {
          id: response.data.admin.id,
          role: 'ADMIN' as const,
          name: response.data.admin.name,
          email: response.data.admin.email,
        };
      } else if (role === 'TEACHER') {
        response = await teacherApi.teacherLogin(credentials.identifier, credentials.password);
        userData = {
          id: response.data.teacher.id,
          role: 'TEACHER' as const,
          name: response.data.teacher.name,
          teacherId: response.data.teacher.teacherId,
          email: response.data.teacher.email,
        };
      } else {
        response = await studentApi.studentLogin(credentials.identifier, credentials.password);
        userData = {
          id: response.data.student.id,
          role: 'STUDENT' as const,
          name: response.data.student.name,
          studentId: response.data.student.studentId,
        };
      }

      login(response.data.token, userData);

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const getIdentifierLabel = () => {
    if (role === 'ADMIN') return 'Email';
    if (role === 'TEACHER') return 'Teacher ID';
    return 'Student ID';
  };

  const getRoleIcon = () => {
    if (role === 'ADMIN') return <Users className="w-6 h-6" />;
    if (role === 'TEACHER') return <BookOpen className="w-6 h-6" />;
    return <GraduationCap className="w-6 h-6" />;
  };

  const getRoleColor = () => {
    if (role === 'ADMIN') return 'from-accent-600 to-accent-700';
    if (role === 'TEACHER') return 'from-primary-600 to-primary-700';
    return 'from-success-600 to-success-700';
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-success-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563EB15_1px,transparent_1px),linear-gradient(to_bottom,#2563EB15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30"></div>
      </div>

      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 3 === 0 ? <GraduationCap size={40 + Math.random() * 30} /> : 
             i % 3 === 1 ? <BookOpen size={40 + Math.random() * 30} /> : 
             <Sparkles size={40 + Math.random() * 30} />}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div 
          className={`bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border-2 border-primary-600 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8 space-y-4">
            <div 
              className={`mx-auto w-20 h-20 bg-gradient-to-br ${getRoleColor()} rounded-xl flex items-center justify-center text-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6 border-2 border-white`}
            >
              {getRoleIcon()}
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-secondary-600 font-medium">College Management System</p>
            </div>
          </div>

          {/* Role Selector Cards */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { value: 'STUDENT', label: 'Student', icon: GraduationCap, color: 'success' },
              { value: 'TEACHER', label: 'Teacher', icon: BookOpen, color: 'primary' },
              { value: 'ADMIN', label: 'Admin', icon: Users, color: 'accent' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = role === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? `border-${item.color}-600 bg-${item.color}-50 shadow-xl scale-105`
                      : 'border-secondary-300 hover:border-secondary-400 hover:bg-secondary-50'
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 mx-auto mb-1 transition-colors ${
                      isSelected ? `text-${item.color}-600` : 'text-secondary-400'
                    }`} 
                  />
                  <p className={`text-xs font-bold ${
                    isSelected ? `text-${item.color}-700` : 'text-secondary-600'
                  }`}>
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={getIdentifierLabel()}
              type="text"
              value={credentials.identifier}
              onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
              placeholder={`Enter your ${getIdentifierLabel().toLowerCase()}`}
              required
              className="transition-all duration-300"
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="transition-all duration-300"
            />

            {error && (
              <div className="p-4 bg-danger-50 border-2 border-danger-200 text-danger-700 rounded-xl flex items-start gap-3 animate-slide-up">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Default Credentials Info */}
          <div className="mt-8 p-4 bg-secondary-50 rounded-xl border-2 border-secondary-200">
            <p className="text-xs font-bold text-secondary-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" />
              Default Credentials
            </p>
            <div className="space-y-1 text-xs text-secondary-700 font-medium">
              <p><span className="font-bold text-success-600">Student:</span> student@123</p>
              <p><span className="font-bold text-primary-600">Teacher:</span> teacher@123</p>
              <p><span className="font-bold text-accent-600">Admin:</span> admin@123</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-30px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};