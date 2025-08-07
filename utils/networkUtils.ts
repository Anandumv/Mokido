import { errorHandler } from './errorHandler';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

/**
 * Retry a function with exponential backoff
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        // Final attempt failed, throw the error
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
      
      errorHandler.logWarning(
        `Operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
        { additionalData: { error: lastError.message, attempt, delay } }
      );
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

/**
 * Check if an error is network-related
 */
export const isNetworkError = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('offline') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError' // Often thrown by fetch when offline
  );
};

/**
 * Check if device is online (web only)
 */
export const isOnline = (): boolean => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if we can't check
};

/**
 * Wait for network to be available
 */
export const waitForNetwork = (timeout: number = 30000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    
    const checkConnection = () => {
      if (isOnline()) {
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        resolve(false);
      } else {
        setTimeout(checkConnection, 1000);
      }
    };

    checkConnection();
  });
};