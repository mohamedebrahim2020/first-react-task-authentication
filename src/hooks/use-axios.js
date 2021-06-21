import { useState, useCallback } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const baseUrl = 'https://boiler-stage.ibtikar.sa/';
 


  const sendRequest = useCallback( async (requestConfig, applyData=null) => {
    setIsLoading(true);
    setErrors(null);
        axios({
            method: requestConfig.method ? requestConfig.method : 'get',
            url: baseUrl+requestConfig.api,
            data: requestConfig.body ? requestConfig.body : null,
            headers:requestConfig.headers?requestConfig.headers:{},
          })
            .then((response) => {
                response.data ? applyData(response.data):applyData(response)
            })
            .catch((err) => {
              if (err.response && err.response.status !==422) {
                setErrors(err.response)
              }
              if (err.response && err.response.status ===422) {
                setErrors(err.response);
              }
            })
            setIsLoading(false);  
  }, []);

  return {
    isLoading,
    errors,
    sendRequest,
  };
};

export default useAxios;