import axios from "axios";

export const createAwardCategory = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/create/AwardCategory`,
      values
    );
  };
  
  export const removeAwardCategory = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/AwardCategory/${_id}`
    );
  };
  
  export const listAwardCategory = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/AwardCategory`
    );
  };
  
  
  export const updateAwardCategory = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/AwardCategory/${_id}`,
      values
    );
  };
  
  export const getAwardCategory = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/AwardCategory/${_id}`
    );
  };
  