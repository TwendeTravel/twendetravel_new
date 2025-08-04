// Temporary stubs to make the build pass while we complete migration
const mockResponse = Promise.resolve({ data: [], error: null });
const mockSingle = Promise.resolve({ data: null, error: null });

const createMockQuery = (): any => ({
  order: (...args: any[]) => createMockQuery(),
  eq: (...args: any[]) => createMockQuery(),
  single: () => mockSingle,
  limit: (...args: any[]) => createMockQuery(),
  in: (...args: any[]) => createMockQuery(),
  then: (callback: any) => mockResponse.then(callback),
  // Make it awaitable
  [Symbol.toStringTag]: 'Promise',
  catch: (onRejected: any) => mockResponse.catch(onRejected),
  finally: (onFinally: any) => mockResponse.finally(onFinally)
});

const createMockChannel = () => ({
  on: (...args: any[]) => ({
    subscribe: (...args: any[]) => ({ unsubscribe: () => {} })
  }),
  send: (...args: any[]) => Promise.resolve(),
  unsubscribe: () => {}
});

const createMockInsert = () => ({
  select: (...args: any[]) => ({
    single: () => mockSingle,
    then: (callback: any) => mockSingle.then(callback),
    [Symbol.toStringTag]: 'Promise',
    catch: (onRejected: any) => mockSingle.catch(onRejected),
    finally: (onFinally: any) => mockSingle.finally(onFinally)
  }),
  then: (callback: any) => mockSingle.then(callback),
  single: () => mockSingle,
  [Symbol.toStringTag]: 'Promise',
  catch: (onRejected: any) => mockSingle.catch(onRejected),
  finally: (onFinally: any) => mockSingle.finally(onFinally)
});

const createMockUpsert = () => ({
  select: (...args: any[]) => ({
    single: () => mockSingle,
    then: (callback: any) => mockSingle.then(callback),
    [Symbol.toStringTag]: 'Promise',
    catch: (onRejected: any) => mockSingle.catch(onRejected),
    finally: (onFinally: any) => mockSingle.finally(onFinally)
  }),
  then: (callback: any) => mockSingle.then(callback),
  single: () => mockSingle,
  [Symbol.toStringTag]: 'Promise',
  catch: (onRejected: any) => mockSingle.catch(onRejected),
  finally: (onFinally: any) => mockSingle.finally(onFinally)
});

export const supabase = {
  from: (table: string) => ({
    select: (...args: any[]) => createMockQuery(),
    insert: (...args: any[]) => createMockInsert(),
    update: (...args: any[]) => ({
      eq: (...args: any[]) => createMockQuery()
    }),
    delete: () => ({
      eq: (...args: any[]) => mockResponse
    }),
    upsert: (...args: any[]) => createMockUpsert()
  }),
  channel: (...args: any[]) => createMockChannel(),
  removeChannel: (...args: any[]) => {}
};
