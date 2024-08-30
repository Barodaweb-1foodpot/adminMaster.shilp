import React, { useState, useEffect, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  createNotificationSetup,
  getNotificationSetup,
  updateNotificationSetup,
  uploadImageNotificationSetup,
  removeNotificationSetup,
  sendEmailNotificationSetup,
  bulkEmails,
} from "../../functions/Notifications/NotificationSetup";
import { toast, ToastContainer } from "react-toastify";

const NotificationSetup = ({ placeholder }) => {
  const [formState, setFormState] = useState(false);
  const [listNotifications, setlistNotification] = useState([]);
  const [remove_id, setRemove_id] = useState("");
  const [modal_delete, setmodal_delete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [filter, setFilter] = useState(true);
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false, 
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );
  const [content, setContent] = useState("");

  const [joditImage, setJoditImage] = useState("");

  const UploadImage = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = e.target.files[0];
      const formdata = new FormData();

      formdata.append("myFile", imageurl);

      axios
        .post(
          `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/createimageurl`,
          formdata
        )
        .then((res) => {
          setJoditImage(`${process.env.REACT_APP_API_URL_COFFEE}/${res.url}`);
        });
    }
  };

  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeNotificationSetup(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchSetup();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClose = () => {
    setFormState(false);
    setIsSubmit(false);
    setIsEdit(false);
    setFormErrors({});
    setformName("");
    setMailerName("");
    setCCMail("");
    setEmailFrom("");
    setEmailPassword("");
    setEmailSubject("");
    setOutgoingServer("");
    setOutgoingPort("");
    setEmailSignature("");
    setIsActive(false);
    setToAllUser(false);
    setEmailSent("");
  };
  const openForm = () => {
    setFormState(true);
    setIsActive(true);
  };
  const [formName, setformName] = useState("");
  const [MailerName, setMailerName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [CCMail, setCCMail] = useState("");
  const [EmailFrom, setEmailFrom] = useState("");
  const [EmailPassword, setEmailPassword] = useState("");
  const [OutgoingServer, setOutgoingServer] = useState("");
  const [OutgoingPort, setOutgoingPort] = useState("");
  const [EmailSignature, setEmailSignature] = useState("");
  const [EmailSent, setEmailSent] = useState("");
  const [ToAllUser, setToAllUser] = useState(false);

  const [IsActive, setIsActive] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [_id, set_Id] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const [isEmailSent, setIsEmailSent] = useState(false);

  const [customForm, setCustomForm] = useState(false);
  const [templateId, setTemplateId] = useState();
  const [sentFromEmail, setSentFromEmail] = useState();
  const [sentFromName, setSentFromName] = useState();


  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  useEffect(() => {
    if (ToAllUser) {
      setEmailSent("");
    }
  }, [ToAllUser]);

  const handleClick = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setFormErrors(
      validate(
        formName,
        EmailFrom,
        MailerName,
        emailSubject,
        EmailPassword,
        OutgoingServer,
        OutgoingPort,
        EmailSignature
      )
    );
    // const IsActive = document.getElementById("activeCheckBox").checked;

    createNotificationSetup(
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
    )
      .then((res) => {
        if (!res.isOk) {
          toast.error(res.message);
        } else {
          setformName();
          setMailerName("");
          setCCMail("");
          setEmailFrom("");
          setEmailSubject("");
          setEmailPassword("");
          setEmailSignature("");
          setOutgoingServer("");
          setOutgoingPort("");
          setEmailSent("");
          setToAllUser(false);
          setIsActive(false);
          setFormState(false);
          setFormErrors({});
          setIsSubmit(false);
          fetchSetup();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ran into some error");
      });
  };

  const handleTog_edit = (_id) => {
    setFormState(true);
    setIsEdit(true);
    set_Id(_id);

    getNotificationSetup(_id)
      .then((res) => {
        setformName(res.formName);
        setEmailSubject(res.emailSubject);
        setMailerName(res.MailerName);
        setCCMail(res.CCMail);
        setEmailFrom(res.EmailFrom);
        setEmailPassword(res.EmailPassword);
        setOutgoingServer(res.OutgoingServer);
        setOutgoingPort(res.OutgoingPort);
        setIsActive(res.IsActive);
        setToAllUser(res.ToAllUser);
        setEmailSignature(res.EmailSignature);
        setEmailSent(res.EmailSent);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(
      formName,
      EmailFrom,
      MailerName,
      emailSubject,
      EmailPassword,
      OutgoingServer,
      OutgoingPort,
      EmailSignature
    );

    setFormErrors(erros);
    setIsSubmit(true);

    // const IsActive = document.getElementById("activeCheckBox").checked;

    if (Object.keys(erros).length == 0) {
      //  {
      updateNotificationSetup(
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
      )
        .then((res) => {
          setFormState(false);
          setIsSubmit(false);
          setIsEdit(false);
          setFormErrors({});
          setErrEF(false);
          setMN(false);
          setErrPW(false);
          setErrOS(false);
          setErrOP(false);
          setToAllUser(false);
          setMailerName("");
          setCCMail("");
          setEmailFrom("");
          setEmailPassword("");
          setOutgoingServer("");
          setEmailSignature("");
          setEmailSent("");
          fetchSetup();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  };

  const handleSendEmail = (id) => {
    sendEmailNotificationSetup(id).then((res) => {
      setIsEmailSent(true);
      if (res.isOk) {
        setIsEmailSent(false);
        toast.success("Email Sent Successfully!");
      } else {
        setIsEmailSent(false);
        toast.error("Something went wrong!");
      }
    });
  };

  const handleFormName = (e) => {
    setformName(e.target.value);
  };
  const handleMailerName = (e) => {
    setMailerName(e.target.value);
  };
  const handleCCMail = (e) => {
    setCCMail(e.target.value);
  };
  const handleEmailFrom = (e) => {
    setEmailFrom(e.target.value);
  };
  const handleEmailPassword = (e) => {
    setEmailPassword(e.target.value);
  };
  const handleEmailSignature = (data) => {
    setEmailSignature(data);
  };
  const handleOutgoingServer = (e) => {
    setOutgoingServer(e.target.value);
  };
  const handleOutgoingPort = (e) => {
    setOutgoingPort(e.target.value);
  };
  const handleEmailSubject = (e) => {
    setEmailSubject(e.target.value);
  };
  const handleEmailSent = (e) => {
    setEmailSent(e.target.value);
  };

  const handleActiveCheck = (e) => {
    setIsActive(e.target.checked);
  };
  const handleToAllCheck = (e) => {
    setToAllUser(e.target.checked);
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file
            .then((file) => {
              body.append("uploadImg", file);
              uploadImageNotificationSetup(body)
                .then((res) => {
                  console.log(res.url);
                  resolve({
                    default: `${process.env.REACT_APP_API_URL_COFFEE}/uploads/NotificationSetup/${res.url}`,
                  });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => reject(err));
        });
      },
    };
  }

  // function uploadPlugin(editor) {
  //   editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
  //     return uploadAdapter(loader);
  //   };
  // }

  const handleBulkEmail = (e) => {
    e.preventDefault();
    bulkEmails(emailSubject, templateId, sentFromEmail, sentFromName).then((res) => {
      if(res.flag){
        toast.success('Email sent Successfully!');
        setCustomForm(false);
        setTemplateId();
        setEmailSubject();
        setSentFromEmail();
        setSentFromName();
      }else{
        toast.error('Error sending email');
      }
    });
  };

  const [errMN, setMN] = useState(false);
  const [errEF, setErrEF] = useState(false);
  const [errPW, setErrPW] = useState(false);
  const [errOS, setErrOS] = useState(false);
  const [errOP, setErrOP] = useState(false);
  const [errFT, setErrFT] = useState(false);
  const [errES, setErrES] = useState(false);
  const [errEmailSubject, setErrEmailSubject] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = (
    FormName,
    EmailFrom,
    MailerName,
    emailSubject,
    EmailPassword,
    OutgoingServer,
    OutgoingPort,
    EmailSignature
  ) => {
    const errors = {};
    if (MailerName === "") {
      errors.MailerName = "Mailer Name is required!";
      setMN(true);
    }
    if (MailerName !== "") {
      setMN(false);
    }
    if (EmailPassword === "") {
      errors.EmailPassword = "Password is required!";
      setErrPW(true);
    }
    if (EmailPassword !== "") {
      setErrPW(false);
    }

    if (!validateEmail(EmailFrom)) {
      errors.EmailFrom = "Valid Email is required!";
      setErrEF(true);
    } else {
      setErrEF(false);
    }

    if (OutgoingServer === "") {
      errors.OutgoingServer = "Outgoing Server is required!";
      setErrOS(true);
    }
    if (OutgoingServer !== "") {
      setErrOS(false);
    }
    if (OutgoingPort == "") {
      errors.OutgoingPort = "Outgoing Port is required!";
      setErrOP(true);
    }
    if (OutgoingPort !== "") {
      setErrOP(false);
    }
    if (formName === "") {
      errors.FormName = "Form name is required!";
      setErrFT(true);
    }
    if (formName !== "") {
      setErrFT(false);
    }
    if (EmailSignature === "") {
      errors.EmailSignature = "Email Signature is required!";
      setErrES(true);
    }
    if (EmailSignature !== "") {
      setErrES(false);
    }
    if (emailSubject === "") {
      errors.emailSubject = "Email Subject is required!";
      setErrEmailSubject(true);
    }
    if (emailSubject !== "") {
      setErrEmailSubject(false);
    }
    return errors;
  };
  const validClassMailerName =
    errMN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailFrom =
    errEF && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailPassword =
    errPW && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassOutgoingServer =
    errOS && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassOutgoingPort =
    errOP && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassFormType =
    errFT && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailSubject =
    errEmailSubject && isSubmit ? "form-control is-invalid" : "form-control";

  const keys = ["formName", "MailerName", "EmailFrom", "CCMail"];
  const search = (data) => {
    return data.filter((item) =>
      keys.some(
        (key) =>
          typeof item[key] === "string" &&
          item[key].toLowerCase().includes(query)
      )
    );
  };
  //search state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    fetchSetup();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchSetup = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list-by-params/notificationSetup`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          IsActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setlistNotification(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setlistNotification([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };
  const columns = [
    {
      name: "Form Name",
      selector: (row) => row.formName,
      sortable: true,
      sortField: "formName",
    },
    // {
    //   name: "Sender Name",
    //   selector: (row) => row.MailerName,
    //   sortable: true,
    //   sortField: "MailerName",
    // },
    {
      name: "Email From",
      selector: (row) => row.EmailFrom,
      sortable: true,
      sortField: "EmailFrom",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "IsActive",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div>
              <div className="">
                <button
                  className="btn btn-sm btn-primary edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  disabled={isEmailSent}
                  onClick={() => handleSendEmail(row._id)}
                >
                  Send Email
                </button>
              </div>

              {/* <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div> */}
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
    },
  ];
  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };

  document.title = "Notification Setup | Naidip Foundation";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <BreadCrumb
            maintitle="Notifications"
            title="Notification Setup"
            pageTitle="Notifications"
          />
          {formState ? (
            <div>
              <Container>
                <Row>
                  <Col>
                    <Card>
                      <CardHeader>
                        <Row className="g-4 mb-1">
                          <Col className="col-sm">
                            <h2 className="card-title mb-0 fs-4 mt-2">
                              Notification Setup
                            </h2>
                          </Col>
                          <Col className="col-sm-auto">
                            <div className="d-flex justify-content-sm-end">
                              <div className="text-end">
                                <button
                                  className="btn bg-success text-light mb-3 "
                                  onClick={handleClose}
                                >
                                  <i class="ri-list-check align-bottom me-1"></i>{" "}
                                  List
                                </button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <div>
                          <Form>
                            <Row>
                              <Col md={6}>
                                <div className="form-floating  mb-3">
                                  <Input
                                    type="text"
                                    name="formName"
                                    value={formName}
                                    className={validClassFormType}
                                    onChange={handleFormName}
                                    disabled={isEdit}
                                  ></Input>
                                  <Label>
                                    Form Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.FormName}
                                    </p>
                                  }
                                </div>
                              </Col>

                              <Col md={6}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={validClassMailerName}
                                    placeholder="Enter Mailer Name"
                                    id="MailerName"
                                    name="MailerName"
                                    value={MailerName}
                                    onChange={handleMailerName}
                                  />
                                  <Label>
                                    Mailer Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.MailerName}
                                    </p>
                                  }
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={validClassEmailSubject}
                                    placeholder="Enter Email Subject"
                                    name="emailSubject"
                                    value={emailSubject}
                                    onChange={handleEmailSubject}
                                  />
                                  <Label>
                                    Email Subject
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.emailSubject}
                                    </p>
                                  }
                                </div>
                              </Col>
                              {/* <Col md={4}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter CC Mails"
                                    name="CCMail"
                                    value={CCMail}
                                    onChange={handleCCMail}
                                  />
                                  <Label>CC Mailer</Label>
                                </div>
                              </Col> */}
                              <Col md={4}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="email"
                                    className={validClassEmailFrom}
                                    placeholder="Enter Email Address"
                                    name="EmailForm"
                                    value={EmailFrom}
                                    onChange={handleEmailFrom}
                                  />
                                  <Label>
                                    Email From
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.EmailFrom}
                                    </p>
                                  }
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={validClassEmailPassword}
                                    placeholder="Enter Email Password"
                                    name="EmailPassword"
                                    value={EmailPassword}
                                    onChange={handleEmailPassword}
                                  />
                                  <Label>
                                    Email Password
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.EmailPassword}
                                    </p>
                                  }
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className={validClassOutgoingServer}
                                    placeholder="Enter Outgoing server"
                                    name="OutgoingServer"
                                    value={OutgoingServer}
                                    onChange={handleOutgoingServer}
                                  />
                                  <Label>
                                    Outgoing Server
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.OutgoingServer}
                                    </p>
                                  }
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-floating  mb-3">
                                  <Input
                                    // type="text"
                                    type="Number"
                                    className={validClassOutgoingPort}
                                    placeholder="Enter Outgoing Port"
                                    name="OutgoingPort"
                                    value={OutgoingPort}
                                    onChange={handleOutgoingPort}
                                  />
                                  <Label>
                                    Outgoing Port
                                    <span className="text-danger">*</span>
                                  </Label>
                                  {
                                    <p className="text-danger">
                                      {formErrors.OutgoingPort}
                                    </p>
                                  }
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-floating mb-3">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter email send to"
                                    name="EmailSent"
                                    value={EmailSent}
                                    disabled={ToAllUser}
                                    onChange={handleEmailSent}
                                  />
                                  <Label>Email Send</Label>
                                </div>
                              </Col>

                              <Row>
                                <Col md={4}>
                                  <div className="form-check mt-3">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="IsActive"
                                      checked={IsActive}
                                      onChange={handleActiveCheck}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="editctiveCheckBox"
                                    >
                                      Is Active
                                    </Label>
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="form-check mt-3">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="ToAllUser"
                                      checked={ToAllUser}
                                      onChange={handleToAllCheck}
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="editctiveCheckBox"
                                    >
                                      Send To All Users
                                    </Label>
                                  </div>
                                </Col>
                              </Row>

                              <Row className="mt-3" >
                              <Col lg={6}>
                                    <label>
                                      Upload Image(.jpg, .jpeg, .png)
                                    </label>

                                    <Input
                                      key={"blogImage_" + _id}
                                      type="file"
                                      name="blogImage"
                                      className="form-control"
                                      // accept="images/*"
                                      accept=".jpg, .jpeg, .png"
                                      onChange={UploadImage}
                                    />
                                  </Col>
                                  <Col lg={6}>
                                    <label>Get Image URL</label>
                                    <p>{joditImage}</p>
                                  </Col>
                               </Row> 
                              <Row className="mt-2">
                                <Col lg={12}>
                                  <Card>
                                    <CardHeader>
                                      <h4 className="card-title mb-0">
                                        Email Signature
                                        <span className="text-danger">*</span>
                                      </h4>
                                    </CardHeader>
                                    <CardBody>
                                      <JoditEditor
                                        ref={editor}
                                        value={EmailSignature}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={(newContent) =>
                                          setContent(newContent)
                                        } // preferred to use only this option to update the content for performance reasons
                                        onChange={() => {
                                          handleEmailSignature(
                                            editor.current.value
                                          );
                                          console.log(editor.current.value);
                                        }}
                                      />

                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.EmailSignature}
                                        </p>
                                      )}
                                    </CardBody>
                                  </Card>
                                </Col>

                                <Col lg={12}>
                                  <div className="text-end">
                                    {isEdit ? (
                                      <button
                                        id="btnsubmit"
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                    ) : (
                                      <button
                                        id="btnsubmit"
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        onClick={handleClick}
                                      >
                                        Submit
                                      </button>
                                    )}
                                    <button
                                      id="btnsubmit"
                                      type="submit"
                                      className="btn btn-outline-danger m-1"
                                      onClick={handleClose}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </Row>
                          </Form>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          ) : (
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <Row className="g-4 mb-1">
                      <Col className="col-sm">
                        <h2 className="card-title mb-0 fs-4 mt-2">
                          Notification Setup
                        </h2>
                      </Col>
                      <Col>
                        <div className="text-end mt-1">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            name="filter"
                            value={filter}
                            defaultChecked={true}
                            onChange={handleFilter}
                          />
                          <Label className="form-check-label ms-2">
                            Active
                          </Label>
                        </div>
                      </Col>
                      <Col className="col-sm-auto">
                        <div className="d-flex justify-content-sm-end">
                          {/* <div className="ms-2">
                            <Button
                              color="success"
                              className="add-btn me-1"
                              onClick={openForm}
                              id="create-btn"
                            >
                              <i className="ri-add-line align-bottom me-1"></i>
                              Add
                            </Button>
                          </div> */}
                          <div className="ms-2">
                            <Button
                              color="success"
                              className="add-btn me-1"
                              onClick={openForm}
                              id="create-btn"
                            >
                              <i className="ri-add-line align-bottom me-1"></i>
                              Send Bulk Emails
                            </Button>
                          </div>
                          <div className="search-box ms-2">
                            <input
                              //type="text"
                              className="form-control search"
                              placeholder="Search..."
                              onChange={(e) => setQuery(e.target.value)}
                            />
                            <i className="ri-search-line search-icon "></i>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div id="customerList">
                      <div className="table-responsive table-card mt-3 mb-1">
                        <DataTable
                          columns={columns}
                          data={listNotifications}
                          // progressPending={loading}
                          sortServer
                          onSort={(column, sortDirection, sortedRows) => {
                            handleSort(column, sortDirection);
                          }}
                          pagination
                          paginationServer
                          paginationTotalRows={totalRows}
                          paginationRowsPerPageOptions={[
                            10,
                            50,
                            100,
                            totalRows,
                          ]}
                          onChangeRowsPerPage={handlePerRowsChange}
                          onChangePage={handlePageChange}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
      {/* Remove Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          setmodal_delete(!modal_delete);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(!modal_delete);
          }}
        >
          Remove Notification Setup
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="mt-2 text-center">
              <lord-icon
                src="https://cdn.lordicon.com/gsqxdxog.json"
                trigger="loop"
                colors="primary:#f7b84b,secondary:#f06548"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you sure ?</h4>
                <p className="text-muted mx-4 mb-0">
                  Are you Sure You want to Remove this Record ?
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-danger"
                id="add-btn"
                onClick={handleDelete}
              >
                Remove
              </button>
              <button
                type="button"
                className="btn btn-outline-danger m-1"
                onClick={() => setmodal_delete(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

     
    </React.Fragment>
  );
};
export default NotificationSetup;
