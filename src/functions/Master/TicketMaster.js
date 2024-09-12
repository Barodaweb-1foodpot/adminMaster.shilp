import axios from "axios";

export const createticketMaster = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/ticketMaster`,
    values
  );
};

export const removeticketMaster = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/ticketMaster/${_id}`
  );
};

export const listticketMaster = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/ticketMaster`
  );
};

export const updateticketMaster= async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/ticketMaster/${_id}`,
    values
  );
};

export const getticketMaster = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/ticketMaster/${_id}`
  );
};