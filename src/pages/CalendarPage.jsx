import { useState, useMemo } from 'react';
import styled from 'styled-components';
import Calendar from '../components/Calendar';
import StatsPanel from '../components/StatsPanel';
import JournalHistory from '../components/JournalHistory';
import MoodModal from '../components/MoodModal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import useMoodData from '../hooks/useMoodData';
import { formatDate } from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/moodUtils';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
`;

const MainContentArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentScroller = styled.main`
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ChipFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const FilterChip = styled.button`
  background-color: ${props => props.$active ? props.theme.chipActiveBg : props.theme.chipBg};
  color: ${props => props.$active ? props.theme.chipActiveText : props.theme.text};
  border: 1px solid ${props => props.$active ? 'transparent' : props.theme.border};
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.$active ? props.theme.chipActiveBg : props.theme.chipHover};
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
`;

const ErrorAlert = styled.div`
  background-color: rgba(229, 57, 53, 0.12);
  border: 1px solid #e53935;
  border-radius: 8px;
  padding: 16px;
  color: #e53935;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
`;

const CalendarPage = () => {
  const { theme } = useTheme();
  const { moods, saveMood, deleteMood, loading, error } = useMoodData();

  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'analytics' | 'history'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'high' | 'low' | 'withNotes'

  // Modal State
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDate = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDate(new Date()), []);
  const currentStreak = useMemo(() => calculateCurrentStreak(moods, currentDate), [moods, currentDate]);

  const handleOpenDate = (dateString) => {
    setSelectedDate(dateString);
    setIsModalOpen(true);
  };

  const handleQuickLog = () => {
    setSelectedDate(todayStr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // Filter moods based on search and chip filter
  const filteredMoods = useMemo(() => {
    if (!moods) return {};
    let result = { ...moods };

    if (filterMode === 'high') {
      result = Object.fromEntries(Object.entries(result).filter(([, m]) => m?.rating >= 7));
    } else if (filterMode === 'low') {
      result = Object.fromEntries(Object.entries(result).filter(([, m]) => m?.rating && m.rating <= 4));
    } else if (filterMode === 'withNotes') {
      result = Object.fromEntries(Object.entries(result).filter(([, m]) => m?.entry && m.entry.trim().length > 0));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = Object.fromEntries(
        Object.entries(result).filter(([d, m]) => d.includes(q) || m?.entry?.toLowerCase().includes(q))
      );
    }

    return result;
  }, [moods, filterMode, searchQuery]);

  return (
    <LayoutWrapper theme={theme}>
      <Header
        onToggleSidebar={() => {
          setSidebarCollapsed(prev => !prev);
          setMobileMenuOpen(prev => !prev);
        }}
        onQuickLog={handleQuickLog}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MainContentArea>
        <Sidebar
          collapsed={sidebarCollapsed}
          openMobile={mobileMenuOpen}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          streak={currentStreak}
        />

        <ContentScroller theme={theme}>
          {error && (
            <ErrorAlert>
              <span>⚠️</span>
              <div>{error}</div>
            </ErrorAlert>
          )}

          {/* YouTube Studio Filter Chips */}
          <ChipFilterRow>
            <FilterChip
              $active={filterMode === 'all'}
              onClick={() => setFilterMode('all')}
              theme={theme}
            >
              All entries
            </FilterChip>
            <FilterChip
              $active={filterMode === 'high'}
              onClick={() => setFilterMode('high')}
              theme={theme}
            >
              High mood (7–10)
            </FilterChip>
            <FilterChip
              $active={filterMode === 'low'}
              onClick={() => setFilterMode('low')}
              theme={theme}
            >
              Low mood (1–4)
            </FilterChip>
            <FilterChip
              $active={filterMode === 'withNotes'}
              onClick={() => setFilterMode('withNotes')}
              theme={theme}
            >
              Has diary note
            </FilterChip>
          </ChipFilterRow>

          {loading ? (
            <LoadingCard theme={theme}>Loading your Moodcoded Studio data...</LoadingCard>
          ) : activeTab === 'calendar' ? (
            <TwoColumnLayout>
              <Calendar
                moods={filteredMoods}
                onSelectDate={handleOpenDate}
              />
              <StatsPanel moods={moods} currentDate={currentDate} />
            </TwoColumnLayout>
          ) : activeTab === 'analytics' ? (
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              <StatsPanel moods={moods} currentDate={currentDate} />
            </div>
          ) : (
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              <JournalHistory
                moods={filteredMoods}
                onSelectDate={handleOpenDate}
                filterText={searchQuery}
              />
            </div>
          )}
        </ContentScroller>
      </MainContentArea>

      {/* Modern Overlay Modal */}
      <MoodModal
        date={selectedDate}
        initialMood={selectedDate ? moods[selectedDate] : null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={saveMood}
        onDelete={deleteMood}
      />
    </LayoutWrapper>
  );
};

export default CalendarPage;
