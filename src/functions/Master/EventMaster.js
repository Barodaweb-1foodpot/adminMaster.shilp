import axios from "axios";

export const createEventMaster = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/eventMaster`,
    values
  );
};

export const removeEventMaster = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/eventMaster/${_id}`
  );
};

export const listEventMaster = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/eventMaster`
  );
};

export const updateEventMaster= async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/eventMaster/${_id}`,
    values
  );
};

export const getEventMaster = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/eventMaster/${_id}`
  );
};