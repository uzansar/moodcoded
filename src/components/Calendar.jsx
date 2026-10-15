import { useState } from 'react';
import styled from 'styled-components';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  formatDate
} from '../utils/dateUtils';
import DayCard from './DayCard';
import { useTheme } from '../context/ThemeContext';

const CalendarWrapper = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const MonthDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  letter-spacing: -0.3px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TodayButton = styled.button`
  background-color: ${props => props.theme.surfaceHover};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  height: 34px;
  padding: 0 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceActive};
    border-color: ${props => props.theme.borderSubtle};
  }
`;

const ArrowNavButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  width: 34px;
  height: 34px;
  border-radius: 6px;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.surfaceHover};
  }
`;

const DayNamesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayName = styled.div`
  text-align: center;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 4px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const Calendar = ({ moods, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { theme, isDark } = useTheme();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = getMonthName(currentDate);

  const today = new Date();
  const todayStr = formatDate(today);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <CalendarWrapper theme={theme}>
      <ControlsBar>
        <MonthDisplay>
          <MonthTitle theme={theme}>
            {monthName} {currentDate.getFullYear()}
          </MonthTitle>
        </MonthDisplay>

        <ButtonGroup>
          <TodayButton onClick={handleTodayClick} theme={theme}>
            Today
          </TodayButton>
          <ArrowNavButton onClick={handlePrevMonth} aria-label="Previous Month" theme={theme}>
            ‹
          </ArrowNavButton>
          <ArrowNavButton onClick={handleNextMonth} aria-label="Next Month" theme={theme}>
            ›
          </ArrowNavButton>
        </ButtonGroup>
      </ControlsBar>

      <DayNamesRow>
        {dayNames.map(day => (
          <DayName key={day} theme={theme}>
            {day}
          </DayName>
        ))}
      </DayNamesRow>

      <DaysGrid>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <DayCard key={`empty-${index}`} isEmpty={true} theme={theme} />;
          }

          const dateString = formatDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          );
          const mood = moods[dateString];
          const isToday = dateString === todayStr;
          const isFuture = dateString > todayStr;

          return (
            <DayCard
              key={day}
              day={day}
              mood={mood}
              onClick={() => onSelectDate?.(dateString)}
              isDark={isDark}
              isToday={isToday}
              isFuture={isFuture}
              theme={theme}
            />
          );
        })}
      </DaysGrid>
    </CalendarWrapper>
  );
};

export default Calendar;
