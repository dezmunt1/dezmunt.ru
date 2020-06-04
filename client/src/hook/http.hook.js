import { useState, useCallback } from 'react'

export const useHttp = () => {
  const [ loading, setLoading ] = useState( null );
  const [ error, setError ] = useState( null );

  const request = useCallback( async ( url, method = 'GET', body = null, headers = {} ) => {
    setLoading( true );
    try {
      if ( body ) {
        body = JSON.stringify( body );
        headers['Content-Type'] = 'application/json';
      }
      const response = await fetch( url, { method, body, headers });
      const data = await response.json();

      if ( response.status === 401) {
        throw new Error( `401__${data.errors}`);
      };
      if ( response.status === 404) {
        throw new Error( `404__${data.errors}`);
      };

      if ( !response.ok) {
        throw new Error( `Что то пошло не так`);
      };

      setLoading( false );
      return data;

    } catch (error) {
      setLoading( false );
      setError( error.message );
      throw  error;
    }
  }, []);

  const cleanError = useCallback( () => setError( null ), []);

  return { loading,  error, request, cleanError };
};