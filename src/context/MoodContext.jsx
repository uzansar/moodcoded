import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const MoodContext = createContext(null);

export const MoodProvider = ({ children }) => {
  const { user } = useAuth();
  const [moods, setMoods] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch moods from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setMoods({});
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchMoods = async () => {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;

        if (isMounted) {
          const moodsByDate = {};
          if (data && Array.isArray(data)) {
            data.forEach(mood => {
              moodsByDate[mood.date] = {
                rating: mood.rating,
                entry: mood.entry,
                timestamp: mood.timestamp,
              };
            });
          }
          setMoods(moodsByDate);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch moods:', err);
        if (isMounted) {
          setError('Failed to load mood data. Please check your connection.');
          setLoading(false);
        }
      }
    };

    fetchMoods();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`moods-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moods',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setMoods(prev => ({
              ...prev,
              [payload.new.date]: {
                rating: payload.new.rating,
                entry: payload.new.entry,
                timestamp: payload.new.timestamp,
              },
            }));
          } else if (payload.eventType === 'DELETE') {
            setMoods(prev => {
              const updated = { ...prev };
              delete updated[payload.old.date];
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  const getMood = useCallback((dateString) => {
    return moods[dateString] || null;
  }, [moods]);

  const saveMood = useCallback(async (dateString, rating, entry = '') => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setError(null);
      const moodData = {
        user_id: user.id,
        date: dateString,
        rating: Math.max(1, Math.min(10, rating)),
        entry: entry.trim(),
        timestamp: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('moods')
        .upsert([moodData], { onConflict: 'user_id,date' });

      if (upsertError) throw upsertError;

      setMoods(prev => ({
        ...prev,
        [dateString]: {
          rating: moodData.rating,
          entry: moodData.entry,
          timestamp: moodData.timestamp,
        },
      }));
      return { success: true };
    } catch (err) {
      console.error('Failed to save mood:', err);
      const message = 'Failed to save mood. Please check your connection and try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, [user]);

  const deleteMood = useCallback(async (dateString) => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('moods')
        .delete()
        .eq('user_id', user.id)
        .eq('date', dateString);

      if (deleteError) throw deleteError;

      setMoods(prev => {
        const updated = { ...prev };
        delete updated[dateString];
        return updated;
      });
      return { success: true };
    } catch (err) {
      console.error('Failed to delete mood:', err);
      const message = 'Failed to delete mood. Please check your connection and try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, [user]);

  const getMoodsForMonth = useCallback((year, month) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthMoods = {};
    Object.entries(moods).forEach(([date, mood]) => {
      if (date.startsWith(monthStr)) {
        monthMoods[date] = mood;
      }
    });
    return monthMoods;
  }, [moods]);

  const clearAllMoods = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    if (!confirm('Are you sure? This will delete all mood data.')) {
      return { success: false, cancelled: true };
    }

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('moods')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setMoods({});
      return { success: true };
    } catch (err) {
      console.error('Failed to clear moods:', err);
      const message = 'Failed to clear moods. Please check your connection and try again.';
      setError(message);
      return { success: false, error: message };
    }
  }, [user]);

  const value = useMemo(() => ({
    moods,
    getMood,
    saveMood,
    deleteMood,
    getMoodsForMonth,
    clearAllMoods,
    loading,
    error,
  }), [moods, getMood, saveMood, deleteMood, getMoodsForMonth, clearAllMoods, loading, error]);

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
