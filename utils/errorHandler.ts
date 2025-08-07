interface ErrorContext {
  userId?: string;
  action?: string;
  component?: string;
  additionalData?: Record<string, any>;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: ErrorContext;
  userAgent?: string;
  url?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(
          new Error(`Unhandled Promise Rejection: ${event.reason}`),
          { action: 'unhandled_promise_rejection' }
        );
      });

      // Handle JavaScript errors
      window.addEventListener('error', (event) => {
        this.logError(
          new Error(event.message),
          { 
            action: 'javascript_error',
            additionalData: {
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          }
        );
      });
    }
  }

  logError(error: Error, context?: ErrorContext): void {
    const errorLog: ErrorLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addLog(errorLog);
    console.error('🚨 Error logged:', errorLog);

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { contexts: { custom: context } });
  }

  logWarning(message: string, context?: ErrorContext): void {
    const warningLog: ErrorLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.addLog(warningLog);
    console.warn('⚠️ Warning logged:', warningLog);
  }

  logInfo(message: string, context?: ErrorContext): void {
    const infoLog: ErrorLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };

    this.addLog(infoLog);
    console.info('ℹ️ Info logged:', infoLog);
  }

  private addLog(log: ErrorLog): void {
    this.errorLogs.unshift(log);
    
    // Keep only the most recent logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogs);
    }
  }

  getRecentErrors(count: number = 10): ErrorLog[] {
    return this.errorLogs.slice(0, count);
  }

  clearLogs(): void {
    this.errorLogs = [];
  }

  // Helper method to create user-friendly error messages
  getUserFriendlyMessage(error: Error, context?: ErrorContext): string {
    const errorMessage = error.message.toLowerCase();

    // Network-related errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }

    // Authentication errors
    if (errorMessage.includes('invalid_credentials') || errorMessage.includes('invalid login')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }

    if (errorMessage.includes('user_not_found')) {
      return 'No account found with this email address. Please check your email or create a new account.';
    }

    if (errorMessage.includes('email_already_exists')) {
      return 'An account with this email already exists. Please try logging in instead.';
    }

    // Database errors
    if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
      return 'This information already exists. Please try with different details.';
    }

    // Validation errors
    if (errorMessage.includes('invalid input') || errorMessage.includes('validation')) {
      return 'Please check your input and try again.';
    }

    // Wallet connection errors
    if (errorMessage.includes('phantom') || errorMessage.includes('wallet')) {
      return 'Wallet connection failed. Please make sure Phantom wallet is installed and try again.';
    }

    // Generic fallback
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error handling patterns
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: ErrorContext,
  showUserError: boolean = true
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    errorHandler.logError(err, context);
    
    const userMessage = showUserError ? errorHandler.getUserFriendlyMessage(err, context) : undefined;
    
    return { 
      success: false, 
      error: userMessage || err.message 
    };
  }
};

export const handleAsyncError = (error: unknown, context?: ErrorContext): string => {
  const err = error instanceof Error ? error : new Error(String(error));
  errorHandler.logError(err, context);
  return errorHandler.getUserFriendlyMessage(err, context);
};