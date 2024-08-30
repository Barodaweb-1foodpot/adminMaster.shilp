import axios from "axios";

export const listApplications = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/applications`);
};

export const createApplications = async (values) => {
    return await axios.post(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/applications`, values);
};

export const fileUpload = async(values)=>{
  return await axios.post(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/upload/applications`, values)
}

export const updateApplications = async (_id, values) => {
  return await axios.put(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/applications/${_id}`, values);
};

export const getApplications = async (_id) => {
  return await axios.get(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/applications/${_id}`);
};

export const removeApplications = async (_id) => {
  return await axios.delete(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/remove/applications/${_id}`);
};