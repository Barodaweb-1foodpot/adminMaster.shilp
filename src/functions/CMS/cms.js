import axios from "axios";

export const listContent = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/list-content`
  );
};

export const createContent = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/create-content`,
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
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/get-content/${_id}`
  );
};

export const removeContent = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/remove-content/${_id}`
  );
};

export const updateContent = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/content-update/${_id}`,
    values
  );
};

export const uploadImage = async (body) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/cms/image-upload`,
    body
  );
};
