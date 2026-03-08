import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminRoutes } from './pages/AdminRoutes';
import { TeacherRoutes } from './pages/TeacherRoutes';
import { StudentRoutes } from './pages/StudentRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherRoutes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentRoutes />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;