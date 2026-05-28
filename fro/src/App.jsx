import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';
import Patient from './components/Patient';
import Doctor from './components/Doctor';
import Appointment from './components/Appointment';
import Report from './components/Report';
import ProtectedRouter from './components/ProtectedRouter';
import Nvbar from './components/Nvbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAccount />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRouter />}>
          <Route path="/" element={<><Nvbar /><Dashboard /></>} />
          <Route path="/patients" element={<><Nvbar /><Patient /></>} />
          <Route path="/doctors" element={<><Nvbar /><Doctor /></>} />
          <Route path="/appointments" element={<><Nvbar /><Appointment /></>} />
          <Route path="/reports" element={<><Nvbar /><Report /></>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;