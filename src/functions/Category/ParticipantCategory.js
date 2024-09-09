import axios from "axios";

export const createParticipantCategory = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/create/participantCategoryMaster`,
      values
    );
  };
  
  export const removeParticipantCategory = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/participantCategoryMaster/${_id}`
    );
  };
  
  export const listParticipantCategory = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/participantCategoryMaster`
    );
  };
  
  
  export const updateParticipantCategory= async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/participantCategoryMaster/${_id}`,
      values
    );
  };
  
  export const getParticipantCategory= async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/participantCategoryMaster/${_id}`
    );
  };
  