import axios from "axios";

export const createInvestor = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/investor`,
      values
    );
  };
  
  export const removeInvestor = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/investor/${_id}`
    );
  };
  
  export const listInvestor = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/investor`
    );
  };
  
  
  export const updateInvestor = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/investor/${_id}`,
      values
    );
  };
  
  export const getInvestor = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/investor/${_id}`
    );
  };


  