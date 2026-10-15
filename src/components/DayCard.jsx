import styled from 'styled-components';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';

const DayCardContainer = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${props => props.$isToday ? props.theme.accent : props.theme.border};
  border-width: ${props => props.$isToday ? '2px' : '1px'};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: ${props => props.$isFuture ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isFuture ? 0.4 : 1};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.$backgroundColor};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${props => props.$isFuture ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.$isFuture ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: ${props => props.$isFuture ? 'none' : 'scale(0.95)'};
  }

  &.empty {
    background-color: ${props => props.theme.cardBackground};
    cursor: default;
    opacity: 0.2;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DayNumber = styled.div`
  font-weight: bold;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const TodayBadge = styled.span`
  font-size: 0.6rem;
  background-color: ${props => props.theme.accent};
  color: white;
  padding: 1px 4px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
`;

const MoodRating = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.$isDark ? '#f0f0f0' : '#333'};
  text-align: center;
`;

const MoodLabel = styled.div`
  font-size: 0.65rem;
  color: ${props => props.$isDark ? '#e0e0e0' : '#555'};
  text-align: center;
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: 600;
`;

const DayCard = ({
  day,
  mood,
  onClick,
  isEmpty = false,
  isDark = false,
  isToday = false,
  isFuture = false,
  theme = {}
}) => {
  if (isEmpty) {
    return <DayCardContainer className="empty" theme={theme} />;
  }

  const backgroundColor = mood?.rating ? getMoodColor(mood.rating, isDark) : theme.cardBackground;
  const label = mood?.rating ? getMoodLabel(mood.rating) : '';

  const handleClick = () => {
    if (!isFuture && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (!isFuture && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const tooltipTitle = isFuture
    ? `Day ${day} (Future date)`
    : mood?.rating
      ? `Day ${day}: ${label} (${mood.rating}/10)`
      : `Day ${day}: No mood logged`;

  return (
    <DayCardContainer
      $backgroundColor={backgroundColor}
      $isToday={isToday}
      $isFuture={isFuture}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isFuture ? undefined : 'button'}
      tabIndex={isFuture ? -1 : 0}
      aria-label={tooltipTitle}
      theme={theme}
      title={tooltipTitle}
    >
      <DayHeader>
        <DayNumber theme={theme}>{day}</DayNumber>
        {isToday && <TodayBadge theme={theme}>Today</TodayBadge>}
      </DayHeader>
      {mood?.rating && (
        <>
          <MoodRating $isDark={isDark}>{mood.rating}</MoodRating>
          <MoodLabel $isDark={isDark}>{label}</MoodLabel>
        </>
      )}
    </DayCardContainer>
  );
};

export default DayCard;
