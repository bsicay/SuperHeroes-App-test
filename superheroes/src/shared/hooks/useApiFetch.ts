import { useState } from 'react';

interface ApiFetchOptions {
  uri: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  autoRefreshAccessToken?: boolean;
}

export default function useApiFetch() {
  const [loading, setLoading] = useState(false);

  const apiFetch = async ({
    uri,
    method = 'GET',
    body,
    headers = {},
    signal,
    autoRefreshAccessToken = false,
  }: ApiFetchOptions): Promise<Response> => {
    setLoading(true);

    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal,
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      console.log('Making request to:', uri);
      const response = await fetch(uri, config);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      return response;
    } catch (error) {
      console.log('API Fetch error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { apiFetch, loading };
}
