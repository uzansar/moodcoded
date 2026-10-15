import styled from 'styled-components';
import { formatDisplayDate } from '../utils/dateUtils';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';
import { useTheme } from '../context/ThemeContext';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const CountBadge = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.chipBg};
  padding: 3px 10px;
  border-radius: 12px;
`;

const EntryCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    bottom: 0;
    background-color: ${props => props.$color};
  }

  &:hover {
    border-color: ${props => props.theme.accent};
    background-color: ${props => props.theme.surfaceHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const EntryTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const MoodPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  padding: 3px 10px;
  border-radius: 6px;
`;

const RatingText = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const LabelText = styled.span`
  font-size: 0.78rem;
  color: ${props => props.theme.textSecondary};
`;

const NoteContent = styled.p`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: ${props => props.theme.textSecondary};
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px dashed ${props => props.theme.border};
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const JournalHistory = ({ moods = {}, onSelectDate, filterText = '' }) => {
  const { theme, isDark } = useTheme();

  const entries = Object.entries(moods)
    .filter(([date, mood]) => {
      if (!mood?.rating) return false;
      if (!filterText) return true;
      const query = filterText.toLowerCase();
      const dateMatch = date.toLowerCase().includes(query);
      const textMatch = mood.entry?.toLowerCase().includes(query);
      return dateMatch || textMatch;
    })
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  if (entries.length === 0) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <Title theme={theme}>Journal Reflections</Title>
        </HistoryHeader>
        <EmptyState theme={theme}>
          <div style={{ fontSize: '2rem' }}>🌿</div>
          <div style={{ fontWeight: 600, color: theme.text, fontSize: '1rem' }}>No reflections found</div>
          <div style={{ fontSize: '0.85rem', maxWidth: 360 }}>
            {filterText
              ? 'No reflections matched your search term.'
              : 'Take a quiet moment to record your thoughts and build your personal journal.'}
          </div>
        </EmptyState>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <Title theme={theme}>Journal Reflections</Title>
        <CountBadge theme={theme}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</CountBadge>
      </HistoryHeader>

      {entries.map(([date, mood]) => {
        const color = getMoodColor(mood.rating, isDark);
        const label = getMoodLabel(mood.rating);

        return (
          <EntryCard
            key={date}
            $color={color}
            onClick={() => onSelectDate(date)}
            theme={theme}
          >
            <EntryTop>
              <DateText theme={theme}>{formatDisplayDate(date)}</DateText>
              <MoodPill theme={theme}>
                <RatingText $color={color}>{mood.rating}/10</RatingText>
                <LabelText theme={theme}>{label}</LabelText>
              </MoodPill>
            </EntryTop>
            {mood.entry ? (
              <NoteContent theme={theme}>{mood.entry}</NoteContent>
            ) : (
              <span style={{ fontSize: '0.78rem', color: theme.textDisabled, fontStyle: 'italic' }}>
                No note recorded for this day
              </span>
            )}
          </EntryCard>
        );
      })}
    </HistoryContainer>
  );
};

export default JournalHistory;
