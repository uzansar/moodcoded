import { formatDate } from './dateUtils';
import { lightTheme, darkTheme } from '../styles/theme';

export const getMoodColor = (rating, isDark = true) => {
  if (!rating || rating < 1 || rating > 10) {
    return isDark ? '#272727' : '#E5E5E5';
  }
  const palette = isDark ? darkTheme.moodColors : lightTheme.moodColors;
  return palette[rating] || (isDark ? '#272727' : '#E5E5E5');
};

export const getMoodLabel = (rating) => {
  if (rating <= 2) return 'Very Low';
  if (rating <= 4) return 'Low';
  if (rating <= 6) return 'Neutral';
  if (rating <= 8) return 'Good';
  return 'Great';
};

export const calculateAverageMood = (moods) => {
  if (!moods || Object.keys(moods).length === 0) return 0;
  const ratings = Object.values(moods).map(m => m?.rating).filter(Boolean);
  if (ratings.length === 0) return 0;
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(average * 10) / 10;
};

export const getHighestDay = (moods) => {
  let highest = null;
  let maxRating = 0;
  Object.entries(moods || {}).forEach(([date, mood]) => {
    if (mood?.rating > maxRating) {
      maxRating = mood.rating;
      highest = { date, rating: mood.rating };
    }
  });
  return highest;
};

export const getLowestDay = (moods) => {
  let lowest = null;
  let minRating = 11;
  Object.entries(moods || {}).forEach(([date, mood]) => {
    if (mood?.rating && mood.rating < minRating) {
      minRating = mood.rating;
      lowest = { date, rating: mood.rating };
    }
  });
  return lowest;
};

export const getWeeklyTrends = (moods) => {
  const weeks = {};
  Object.entries(moods || {}).forEach(([dateStr, mood]) => {
    if (!mood?.rating) return;
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = formatDate(weekStart);
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(mood.rating);
  });

  const trends = {};
  Object.entries(weeks).forEach(([week, ratings]) => {
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    trends[week] = Math.round(avg * 10) / 10;
  });

  return trends;
};

export const calculateCurrentStreak = (moods, currentDate) => {
  let streak = 0;
  let checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  while (true) {
    const dateStr = formatDate(checkDate);
    const mood = moods?.[dateStr];
    
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
  const goodDates = Object.entries(moods || {})
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
  return Object.keys(moods || {}).filter(date => moods[date]?.rating).length;
};

export const countMoodsInMonth = (moods, year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return Object.keys(moods || {})
    .filter(date => date.startsWith(monthStr))
    .filter(date => moods[date]?.rating)
    .length;
};

export const getDaysInMonth = countMoodsInMonth;
