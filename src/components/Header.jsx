import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  height: 60px;
  background-color: ${props => props.theme.topbarBg};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
`;

const BrandIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
  color: white;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const BrandTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: ${props => props.theme.text};
  line-height: 1.2;
`;

const BrandTagline = styled.span`
  font-size: 0.68rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
  letter-spacing: 0.2px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const CenterSection = styled.div`
  flex: 1;
  max-width: 480px;
  margin: 0 24px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  height: 38px;
  background-color: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 8px;
  padding: 0 14px;
  gap: 10px;
  transition: all 0.15s ease;

  &:focus-within {
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.accentLight};
  }

  svg {
    color: ${props => props.theme.textDisabled};
    flex-shrink: 0;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.text};
  font-size: 0.88rem;

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogTodayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: ${props => props.theme.accent};
  color: #FFFFFF;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: ${props => props.theme.accentHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionIconButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.borderSubtle};
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: ${props => props.theme.surfaceHover};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  user-select: none;
`;

const Header = ({ onToggleSidebar, onQuickLog, searchQuery, onSearchChange }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <HeaderBar theme={theme}>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar} aria-label="Toggle navigation menu" theme={theme}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </MenuButton>

        <Brand onClick={() => navigate('/')}>
          <BrandIcon>
            {/* Calm reflection wave icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 14c2-3 4-3 6 0s4 3 6 0 4-3 4-1" />
              <circle cx="12" cy="7" r="2.2" fill="currentColor" stroke="none" />
            </svg>
          </BrandIcon>
          <BrandTextGroup>
            <BrandTitle theme={theme}>Moodcoded</BrandTitle>
            <BrandTagline theme={theme}>Daily Journal</BrandTagline>
          </BrandTextGroup>
        </Brand>
      </LeftSection>

      <CenterSection>
        <SearchBox theme={theme}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <SearchInput
            placeholder="Search diary thoughts, memories or feelings..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            theme={theme}
          />
        </SearchBox>
      </CenterSection>

      <RightSection>
        {onQuickLog && (
          <LogTodayButton onClick={onQuickLog} theme={theme} title="Log today's mood">
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
            <span>Log Mood</span>
          </LogTodayButton>
        )}

        <ActionIconButton onClick={toggleTheme} aria-label="Toggle light/dark theme" theme={theme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </ActionIconButton>

        <ActionIconButton onClick={handleLogout} aria-label="Log out" theme={theme} title="Sign out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </ActionIconButton>

        <UserAvatar theme={theme} title={`Signed in as @${username}`}>
          {initial}
        </UserAvatar>
      </RightSection>
    </HeaderBar>
  );
};

export default Header;
