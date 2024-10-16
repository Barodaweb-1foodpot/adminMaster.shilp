import axios from "axios";

export const listContent = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/list-content`
  );
};

export const createContent = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/create-content`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getContent = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/get-content/${_id}`
  );
};

export const removeContent = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/remove-content/${_id}`
  );
};

export const updateContent = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/content-update/${_id}`,
    values
  );
};

export const uploadImage = async (body) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/image-upload`,
    body
  );
};


export const getContentByStartUp = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/get-cms-by-startup/${_id}`
    );
  };