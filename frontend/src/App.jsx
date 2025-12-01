import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import Teams from './pages/Teams';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import OrganizerLogin from './pages/OrganizerLogin';

import Layout from './components/Layout';

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/organizer-login" element={<OrganizerLogin />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/teams" element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        } />
        <Route path="/create-event" element={
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/host-dashboard" element={
          <PrivateRoute>
            <HostDashboard />
          </PrivateRoute>
        } />
        <Route path="/events/:id/edit" element={
          <PrivateRoute>
            <EditEvent />
          </PrivateRoute>
        } />
      </Routes>
    </Layout>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
