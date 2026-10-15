import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  formatDate
} from '../utils/dateUtils';
import DayCard from './DayCard';
import { useTheme } from '../context/ThemeContext';

const CalendarContainer = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const MonthYearTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  flex: 1;
  text-align: center;
`;

const NavButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const NavButton = styled.button`
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TodayButton = styled.button`
  background: transparent;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  padding: 0 1rem;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    color: ${props => props.theme.accent};
  }
`;

const DayNamesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DayName = styled.div`
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.text};
  opacity: 0.7;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
`;

const Calendar = ({ moods }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
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

  const handleDayClick = (day) => {
    const dateString = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    if (dateString > todayStr) return; // Disallow future dates
    navigate(`/day/${dateString}`);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create array of days to display (empty cells for previous month)
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <CalendarContainer theme={theme}>
      <CalendarHeader>
        <NavButtonGroup>
          <NavButton onClick={handlePrevMonth} aria-label="Previous Month" theme={theme}>
            ‹
          </NavButton>
          <TodayButton onClick={handleTodayClick} theme={theme}>
            Today
          </TodayButton>
        </NavButtonGroup>

        <MonthYearTitle theme={theme}>
          {monthName} {currentDate.getFullYear()}
        </MonthYearTitle>

        <NavButton onClick={handleNextMonth} aria-label="Next Month" theme={theme}>
          ›
        </NavButton>
      </CalendarHeader>

      <DayNamesRow theme={theme}>
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
              onClick={() => handleDayClick(day)}
              isDark={isDark}
              isToday={isToday}
              isFuture={isFuture}
              theme={theme}
            />
          );
        })}
      </DaysGrid>
    </CalendarContainer>
  );
};

export default Calendar;
