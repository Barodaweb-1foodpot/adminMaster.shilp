import axios from "axios";

export const createVisitor = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/visitor`,
      values
    );
  };
  
  export const removeVisitor = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/visitor/${_id}`
    );
  };
  
  export const listVisitor = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/visitor`
    );
  };
  
  
  export const updateVisitor = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/visitor/${_id}`,
      values
    );
  };
  
  export const getVisitor = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/visitor/${_id}`
    );
  };


  