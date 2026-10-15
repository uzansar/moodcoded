import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const SidebarContainer = styled.aside`
  width: ${props => props.$collapsed ? '68px' : '230px'};
  background-color: ${props => props.theme.sidebarBg};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  user-select: none;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    z-index: 40;
    width: 230px;
    transform: ${props => props.$openMobile ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const NavList = styled.nav`
  padding: 16px ${props => props.$collapsed ? '6px' : '12px'};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.$collapsed ? '0' : '14px'};
  flex-direction: ${props => props.$collapsed ? 'column' : 'row'};
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  padding: ${props => props.$collapsed ? '12px 0' : '10px 14px'};
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? props.theme.border : 'transparent'};
  background-color: ${props => props.$active ? props.theme.surfaceHover : 'transparent'};
  color: ${props => props.$active ? props.theme.text : props.theme.textSecondary};
  font-size: ${props => props.$collapsed ? '0.68rem' : '0.88rem'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  width: 100%;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
  }

  svg {
    flex-shrink: 0;
    color: ${props => props.$active ? props.theme.accent : 'currentColor'};
  }
`;

const StreakCard = styled.div`
  margin: auto 12px 20px 12px;
  padding: 14px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StreakTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StreakValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StreakSubtext = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.3;
`;

const Sidebar = ({ collapsed, activeTab, onTabChange, streak = 0, openMobile }) => {
  const { theme } = useTheme();

  return (
    <SidebarContainer $collapsed={collapsed} $openMobile={openMobile} theme={theme}>
      <NavList $collapsed={collapsed}>
        <NavItem
          $collapsed={collapsed}
          $active={activeTab === 'calendar'}
          onClick={() => onTabChange('calendar')}
          theme={theme}
          title="Monthly Calendar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Calendar</span>
        </NavItem>

        <NavItem
          $collapsed={collapsed}
          $active={activeTab === 'analytics'}
          onClick={() => onTabChange('analytics')}
          theme={theme}
          title="Insights & Trends"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>Insights</span>
        </NavItem>

        <NavItem
          $collapsed={collapsed}
          $active={activeTab === 'history'}
          onClick={() => onTabChange('history')}
          theme={theme}
          title="Timeline Notes"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Timeline</span>
        </NavItem>
      </NavList>

      <StreakCard $collapsed={collapsed} theme={theme}>
        <StreakTop theme={theme}>
          <span>Streak</span>
          <span>⚡ Steady</span>
        </StreakTop>
        <StreakValue theme={theme}>
          <span role="img" aria-label="streak flame">🔥</span>
          <span>{streak} {streak === 1 ? 'day' : 'days'}</span>
        </StreakValue>
        <StreakSubtext theme={theme}>
          {streak > 0
            ? 'Consecutive days with mindful positive entries'
            : 'Log your feelings today to build your streak'}
        </StreakSubtext>
      </StreakCard>
    </SidebarContainer>
  );
};

export default Sidebar;
