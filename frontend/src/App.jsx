import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import semua halaman
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* --- TAMBAHKAN TOASTER DI SINI --- */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
          }}
        />
        <Navbar />
        <main>
          <Routes>
            {/* ... (semua rute Anda tetap sama) ... */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route 
              path="/create-event" 
              element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} 
            />
            <Route 
              path="/my-events" 
              element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} 
            />
            <Route 
              path="/event/:id/edit" 
              element={<ProtectedRoute><EditEventPage /></ProtectedRoute>} 
            />
          </Routes>
        </main>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;