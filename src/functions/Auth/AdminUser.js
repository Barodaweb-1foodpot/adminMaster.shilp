import axios from "axios";

export const createAdminUser = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/adminUserMaster`,
    values
  );
};

export const removeAdminUser = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/adminUserMaster/${_id}`
  );
};

export const listAdminUser = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/adminUserMaster`
  );
};

export const updateAdminUser = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/adminUserMaster/${_id}`,
    values
  );
};

export const getAdminUser = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/adminUserMaster/${_id}`
  );
};
