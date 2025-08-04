// Utility function to retry Firebase operations with exponential backoff
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry certain errors
      if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Firebase operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Specific retry wrapper for auth operations
export async function retryAuthOperation<T>(operation: () => Promise<T>): Promise<T> {
  return retryFirebaseOperation(operation, 2, 500);
}

// Specific retry wrapper for Firestore operations
export async function retryFirestoreOperation<T>(operation: () => Promise<T>): Promise<T> {
  return retryFirebaseOperation(operation, 3, 1000);
}
