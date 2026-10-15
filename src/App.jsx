import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MoodProvider } from './context/MoodContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DayDetailPage from './pages/DayDetailPage';

const AppWrapper = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <AppWrapper theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/day/:date" element={<ProtectedRoute><DayDetailPage /></ProtectedRoute>} />
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
