
import { useState, useEffect, useCallback } from 'react';
import { DAILY_IMAGE_LIMIT } from '../constants';

const STORAGE_KEY = 'dreamforge_daily_limit';

interface LimitInfo {
  count: number;
  lastReset: number;
}

export const useDailyLimit = () => {
  const [limitInfo, setLimitInfo] = useState<LimitInfo>({ count: 0, lastReset: Date.now() });

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    
    if (storedData) {
      const parsedData: LimitInfo = JSON.parse(storedData);
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (now - parsedData.lastReset > oneDay) {
        // Reset the limit
        const newLimitInfo = { count: 0, lastReset: now };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLimitInfo));
        setLimitInfo(newLimitInfo);
      } else {
        setLimitInfo(parsedData);
      }
    } else {
      // Initialize storage
      const newLimitInfo = { count: 0, lastReset: now };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLimitInfo));
      setLimitInfo(newLimitInfo);
    }
  }, []);

  const incrementCount = useCallback((amount: number) => {
    setLimitInfo(prev => {
      const newCount = prev.count + amount;
      const newLimitInfo = { ...prev, count: newCount };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLimitInfo));
      return newLimitInfo;
    });
  }, []);

  const isLimitReached = limitInfo.count >= DAILY_IMAGE_LIMIT;
  const remaining = DAILY_IMAGE_LIMIT - limitInfo.count;

  return { limitInfo, incrementCount, isLimitReached, remaining };
};

const AUTH_STORAGE_KEY = 'dreamforge_auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return storedAuth ? JSON.parse(storedAuth) : false;
    } catch (e) {
      console.error("Failed to load auth state from localStorage", e);
      return false;
    }
  });

  const login = useCallback(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(false));
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, login, logout };
};
