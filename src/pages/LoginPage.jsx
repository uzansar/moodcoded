import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Card = styled.div`
  background-color: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border || '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.7;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border || '#ccc'};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${props => props.theme.inputBackground || '#fff'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #4a9eff;
  color: white;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #3a8eef;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #4a9eff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: rgba(200, 0, 0, 0.1);
  color: #c00;
  border-radius: 6px;
  font-size: 0.9rem;
  border-left: 3px solid #c00;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem;
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border-radius: 6px;
  font-size: 0.9rem;
  border-left: 3px solid #27ae60;
`;

const ToggleContainer = styled.div`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { signup, login, error: authError } = useAuth();
  const { theme } = useTheme();
  
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!password || password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        const result = await signup(username, password);
        if (result.success) {
          setSuccessMessage('Account created! Logging you in...');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setError(result.error);
        }
      } else {
        const result = await login(username, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = error || authError;

  return (
    <Container theme={theme}>
      <Card theme={theme}>
        <Title>😊 Moodcoded</Title>
        <Subtitle>{isSignup ? 'Create an account' : 'Welcome back'}</Subtitle>

        <Form onSubmit={handleSubmit}>
          {displayError && <ErrorMessage>{displayError}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              theme={theme}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              theme={theme}
            />
          </InputGroup>

          {isSignup && (
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                theme={theme}
              />
            </InputGroup>
          )}

          <Button type="submit" disabled={loading} theme={theme}>
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
          </Button>
        </Form>

        <ToggleContainer>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <ToggleButton
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setSuccessMessage('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </ToggleButton>
        </ToggleContainer>
      </Card>
    </Container>
  );
};

export default LoginPage;
