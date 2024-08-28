import axios from "axios";

export const createNewsLetter= async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/NewsLetter`,
      values
    );
  };
  
  export const removeNewsLetter= async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/remove/NewsLetter/${_id}`
    );
  };
  
  export const listNewsLetter= async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/NewsLetter`
    );
  };
  
  
  export const updateNewsLetter= async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/NewsLetter/${_id}`,
      values
    );
  };
  
  export const getNewsLetter= async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/NewsLetter/${_id}`
    );
  };
  