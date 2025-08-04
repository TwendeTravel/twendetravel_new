import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  FirestoreError,
  writeBatch,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { toast } from '@/hooks/use-toast';

/**
 * Generic Firestore service for CRUD operations
 */
export class FirestoreService<T extends { id: string }> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Get collection reference
   */
  private getCollectionRef() {
    return collection(db, this.collectionName);
  }

  /**
   * Get document reference
   */
  private getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.getCollectionRef(), docData);
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Failed to create document');
      }

      return {
        id: newDoc.id,
        ...newDoc.data(),
      } as T;
    } catch (error) {
      this.handleError('create', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T;
    } catch (error) {
      this.handleError('getById', error);
      throw error;
    }
  }

  /**
   * Get all documents
   */
  async getAll(): Promise<T[]> {
    try {
      const querySnap = await getDocs(this.getCollectionRef());
      return querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      this.handleError('getAll', error);
      throw error;
    }
  }

  /**
   * Get documents with query constraints
   */
  async getWithQuery(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(this.getCollectionRef(), ...constraints);
      const querySnap = await getDocs(q);
      return querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error: any) {
      // Handle network errors gracefully
      if (error.code === 'unavailable' || error.code === 'failed-precondition' || 
          error.message?.includes('offline') || error.message?.includes('network')) {
        console.warn(`Network unavailable for getWithQuery on ${this.collectionName}, returning empty array`);
        return []; // Return empty array instead of throwing
      }
      this.handleError('getWithQuery', error);
      throw error;
    }
  }

  /**
   * Update document
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T> {
    try {
      const docRef = this.getDocRef(id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await getDoc(docRef);
      
      if (!updatedDoc.exists()) {
        throw new Error('Document not found after update');
      }

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as T;
    } catch (error) {
      this.handleError('update', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      this.handleError('delete', error);
      throw error;
    }
  }

  /**
   * Subscribe to document changes
   */
  subscribeToDoc(id: string, callback: (doc: T | null) => void): () => void {
    const docRef = this.getDocRef(id);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            id: docSnap.id,
            ...docSnap.data(),
          } as T);
        } else {
          callback(null);
        }
      },
      (error) => this.handleError('subscribeToDoc', error)
    );
  }

  /**
   * Subscribe to collection changes
   */
  subscribeToCollection(
    callback: (docs: T[]) => void,
    constraints: QueryConstraint[] = []
  ): () => void {
    const q = constraints.length > 0 
      ? query(this.getCollectionRef(), ...constraints)
      : this.getCollectionRef();
    
    return onSnapshot(
      q,
      (querySnap) => {
        const docs = querySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        callback(docs);
      },
      (error) => this.handleError('subscribeToCollection', error)
    );
  }

  /**
   * Batch operations
   */
  async batchOperations(operations: Array<{
    type: 'create' | 'update' | 'delete';
    id?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();

      for (const operation of operations) {
        switch (operation.type) {
          case 'create':
            const newDocRef = doc(this.getCollectionRef());
            batch.set(newDocRef, {
              ...operation.data,
              createdAt: now,
              updatedAt: now,
            });
            break;
          
          case 'update':
            if (!operation.id) throw new Error('ID required for update operation');
            const updateDocRef = this.getDocRef(operation.id);
            batch.update(updateDocRef, {
              ...operation.data,
              updatedAt: now,
            });
            break;
          
          case 'delete':
            if (!operation.id) throw new Error('ID required for delete operation');
            const deleteDocRef = this.getDocRef(operation.id);
            batch.delete(deleteDocRef);
            break;
        }
      }

      await batch.commit();
    } catch (error) {
      this.handleError('batchOperations', error);
      throw error;
    }
  }

  /**
   * Count documents
   */
  async count(constraints: QueryConstraint[] = []): Promise<number> {
    try {
      const q = constraints.length > 0 
        ? query(this.getCollectionRef(), ...constraints)
        : this.getCollectionRef();
      
      const querySnap = await getDocs(q);
      return querySnap.size;
    } catch (error) {
      this.handleError('count', error);
      throw error;
    }
  }

  /**
   * Paginated query
   */
  async getPaginated(
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot,
    constraints: QueryConstraint[] = []
  ): Promise<{ docs: T[]; lastDoc?: DocumentSnapshot; hasMore: boolean }> {
    try {
      const queryConstraints = [...constraints, limit(pageSize + 1)];
      
      if (lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }

      const q = query(this.getCollectionRef(), ...queryConstraints);
      const querySnap = await getDocs(q);
      
      const docs = querySnap.docs.slice(0, pageSize).map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));

      const hasMore = querySnap.docs.length > pageSize;
      const newLastDoc = hasMore ? querySnap.docs[pageSize - 1] : undefined;

      return {
        docs,
        lastDoc: newLastDoc,
        hasMore,
      };
    } catch (error) {
      this.handleError('getPaginated', error);
      throw error;
    }
  }

  /**
   * Handle errors consistently
   */
  private handleError(operation: string, error: any): void {
    console.error(`FirestoreService ${this.collectionName} ${operation} error:`, error);
    
    const errorMessage = error instanceof FirestoreError 
      ? this.getFirestoreErrorMessage(error)
      : error.message || 'An unexpected error occurred';

    toast({
      title: `Error in ${operation}`,
      description: errorMessage,
      variant: 'destructive',
    });
  }

  /**
   * Get user-friendly error messages
   */
  private getFirestoreErrorMessage(error: FirestoreError): string {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested document was not found';
      case 'already-exists':
        return 'The document already exists';
      case 'resource-exhausted':
        return 'Too many requests. Please try again later';
      case 'unauthenticated':
        return 'You must be logged in to perform this action';
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again later';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
}

// Helper functions for common Firestore operations
export const firestoreHelpers = {
  /**
   * Convert Firestore Timestamp to JavaScript Date
   */
  timestampToDate: (timestamp: Timestamp): Date => {
    return timestamp.toDate();
  },

  /**
   * Convert JavaScript Date to Firestore Timestamp
   */
  dateToTimestamp: (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
  },

  /**
   * Get current timestamp
   */
  now: (): Timestamp => {
    return Timestamp.now();
  },

  /**
   * Create where constraints
   */
  where: (field: string, operator: any, value: any) => {
    return where(field, operator, value);
  },

  /**
   * Create order by constraints
   */
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => {
    return orderBy(field, direction);
  },

  /**
   * Create limit constraint
   */
  limit: (count: number) => {
    return limit(count);
  },

  /**
   * Sanitize data for Firestore by converting undefined values to null
   * Firestore doesn't accept undefined values, but accepts null
   */
  sanitizeForFirestore: <T extends Record<string, any>>(data: T): T => {
    const sanitized = {} as T;
    
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        (sanitized as any)[key] = null;
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Timestamp)) {
        // Recursively sanitize nested objects
        (sanitized as any)[key] = firestoreHelpers.sanitizeForFirestore(value);
      } else {
        (sanitized as any)[key] = value;
      }
    }
    
    return sanitized;
  },
};
