/**
 * Mood utility functions for calculations, color mapping, and stats
 */
import { formatDate } from './dateUtils';

const MOOD_COLORS = {
  light: {
    1: '#FFB6C6', // Very Bad - light pink-red
    2: '#FFB6C6',
    3: '#FFD4A3', // Bad - light orange
    4: '#FFD4A3',
    5: '#FFFFBA', // Neutral - pale yellow
    6: '#FFFFBA',
    7: '#B6F5B6', // Good - light green
    8: '#B6F5B6',
    9: '#A8D5FF', // Great - light blue
    10: '#A8D5FF'
  },
  dark: {
    1: '#FF6B8A', // Very Bad - darker pink-red
    2: '#FF6B8A',
    3: '#FFB347', // Bad - darker orange
    4: '#FFB347',
    5: '#FFD700', // Neutral - darker yellow
    6: '#FFD700',
    7: '#6FCF97', // Good - darker green
    8: '#6FCF97',
    9: '#4A9EFF', // Great - darker blue
    10: '#4A9EFF'
  }
};

export const getMoodColor = (rating, isDark = false) => {
  if (!rating || rating < 1 || rating > 10) {
    return isDark ? '#555555' : '#F0F0F0';
  }
  return isDark ? MOOD_COLORS.dark[rating] : MOOD_COLORS.light[rating];
};

export const getMoodLabel = (rating) => {
  if (rating <= 2) return 'Very Bad';
  if (rating <= 4) return 'Bad';
  if (rating <= 6) return 'Neutral';
  if (rating <= 8) return 'Good';
  return 'Great';
};

export const calculateAverageMood = (moods) => {
  if (Object.keys(moods).length === 0) return 0;
  const ratings = Object.values(moods).map(m => m.rating).filter(r => r);
  if (ratings.length === 0) return 0;
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal
};

export const getHighestDay = (moods) => {
  let highest = null;
  let maxRating = 0;
  Object.entries(moods).forEach(([date, mood]) => {
    if (mood.rating > maxRating) {
      maxRating = mood.rating;
      highest = { date, rating: mood.rating };
    }
  });
  return highest;
};

export const getLowestDay = (moods) => {
  let lowest = null;
  let minRating = 11;
  Object.entries(moods).forEach(([date, mood]) => {
    if (mood.rating < minRating) {
      minRating = mood.rating;
      lowest = { date, rating: mood.rating };
    }
  });
  return lowest;
};

export const getWeeklyTrends = (moods) => {
  // Group moods by week (Sunday to Saturday)
  const weeks = {};
  Object.entries(moods).forEach(([dateStr, mood]) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Set to Sunday
    const weekKey = formatDate(weekStart);
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(mood.rating);
  });

  // Calculate average for each week
  const trends = {};
  Object.entries(weeks).forEach(([week, ratings]) => {
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    trends[week] = Math.round(avg * 10) / 10;
  });

  return trends;
};

export const calculateCurrentStreak = (moods, currentDate) => {
  // Count consecutive days with mood rating >= 5 from today backwards
  let streak = 0;
  let checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  while (true) {
    const dateStr = formatDate(checkDate);
    const mood = moods[dateStr];
    
    if (mood && mood.rating >= 5) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const calculateBestStreak = (moods) => {
  // Find the longest streak of consecutive calendar days with mood >= 5
  const goodDates = Object.entries(moods)
    .filter(([, mood]) => mood && mood.rating >= 5)
    .map(([dateStr]) => dateStr)
    .sort();

  if (goodDates.length === 0) return 0;

  let currentStreak = 0;
  let bestStreak = 0;
  let prevDate = null;

  for (const dateStr of goodDates) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (!prevDate) {
      currentStreak = 1;
    } else {
      const diffTime = date.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    bestStreak = Math.max(bestStreak, currentStreak);
    prevDate = date;
  }

  return bestStreak;
};

export const getDaysWithMood = (moods) => {
  return Object.keys(moods).filter(date => moods[date].rating).length;
};

export const countMoodsInMonth = (moods, year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return Object.keys(moods)
    .filter(date => date.startsWith(monthStr))
    .filter(date => moods[date].rating)
    .length;
};

// Backwards compatibility alias
export const getDaysInMonth = countMoodsInMonth;
