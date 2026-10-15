import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 24px 16px;
`;

const AuthCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  text-align: center;
`;

const BrandBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${props => props.theme.text};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 11px 14px;
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 8px;
  font-size: 0.92rem;
  background-color: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.accentLight};
  }

  &::placeholder {
    color: ${props => props.theme.textDisabled};
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  background-color: ${props => props.theme.accent};
  color: #FFFFFF;
  margin-top: 6px;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.accentHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
  font-size: 0.86rem;
  color: ${props => props.theme.textSecondary};
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.accent};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.86rem;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorAlert = styled.div`
  padding: 10px 14px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border-left: 3px solid #EF4444;
  border-radius: 6px;
  font-size: 0.84rem;
`;

const SuccessAlert = styled.div`
  padding: 10px 14px;
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
  border-left: 3px solid #22C55E;
  border-radius: 6px;
  font-size: 0.84rem;
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
          setSuccessMessage('Account created! Opening your journal...');
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
      <AuthCard theme={theme}>
        <BrandSection>
          <BrandBadge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 14c2-3 4-3 6 0s4 3 6 0 4-3 4-1" />
              <circle cx="12" cy="7" r="2.2" fill="currentColor" stroke="none" />
            </svg>
          </BrandBadge>
          <div>
            <AppName theme={theme}>Moodcoded</AppName>
            <Subtitle theme={theme}>
              {isSignup ? 'Begin your personal daily reflection journey' : 'Welcome back to your private journal'}
            </Subtitle>
          </div>
        </BrandSection>

        <Form onSubmit={handleSubmit}>
          {displayError && <ErrorAlert>{displayError}</ErrorAlert>}
          {successMessage && <SuccessAlert>{successMessage}</SuccessAlert>}

          <FormGroup>
            <Label theme={theme}>Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. uzair"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              theme={theme}
            />
          </FormGroup>

          {isSignup && (
            <FormGroup>
              <Label theme={theme}>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                theme={theme}
              />
            </FormGroup>
          )}

          <SubmitButton type="submit" disabled={loading} theme={theme}>
            {loading ? 'Connecting...' : isSignup ? 'Create Journal' : 'Open Journal'}
          </SubmitButton>
        </Form>

        <ToggleContainer theme={theme}>
          <span>{isSignup ? 'Already have a journal?' : 'New to Moodcoded?'}</span>
          <TextButton
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setSuccessMessage('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
            theme={theme}
          >
            {isSignup ? 'Sign in' : 'Create an account'}
          </TextButton>
        </ToggleContainer>
      </AuthCard>
    </Container>
  );
};

export default LoginPage;
