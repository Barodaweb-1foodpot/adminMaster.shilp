import axios from "axios";

export const createStageOfStartup = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/create/StageOfStartup`,
      values
    );
  };
  
  export const removeStageOfStartup = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/StageOfStartup/${_id}`
    );
  };
  
  export const listStageOfStartup = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/StageOfStartup`
    );
  };
  
  
  export const updateStageOfStartup = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/StageOfStartup/${_id}`,
      values
    );
  };
  
  export const getStageOfStartup = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/StageOfStartup/${_id}`
    );
  };
  