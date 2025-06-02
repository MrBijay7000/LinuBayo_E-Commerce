import { useCallback, useEffect, useRef, useState } from "react";

export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        // Remove the abort controller from the array
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        // Don't set error for aborted requests
        if (err.name !== "AbortError") {
          setError(err.message);
          setIsLoading(false);
        }
        throw err;
      }
    },
    []
  );

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      // Abort all pending requests on unmount
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
      activeHttpRequests.current = [];
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
