/**
 * Custom React Hook for API Data Management
 * Provides caching, loading states, error handling, and automatic retries
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cache utilities
 */
const getCacheKey = (url, params) => {
  return `${url}${params ? `?${JSON.stringify(params)}` : ''}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Custom hook for API data fetching with caching
 */
export const useApi = (url, options = {}) => {
  const {
    immediate = true,
    cache: enableCache = true,
    retries = 3,
    retryDelay = 1000,
    params = null,
    dependencies = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  const cacheKey = getCacheKey(url, params);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (enableCache && !forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        setError(null);
        return cachedData;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      let fetchUrl = url;
      if (params) {
        const searchParams = new URLSearchParams(params);
        fetchUrl = `${url}?${searchParams.toString()}`;
      }

      const response = await fetch(fetchUrl, {
        headers,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      if (enableCache) {
        setCachedData(cacheKey, result);
      }

      setData(result);
      setError(null);
      retryCountRef.current = 0;
      
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      console.error(`API Error (${url}):`, err);
      
      // Retry logic
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(forceRefresh);
        }, retryDelay * retryCountRef.current);
        return;
      }

      setError(err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey, enableCache, retries, retryDelay, params]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const mutate = useCallback((newData) => {
    setData(newData);
    if (enableCache) {
      setCachedData(cacheKey, newData);
    }
  }, [cacheKey, enableCache]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh,
    mutate,
    fetch: fetchData,
  };
};

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export const useMutation = (url, options = {}) => {
  const { method = 'POST', onSuccess, onError } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      console.error(`Mutation Error (${method} ${url}):`, err);
      setError(err.message || 'An error occurred');
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError]);

  return {
    mutate,
    loading,
    error,
  };
};

/**
 * Hook for paginated data
 */
export const usePaginatedApi = (url, options = {}) => {
  const { pageSize = 10, ...apiOptions } = options;
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);

  const params = {
    page,
    limit: pageSize,
    ...apiOptions.params,
  };

  const { data, loading, error, refresh } = useApi(url, {
    ...apiOptions,
    params,
    dependencies: [page, pageSize],
  });

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllData(data.data || data);
      } else {
        setAllData(prev => [...prev, ...(data.data || data)]);
      }
    }
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (!loading && data && (data.hasMore || data.data?.length === pageSize)) {
      setPage(prev => prev + 1);
    }
  }, [loading, data, pageSize]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    refresh();
  }, [refresh]);

  return {
    data: allData,
    loading,
    error,
    loadMore,
    reset,
    hasMore: data?.hasMore || false,
    totalCount: data?.total || allData.length,
  };
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Clear specific cache entry
 */
export const clearCacheEntry = (url, params = null) => {
  const key = getCacheKey(url, params);
  cache.delete(key);
};

export default useApi;