// useFetch.test.js
import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import useAxios from "./use-axios";


test("useFetch performs GET request", async () => {
  const url = "http://mock";
  const config = {
    api:url,
    headers: {
      'Content-Type': 'application/json',
    },

  }

  const response = (data) => {}
  const mock = new MockAdapter(axios);

  const mockData = "response";
  
  mock.onGet(url).reply(200, mockData);

  const {result} = renderHook(() =>
   useAxios(config, response)
  );

  expect(result.current.errors).toEqual();
  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.response).toEqual();

});