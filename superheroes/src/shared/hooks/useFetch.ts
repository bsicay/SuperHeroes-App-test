import { useState } from 'react';
import useApiFetch from './useApiFetch';

interface FetchOptions {
  uri: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  toJson?: boolean;
  toBlob?: boolean;
  parse?: boolean;
  removeContentType?: boolean;
  autoRefreshAccessToken?: boolean;
}

export default function useFetch() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { apiFetch } = useApiFetch();

  const callFetch = async ({
    uri,
    method = 'GET',
    body,
    headers,
    signal,
    toJson = true,
    toBlob = false,
    parse = true,
    removeContentType = false,
    autoRefreshAccessToken,
  }: FetchOptions) => {
    setResult(null);
    setError(null);
    setLoading(true);
    
    try {
      const heads = {
        'Content-Type': 'application/json',
        ...headers,
      };
      
      if (removeContentType) delete heads['Content-Type'];

      const reply = await apiFetch({
        uri,
        method,
        body,
        headers: heads,
        signal,
        autoRefreshAccessToken,
      });

      let res;
      if (!parse) res = reply;
      else if (toBlob) res = await reply.blob();
      else if (toJson) res = await reply.json();
      else res = await reply.text();

      setResult(res ?? true);
    } catch (ex: any) {
      console.log('Fetch error:', ex);
      
      let parsedError = null;

      try {
        if (ex.json) {
          parsedError = await ex.json();
        }
      } catch (ex2) {
        // No se pudo convertir el error a json
      }
      
      setError({
        status: ex?.status,
        message: parsedError?.err?.trim() || ex?.message?.trim() || ex?.statusMessage?.trim() || ex?.statusText?.trim() || 'Ocurrió un error.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    callFetch,
    result,
    error,
    loading,
  };
}
