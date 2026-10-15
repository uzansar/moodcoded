import styled from 'styled-components';
import {
  calculateAverageMood,
  getHighestDay,
  getWeeklyTrends,
  calculateBestStreak,
  countMoodsInMonth
} from '../utils/moodUtils';
import { formatDisplayDate, getMonthName } from '../utils/dateUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const MetricCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
  }
`;

const MetricLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.theme.textSecondary};
  letter-spacing: 0.4px;
`;

const MetricValue = styled.span`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  font-feature-settings: 'tnum';
`;

const MetricSub = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const ChartCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 220px;
`;

const CustomTooltipBox = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  font-size: 0.82rem;
  color: ${props => props.theme.text};
`;

const StatsPanel = ({ moods, currentDate = new Date() }) => {
  const { theme } = useTheme();
  const monthMoods = {};
  const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  Object.entries(moods || {}).forEach(([date, mood]) => {
    if (date.startsWith(monthStr)) {
      monthMoods[date] = mood;
    }
  });

  const averageMood = calculateAverageMood(monthMoods);
  const highestDay = getHighestDay(monthMoods);
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
    <AnalyticsContainer>
      <SectionHeader>
        <SectionTitle theme={theme}>Monthly Reflection</SectionTitle>
        <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
          {getMonthName(currentDate)}
        </span>
      </SectionHeader>

      <MetricsGrid>
        <MetricCard theme={theme}>
          <MetricLabel theme={theme}>Average Mood</MetricLabel>
          <MetricValue theme={theme}>
            {averageMood > 0 ? averageMood.toFixed(1) : '—'}
            {averageMood > 0 && <span style={{ fontSize: '0.95rem', fontWeight: 500, color: theme.textSecondary }}>/10</span>}
          </MetricValue>
          <MetricSub theme={theme}>Monthly overall baseline</MetricSub>
        </MetricCard>

        <MetricCard theme={theme}>
          <MetricLabel theme={theme}>Days Tracked</MetricLabel>
          <MetricValue theme={theme}>{daysLogged}</MetricValue>
          <MetricSub theme={theme}>Reflections logged</MetricSub>
        </MetricCard>

        <MetricCard theme={theme}>
          <MetricLabel theme={theme}>Best Streak</MetricLabel>
          <MetricValue theme={theme}>
            {bestStreak} <span style={{ fontSize: '1rem' }}>🔥</span>
          </MetricValue>
          <MetricSub theme={theme}>Consecutive good days</MetricSub>
        </MetricCard>

        <MetricCard theme={theme}>
          <MetricLabel theme={theme}>Peak Day</MetricLabel>
          <MetricValue theme={theme}>{highestDay ? `${highestDay.rating}/10` : '—'}</MetricValue>
          <MetricSub theme={theme}>
            {highestDay ? formatDisplayDate(highestDay.date) : 'No entries'}
          </MetricSub>
        </MetricCard>
      </MetricsGrid>

      {chartData.length > 0 && (
        <ChartCard theme={theme}>
          <ChartHeader>
            <ChartTitle theme={theme}>Weekly Emotional Flow</ChartTitle>
            <span style={{ fontSize: '0.75rem', color: theme.accent, fontWeight: 600 }}>Weekly Avg</span>
          </ChartHeader>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.accent} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                <XAxis dataKey="week" stroke={theme.textSecondary} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} stroke={theme.textSecondary} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <CustomTooltipBox theme={theme}>
                          <div style={{ fontWeight: 600, marginBottom: 3 }}>{label}</div>
                          <div>Avg rating: <strong style={{ color: theme.accent }}>{payload[0].value}/10</strong></div>
                        </CustomTooltipBox>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke={theme.accent}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                  dot={{ fill: theme.accent, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </ChartCard>
      )}
    </AnalyticsContainer>
  );
};

export default StatsPanel;
