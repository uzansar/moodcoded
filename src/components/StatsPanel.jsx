import styled from 'styled-components';
import {
  calculateAverageMood,
  getHighestDay,
  getLowestDay,
  getWeeklyTrends,
  calculateBestStreak,
  countMoodsInMonth
} from '../utils/moodUtils';
import { formatDisplayDate, getMonthName } from '../utils/dateUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: ${props => props.theme.text};
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatSubtext = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const StatsPanel = ({ moods, currentDate }) => {
  const { theme } = useTheme();
  const monthMoods = {};
  const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  Object.entries(moods).forEach(([date, mood]) => {
    if (date.startsWith(monthStr)) {
      monthMoods[date] = mood;
    }
  });

  const averageMood = calculateAverageMood(monthMoods);
  const highestDay = getHighestDay(monthMoods);
  const lowestDay = getLowestDay(monthMoods);
  const bestStreak = calculateBestStreak(monthMoods);
  const daysLogged = countMoodsInMonth(monthMoods, currentDate.getFullYear(), currentDate.getMonth() + 1);
  const weeklyTrends = getWeeklyTrends(monthMoods);

  const chartData = Object.entries(weeklyTrends)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([week, avg]) => ({
      week: new Date(week + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: avg
    }));

  return (
    <StatsContainer>
      <StatCard theme={theme}>
        <StatLabel theme={theme}>Average Mood</StatLabel>
        <StatValue theme={theme}>{averageMood.toFixed(1)}/10</StatValue>
        <StatSubtext theme={theme}>for {getMonthName(currentDate)}</StatSubtext>
      </StatCard>

      <GridContainer>
        <StatCard theme={theme}>
          <StatLabel theme={theme}>Best Day</StatLabel>
          <StatValue theme={theme}>{highestDay ? highestDay.rating : '—'}/10</StatValue>
          <StatSubtext theme={theme}>
            {highestDay ? formatDisplayDate(highestDay.date) : 'No mood logged'}
          </StatSubtext>
        </StatCard>

        <StatCard theme={theme}>
          <StatLabel theme={theme}>Lowest Day</StatLabel>
          <StatValue theme={theme}>{lowestDay ? lowestDay.rating : '—'}/10</StatValue>
          <StatSubtext theme={theme}>
            {lowestDay ? formatDisplayDate(lowestDay.date) : 'No mood logged'}
          </StatSubtext>
        </StatCard>
      </GridContainer>

      <GridContainer>
        <StatCard theme={theme}>
          <StatLabel theme={theme}>Best Streak</StatLabel>
          <StatValue theme={theme}>{bestStreak}</StatValue>
          <StatSubtext theme={theme}>consecutive good days (≥5)</StatSubtext>
        </StatCard>

        <StatCard theme={theme}>
          <StatLabel theme={theme}>Days Logged</StatLabel>
          <StatValue theme={theme}>{daysLogged}</StatValue>
          <StatSubtext theme={theme}>mood entries this month</StatSubtext>
        </StatCard>
      </GridContainer>

      {chartData.length > 0 && (
        <StatCard theme={theme}>
          <StatLabel theme={theme}>Weekly Trend</StatLabel>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  stroke={theme.textSecondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke={theme.textSecondary}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.cardBackground,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.text
                  }}
                  formatter={(value) => `${value.toFixed(1)}/10`}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke={theme.accent}
                  dot={{ fill: theme.accent, r: 5 }}
                  activeDot={{ r: 7 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </StatCard>
      )}
    </StatsContainer>
  );
};

export default StatsPanel;
