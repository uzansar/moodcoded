import styled from 'styled-components';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';

const Card = styled.div`
  aspect-ratio: 1.05;
  background-color: ${props => props.$hasMood ? props.theme.cardBackground : props.theme.surface};
  border: 1px solid ${props => props.$isToday ? props.theme.accent : props.theme.border};
  border-width: ${props => props.$isToday ? '2px' : '1px'};
  border-radius: 10px;
  padding: 10px;
  cursor: ${props => props.$isFuture ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isFuture ? 0.35 : 1};
  transition: all 0.15s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  ${props => props.$hasMood && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      bottom: 0;
      background-color: ${props.$moodColor};
      border-radius: 10px 0 0 10px;
    }
  `}

  &:hover {
    transform: ${props => props.$isFuture ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isFuture ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.$isFuture ? props.theme.border : props.theme.accent};
  }

  &.empty {
    background-color: transparent;
    border-color: transparent;
    cursor: default;
    opacity: 0.08;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${props => props.$hasMood ? '4px' : '0'};
`;

const DayNumber = styled.span`
  font-size: 0.88rem;
  font-weight: ${props => props.$isToday ? '700' : '600'};
  color: ${props => props.$isToday ? props.theme.accent : props.theme.text};
`;

const TodayMarker = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${props => props.theme.accent};
  color: #FFFFFF;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.4px;
`;

const MoodIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 4px;
`;

const MoodDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  box-shadow: 0 0 6px ${props => props.$color};
`;

const RatingScore = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  font-feature-settings: 'tnum';
`;

const MoodLabelText = styled.span`
  font-size: 0.68rem;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotePreview = styled.p`
  margin: 4px 0 0 4px;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${props => props.theme.textSecondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptySlot = styled.span`
  padding-left: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.textDisabled};
  opacity: 0.4;
`;

const DayCard = ({
  day,
  mood,
  onClick,
  isEmpty = false,
  isDark = true,
  isToday = false,
  isFuture = false,
  theme = {}
}) => {
  if (isEmpty) {
    return <Card className="empty" theme={theme} />;
  }

  const moodRating = mood?.rating;
  const moodColor = moodRating ? getMoodColor(moodRating, isDark) : 'transparent';
  const label = moodRating ? getMoodLabel(moodRating) : '';

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

  return (
    <Card
      $hasMood={Boolean(moodRating)}
      $moodColor={moodColor}
      $isToday={isToday}
      $isFuture={isFuture}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isFuture ? undefined : 'button'}
      tabIndex={isFuture ? -1 : 0}
      aria-label={`Day ${day}: ${moodRating ? `${label} (${moodRating}/10)` : 'No entry'}`}
      theme={theme}
    >
      <HeaderRow $hasMood={Boolean(moodRating)}>
        <DayNumber $isToday={isToday} theme={theme}>{day}</DayNumber>
        {isToday && <TodayMarker theme={theme}>Today</TodayMarker>}
      </HeaderRow>

      {moodRating ? (
        <div>
          <MoodIndicator>
            <MoodDot $color={moodColor} />
            <RatingScore theme={theme}>{moodRating}</RatingScore>
            <MoodLabelText theme={theme}>{label}</MoodLabelText>
          </MoodIndicator>
          {mood.entry && <NotePreview theme={theme}>{mood.entry}</NotePreview>}
        </div>
      ) : (
        <EmptySlot theme={theme}>—</EmptySlot>
      )}
    </Card>
  );
};

export default DayCard;
