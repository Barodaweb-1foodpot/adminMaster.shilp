import axios from "axios";

export const listNotificationSetup = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/notificationSetup`
  );
};
export const removeNotificationSetup = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/remove/notificationSetup/${_id}`
  );
};

export const uploadImageNotificationSetup = async (body) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/upload/notificationSetup`,
    body
  );
};
export const createNotificationSetup = async (
  formName,
  emailSubject,
  MailerName,
  CCMail,
  EmailFrom,
  EmailPassword,
  OutgoingServer,
  OutgoingPort,
  EmailSignature,
  EmailSent,
  ToAllUser,
  IsActive
) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/notificationSetup`,
    {
        formName,
        emailSubject,
        MailerName,
        CCMail,
        EmailFrom,
        EmailPassword,
        OutgoingServer,
        OutgoingPort,
        EmailSignature,
        EmailSent,
        ToAllUser,
        IsActive
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const updateNotificationSetup = async (
  _id,
  formName,
  emailSubject,
  MailerName,
  CCMail,
  EmailFrom,
  EmailPassword,
  OutgoingServer,
  OutgoingPort,
  EmailSignature,
  EmailSent,
  ToAllUser,
  IsActive
) => {
  return axios.put(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/notificationSetup/${_id}`,
    {
        formName,
        emailSubject,
        MailerName,
        CCMail,
        EmailFrom,
        EmailPassword,
        OutgoingServer,
        OutgoingPort,
        EmailSignature,
        EmailSent,
        ToAllUser,
        IsActive
    }
  );
};

export const getNotificationSetup = async (_id) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/notificationSetup/${_id}`
  );
};

export const sendEmailNotificationSetup = async (_id) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/notificationSetup/send-email/${_id}`
  );
};

export const bulkEmails = async (emailSubject, templateId, sentFromEmail, sentFromName) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/send/mailersend/bulk-email`,
    {emailSubject, templateId, sentFromEmail, sentFromName}
  );
};

