import axios from "axios";

export const createFaqMaster = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/create/FaqMaster`,
      values
    );
  };
  
  export const removeFaqMaster = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/FaqMaster/${_id}`
    );
  };
  
  export const listFaqMaster = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/FaqMaster`
    );
  };
  
  
  export const updateFaqMaster = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/FaqMaster/${_id}`,
      values
    );
  };
  
  export const getFaqMaster = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/FaqMaster/${_id}`
    );
  };
  