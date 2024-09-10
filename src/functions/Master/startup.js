import axios from "axios";

export const createStartUpDetailsMaster = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/StartUpDetailsMaster`,
    values
  );
};

export const removeStartUpDetailsMaster = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/StartUpDetailsMaster/${_id}`
  );
};

export const listStartUpDetailsMaster = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/StartUpDetailsMaster`
  );
};

export const updateStartUpDetailsMaster= async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/StartUpDetailsMaster/${_id}`,
    values
  );
};

export const getStartUpDetailsMaster = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/StartUpDetailsMaster/${_id}`
  );
};