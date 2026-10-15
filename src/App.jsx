import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MoodProvider } from './context/MoodContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DayDetailPage from './pages/DayDetailPage';

const AppWrapper = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
`;

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <AppWrapper theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/day/:date"
            element={
              <ProtectedRoute>
                <DayDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MoodProvider>
          <AppContent />
        </MoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
