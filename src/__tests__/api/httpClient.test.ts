import { httpClient } from '@/api/httpClient';

describe('httpClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const resultPromise = httpClient.get('/api/test');
      const result = await resultPromise;

      // GET request 
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });
    
    it('should succeed on retry after network error', async () => {
      const mockData = { id: 1, name: 'Test' };
      const networkError = new Error('Network error');
      
      // Fail twice, then succeed
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const resultPromise = httpClient.get('/api/test');
      
      // Fast-forward through retry delays
      await jest.runAllTimersAsync();

      const result = await resultPromise;
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3); // 2 failures + 1 success
    });

    it('should succeed on retry after 5xx error', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      // Fail once with 500, then succeed
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, status: 503 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const resultPromise = httpClient.get('/api/test');
      
      // Fast-forward through retry delay
      await jest.runAllTimersAsync();

      const result = await resultPromise;
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should parse JSON response correctly', async () => {
      const complexData = {
        id: 1,
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => complexData,
      });

      const result = await httpClient.get('/api/complex');

      expect(result).toEqual(complexData);
    });
  });
});