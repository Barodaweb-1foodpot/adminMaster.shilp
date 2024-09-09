import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Input,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

import UiContent from "../../Components/Common/UiContent";
import DataTable from "react-data-table-component";

import myImage from "../../assets/images/logo/Image_not_available.png";

import {
  createApplications,
  fileUpload,
  getApplications,
  listApplications,
  updateApplications,
} from "../../functions/Applications/Applications";
import axios from "axios";
import moment from "moment-timezone";

const initialState = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  contactNo: "",
  currentGrade: "",
  incomeCertificate: "",
  photo: "",
  studentAadharCard: "",
  parentAadharCard: "",
  panCard: "",
  ssc: "",
  schoolLeavingCertificate: "",
  itReturn: "",
  deathCertificate: "",
  recommendationLetter: "",
  IsApproved: false,
  IsActive: true,
};

const Approved = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  //validation
  const [errCN, setErrCN] = useState(false);
  const [errFN, setErrFN] = useState(false);
  const [errLN, setErrLN] = useState(false);
  const [errMN, setErrMN] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errCG, setErrCG] = useState(false);

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [filter, setFilter] = useState(true);
  const [query, setQuery] = useState("");

  const [values, setValues] = useState(initialState);
  const {
    firstName,
    lastName,
    middleName,
    email,
    contactNo,
    currentGrade,
    incomeCertificate,
    photo,
    studentAadharCard,
    parentAadharCard,
    panCard,
    ssc,
    schoolLeavingCertificate,
    itReturn,
    deathCertificate,
    recommendationLetter,
    IsApproved,
    IsActive,
  } = values;

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [details, setDetails] = useState([]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setIsSubmit(false);
    setValues([]);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setUpdateForm(true);
    setIsSubmit(false);
    set_Id(_id);
    getApplications(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          firstName: res.firstName,
          lastName: res.lastName,
          middleName: res.middleName,
          email: res.email,
          contactNo: res.contactNo,
          currentGrade: res.currentGrade,
          incomeCertificate: res.incomeCertificate,
          photo: res.photo,
          studentAadharCard: res.studentAadharCard,
          parentAadharCard: res.parentAadharCard,
          panCard: res.panCard,
          ssc: res.ssc,
          schoolLeavingCertificate: res.schoolLeavingCertificate,
          itReturn: res.itReturn,
          deathCertificate: res.deathCertificate,
          recommendationLetter: res.recommendationLetter,
          IsApproved: res.IsApproved,
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     setFormErrors(validate(values));
  //     setIsSubmit(true);

  //     createApplications(values)
  //       .then((res) => {
  //         setValues(initialState);
  //         setShowForm(false);
  //         loadDetails();
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  const handleUpdate = (e) => {
    // debugger;
    e.preventDefault();
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      updateApplications(_id, values)
        .then((res) => {
          setUpdateForm(false);
          loadDetails();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setShowForm(false);
    setUpdateForm(false);
    setIsSubmit(false);
  };

  const handleCheck = (e) => {
    setValues({ ...values, [e.target.name]: e.target.checked });
  };

  const [fileType, setFileType] = useState("photo");

  const fileUploadInApplication = (e, type) => {
    let files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formdata = new FormData();
        formdata.append("file", files[i]);
        formdata.append("filefor", type);
        formdata.append("_id", _id);
        fileUpload(formdata).then(
          (res) => {
            setValues({ ...values, [type]: res.url });
          },
          (err) => {
            // debugger;
          }
        );
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "First name is required!";
      setErrFN(true);
    } else {
      setErrFN(false);
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required!";
      setErrLN(true);
    } else {
      setErrLN(false);
    }

    if (!values.middleName) {
      errors.middleName = "Middle name is required!";
      setErrMN(true);
    } else {
      setErrMN(false);
    }

    if (!values.contactNo) {
      errors.contactNo = "Contact No. is required!";
      setErrCN(true);
    } else {
      setErrCN(false);
    }

    if (!values.email) {
      errors.email = "Email is required!";
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }

    if (!values.currentGrade) {
      errors.currentGrade = "Current Grade is required!";
      setErrCG(true);
    } else {
      setErrCG(false);
    }

    return errors;
  };

  const validClassCN =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassFN =
    errFN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLN =
    errLN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassMN =
    errMN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmail =
    errEmail && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassGrade =
    errCG && isSubmit ? "form-control is-invalid" : "form-control";

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    loadDetails();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const loadDetails = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/approved`,
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
          setDetails(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setDetails([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const columns = [
    {
      name: "Date Of Application",
      selector: (row) => {
        const dateObject = new Date(row.createdAt);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format("DD/MM/YYYY")}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "createdAt",
      minWidth: "150px",
    },
    {
      name: "Applicant Name",
      selector: (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
      minWidth: "150px",
      sortable: true,
      sortField: "firstName",
    },
    {
      name: "Mobile",
      selector: (row) => row.contactNo,
      minWidth: "180px",
      sortable: true,
      sortField: "contactNo",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      minWidth: "150px",
      sortable: true,
      sortField: "email",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsApproved ? "Approved" : "Pending"}</p>;
      },
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
      minWidth: "180px",
    },
  ];
  document.title = "Applicants | Startup Fest Gujarat";

  return (
    <React.Fragment>
      <UiContent />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Enrollment"
            title="Applicants"
            pageTitle="Enrollment"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm">
                      <h2 className="card-title mb-0 fs-4 mt-2">Approved</h2>
                    </Col>

                    <Col lg={4} md={6} sm={6}>
                      <div
                        style={{
                          display: showForm || updateForm ? "none" : "",
                        }}
                      >
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
                      </div>
                    </Col>

                    <Col className="col-sm-auto">
                      <div className="d-flex justify-content-sm-end">
                        <div
                          style={{
                            display: showForm || updateForm ? "" : "none",
                          }}
                        >
                          <Row>
                            <Col lg={12}>
                              <div className="text-end">
                                <button
                                  className="btn bg-success text-light mb-3 "
                                  onClick={() => {
                                    setValues(initialState);
                                    setShowForm(false);
                                    setUpdateForm(false);
                                  }}
                                >
                                  <i class="ri-list-check align-bottom me-1"></i>{" "}
                                  List
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div
                          className="search-box ms-2"
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <input
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

                {/* update form */}
                <div
                  style={{
                    display: !showForm && updateForm ? "block" : "none",
                  }}
                >
                  <Row>
                    <Col lg={12}>
                      <Card>
                        <CardBody>
                          <div className="live-preview">
                            <Form>
                              <Row>
                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validClassFN} // Replace with appropriate validation class
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={firstName}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        First Name
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.firstName}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validClassMN} // Replace with appropriate validation class
                                        placeholder="Enter middle name"
                                        name="middleName"
                                        value={middleName}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        Middle Name
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.middleName}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validClassLN} // Replace with appropriate validation class
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={lastName}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        Last Name
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.lastName}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="email"
                                        className={validClassEmail} // Replace with appropriate validation class
                                        placeholder="Enter email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        Email
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.email}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validClassCN} // Replace with appropriate validation class
                                        placeholder="Enter contact number"
                                        name="contactNo"
                                        value={contactNo}
                                        onChange={handleChange}
                                      />
                                      <Label>
                                        Contact Number
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.contactNo}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Col lg={4}>
                                  <FormGroup className="mb-3">
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="select"
                                        className={validClassGrade} // Replace with appropriate validation class
                                        name="currentGrade"
                                        value={currentGrade}
                                        onChange={handleChange}
                                      >
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                      </Input>
                                      <Label>
                                        Current Grade
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.currentGrade}
                                        </p>
                                      )}
                                    </div>
                                  </FormGroup>
                                </Col>

                                <Row>
                                  <Col lg={6}>
                                    <div className="mb-3">
                                      <Input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="IsActive"
                                        value={IsActive}
                                        checked={IsActive}
                                        onChange={handleCheck}
                                      />
                                      <Label className="form-check-label ms-1">
                                        &nbsp;Is Active
                                      </Label>
                                    </div>
                                  </Col>
                                  <Col lg={6}>
                                    <div className="mb-3">
                                      <Input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="IsApproved"
                                        value={IsApproved}
                                        checked={IsApproved}
                                        onChange={handleCheck}
                                      />
                                      <Label className="form-check-label ms-1">
                                        &nbsp;Approve
                                      </Label>
                                    </div>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="photo"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("photo");
                                          fileUploadInApplication(e, "photo");
                                        }}
                                      />
                                      <label>Photo(.jpg, .jpeg, .png)</label>
                                    </div>
                                    {values.photo && (
                                      <div className="card col-3">
                                        <img
                                          key={values.photo}
                                          alt="fav-icon"
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.photo
                                          }
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {photo == "" && <h6>No Image</h6>}
                                  </Col>

                                  <Col lg={6}>
                                    {" "}
                                    <div className=" form-floating mb-3">
                                      <input
                                        type="file"
                                        name="incomeCertificate"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("incomeCertificate");
                                          fileUploadInApplication(
                                            e,
                                            "incomeCertificate"
                                          );
                                        }}
                                      />
                                      <label>
                                        Income Certificate(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.incomeCertificate && (
                                      <div className="card col-3">
                                        <img
                                          key={values.Icon}
                                          alt="menu-icon"
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.incomeCertificate
                                          }
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {incomeCertificate == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="studentAadharCard"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("studentAadharCard");
                                          fileUploadInApplication(
                                            e,
                                            "studentAadharCard"
                                          );
                                        }}
                                      />
                                      <label>
                                        Student Aadhar Card(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.studentAadharCard && (
                                      <div className="card col-3">
                                        <img
                                          key={values.studentAadharCard}
                                          alt="logo-img"
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.studentAadharCard
                                          }
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {studentAadharCard == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="parentAadharCard"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("parentAadharCard");
                                          fileUploadInApplication(
                                            e,
                                            "parentAadharCard"
                                          );
                                        }}
                                      />
                                      <label>
                                        Parent Aadhar Card(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.parentAadharCard && (
                                      <div className="card col-3">
                                        <img
                                          key={values.parentAadharCard}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.parentAadharCard
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {parentAadharCard == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                </Row>

                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="panCard"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("panCard");
                                          fileUploadInApplication(e, "panCard");
                                        }}
                                      />
                                      <label>Pan Card(.jpg, .jpeg, .png)</label>
                                    </div>
                                    {values.panCard && (
                                      <div className="card col-3">
                                        <img
                                          key={values.panCard}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.panCard
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {panCard == "" && <h6>No Image</h6>}
                                  </Col>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="ssc"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("ssc");
                                          fileUploadInApplication(e, "ssc");
                                        }}
                                      />
                                      <label>
                                        SSC Marksheet(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.ssc && (
                                      <div className="card col-3">
                                        <img
                                          key={values.ssc}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.ssc
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {ssc == "" && <h6>No Image</h6>}
                                  </Col>
                                </Row>

                                <Row>
                                  <Col lg={6}>
                                    {" "}
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="schoolLeavingCertificate"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType(
                                            "schoolLeavingCertificate"
                                          );
                                          fileUploadInApplication(
                                            e,
                                            "schoolLeavingCertificate"
                                          );
                                        }}
                                      />
                                      <label>
                                        School Leaving Certificate(.jpg, .jpeg,
                                        .png)
                                      </label>
                                    </div>
                                    {values.schoolLeavingCertificate && (
                                      <div className="card col-3">
                                        <img
                                          key={values.schoolLeavingCertificate}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.schoolLeavingCertificate
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {schoolLeavingCertificate == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="itReturn"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("itReturn");
                                          fileUploadInApplication(
                                            e,
                                            "itReturn"
                                          );
                                        }}
                                      />
                                      <label>
                                        IT Return(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.itReturn && (
                                      <div className="card col-3">
                                        <img
                                          key={values.itReturn}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.itReturn
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {itReturn == "" && <h6>No Image</h6>}
                                  </Col>
                                </Row>

                                <Row>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="deathCertificate"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("deathCertificate");
                                          fileUploadInApplication(
                                            e,
                                            "deathCertificate"
                                          );
                                        }}
                                      />
                                      <label>
                                        Death Certificate(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.deathCertificate && (
                                      <div className="card col-3">
                                        <img
                                          key={values.deathCertificate}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.deathCertificate
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {deathCertificate == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                  <Col lg={6}>
                                    <div className="form-floating mb-3">
                                      <input
                                        type="file"
                                        name="recommendationLetter"
                                        className="form-control"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(e) => {
                                          setFileType("recommendationLetter");
                                          fileUploadInApplication(
                                            e,
                                            "recommendationLetter"
                                          );
                                        }}
                                      />
                                      <label>
                                        Recommendation Letter(.jpg, .jpeg, .png)
                                      </label>
                                    </div>
                                    {values.recommendationLetter && (
                                      <div className="card col-3">
                                        <img
                                          key={values.recommendationLetter}
                                          src={
                                            process.env
                                              .REACT_APP_API_URL +
                                            "/" +
                                            values.recommendationLetter
                                          }
                                          alt="digital-signature-img"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = myImage;
                                          }}
                                        />
                                      </div>
                                    )}
                                    {recommendationLetter == "" && (
                                      <h6>No Image</h6>
                                    )}
                                  </Col>
                                </Row>

                                <Row>
                                  <Col lg={12}>
                                    <div className=" text-end">
                                      <button
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn btn-outline-danger m-1"
                                        onClick={handleUpdateCancel}
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
                </div>

                {/* list  */}
                <div
                  style={{ display: showForm || updateForm ? "none" : "block" }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        <DataTable
                          columns={columns}
                          data={details}
                          progressPending={loading}
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
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Approved;
