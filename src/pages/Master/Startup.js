import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
  Toast,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createStartUpDetailsMaster,
  getStartUpDetailsMaster,
  removeStartUpDetailsMaster,
  updateStartUpDetailsMaster,
} from "../../functions/Master/startup";

const initialState = {
  participantCategoryId: "",
  categoryId: "",
  contactPersonName: "",
  contactNo: "",
  email: "",
  password: "",
  companyName: "",
  logo: "",
  description: "",
  remarks: "",
  StateID: "",
  CountryID: "",
  City: "",
  address: "",
  pincode: "",
  IsActive: false,
};

const StartUpDetailsMaster = () => {
  const [values, setValues] = useState(initialState);
  const {
    participantCategoryId,
    categoryId,
    contactPersonName,
    contactNo,
    email,
    password,
    companyName,
    logo,
    description,
    remarks,
    StateID,
    CountryID,
    City,
    address,
    pincode,
    IsActive,
  } = values;

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [category, setCategory] = useState([]);
  const [participantCategory, setparticipantCategory] = useState([]);
  const [CountryIDD, setCountryIDD] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [blogs, setBlogs] = useState([]);

  const [options, setOptions] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

 

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/get/list/ActiveCategories`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCategory(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/get/active/participantCategoryMaster`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setparticipantCategory(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/activeLocation/country`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCountry(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  const fetchStates = async (CountryIDD) => {
    try {
      console.log(CountryIDD);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/location/statesByCountry/${CountryIDD}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setState(result);
      console.log(result);
    } catch (error) {
      setError(error);
    }
  };

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };



  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setIsSubmit(false);
    setUpdateForm(true);

    setIsSubmit(false);
    set_Id(_id);
    getStartUpDetailsMaster(_id)
      .then((res) => {
        console.log("res", res);
        setValues(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [e.target.name]: e.target.value });
    if (name === "CountryID") {
      setCountryIDD(value);
      fetchStates(value);
    }
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const handleSubmitCancel = (e) => {
    e.preventDefault();

    setIsSubmit(false);
    setShowForm(false);
    setUpdateForm(false);
    setValues(initialState);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsSubmit(true);

    let errors = validate(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      createStartUpDetailsMaster(values)
        .then((res) => {
          console.log("res", res);
          if (res.isOk) {
            setmodal_list(!modal_list);
            setValues(initialState);
            setIsSubmit(false);
            setFormErrors({});
            fetchUsers();
            toast.success("StartUp Details Added Successfully!");
          } else {
            setErremail(true);
            setFormErrors({ email: "Email already exists!" });
            toast.error("There is some error Please try again!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeStartUpDetailsMaster(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchUsers();
        toast.success("StartUp Details Removed Successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("There is some error Please try again!");
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  // const handleUpdate = (e) => {
  //   e.preventDefault();
  //   let erros = validate(values);
  //   setFormErrors(erros);
  //   setIsSubmit(true);

  //   if (Object.keys(erros).length === 0) {
  //     updateStartUpDetailsMaster(_id, values)
  //       .then((res) => {
  //         setmodal_edit(!modal_edit);
  //         fetchUsers();
  //         toast.success("StartUp Details Updated Successfully!");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         toast.error("There is some error Please try again!");
  //       });
  //   }
  // };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateStartUpDetailsMaster(_id, values)
        .then((res) => {
          setUpdateForm(false);
          setShowForm(false);
          fetchUsers();
          toast.success("StartUp Details Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("There is some error Please try again!");
        });
    }
  };

  const [errparticipantCategoryId, setErrparticipantCategoryId] =
    useState(false);
  const [errcategoryId, setErrcategoryId] = useState(false);
  const [errcontactPersonName, setErrcontactPersonName] = useState(false);
  const [errcontactNo, setErrcontactNo] = useState(false);
  const [erremail, setErremail] = useState(false);
  const [errpassword, setErrpassword] = useState(false);
  const [errcompanyName, setErrcompanyName] = useState(false);
  const [errlogo, setErrlogo] = useState(false);
  const [errdescription, setErrdescription] = useState(false);
  const [errremarks, setErrremarks] = useState(false);
  const [errStateID, setErrStateID] = useState(false);
  const [errCountryID, setErrCountryID] = useState(false);
  const [errCity, setErrCity] = useState(false);
  const [erraddress, setErraddress] = useState(false);
  const [errpincode, setErrpincode] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.participantCategoryId === "") {
      errors.participantCategoryId = "Participant Category is required";
      setErrparticipantCategoryId(true);
    }
    if (values.categoryId === "") {
      errors.categoryId = "Category is required";
      setErrcategoryId(true);
    }
    if (values.contactPersonName === "") {
      errors.contactPersonName = "Contact Person Name is required";
      setErrcontactPersonName(true);
    }
    if (values.contactNo === "") {
      errors.contactNo = "Contact Number is required";
      setErrcontactNo(true);
    }
    if (values.email === "") {
      errors.email = "Email is required";
      setErremail(true);
    }
    if (values.password === "") {
      errors.password = "Password is required";
      setErrpassword(true);
    }
    if (values.companyName === "") {
      errors.companyName = "Company Name is required";
      setErrcompanyName(true);
    }
    if (values.description === "") {
      errors.description = "Description is required";
      setErrdescription(true);
    }
    if (values.remarks === "") {
      errors.remarks = "Remarks is required";
      setErrremarks(true);
    }
    if (values.StateID === "") {
      errors.StateID = "State is required";
      setErrStateID(true);
    }
    if (values.CountryID === "") {
      errors.CountryID = "Country is required";
      setErrCountryID(true);
    }
    if (values.City === "") {
      errors.City = "City is required";
      setErrCity(true);
    }
    if (values.address === "") {
      errors.address = "Address is required";
      setErraddress(true);
    }
    if (values.pincode === "") {
      errors.pincode = "Pincode is required";
      setErrpincode(true);
    }

    return errors;
  };

  const validClassparticipantCategoryId =
    errparticipantCategoryId && isSubmit
      ? "form-control is-invalid"
      : "form-control";
  const validClasscategoryId =
    errcategoryId && isSubmit ? "form-control is-invalid" : "form-control";
  const validClasscontactPersonName =
    errcontactPersonName && isSubmit
      ? "form-control is-invalid"
      : "form-control";
  const validClasscontactNo =
    errcontactNo && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEM =
    erremail && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPA =
    errpassword && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCN =
    errcompanyName && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLogo =
    errlogo && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassDes =
    errdescription && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassRem =
    errremarks && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassStateID =
    errStateID && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCountryID =
    errCountryID && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCity =
    errCity && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAdd =
    erraddress && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPin =
    errpincode && isSubmit ? "form-control is-invalid" : "form-control";

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
    // fetchUsers(1); // fetch page 1 of users
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/listByparams/StartUpDetailsMaster`,
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
        console.log(response);
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setBlogs(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setBlogs([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const [photoAdd, setPhotoAdd] = useState();
  const [checkImagePhoto, setCheckImagePhoto] = useState(false);

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Company Name",
      selector: (row) => row.companyName,
      sortable: true,
      sortField: "firstName",
      minWidth: "150px",
    },
    {
      name: "Contact Person Name",
      selector: (row) => row.contactPersonName,
      sortable: true,
      sortField: "lastName",
      minWidth: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
      minWidth: "150px",
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
                  onClick={() => {
                    handleTog_edit(row._id);
                    setShowForm(!showForm);
                    setUpdateForm(!updateForm);
                  }}
                >
                  Edit
                </button>
              </div>

              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = "StartUp Details Master | Naidip Foundation";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Start Up Master"
            title="Start Up Master"
            pageTitle="Start Up Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Start Up Master
                      </h2>
                    </Col>

                    <Col sm={6} lg={4} md={6}>
                      <div className="d-flex justify-content-end align-items-center mt-2">
                        {!showForm && (
                          <div className="text-start me-3">
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
                        )}
                      </div>
                    </Col>

                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <div className="d-flex justify-content-end align-items-center mt-2">
                        {showForm ? (
                          <button
                            className="btn bg-success text-light mb-3 me-3"
                            onClick={() => {
                              setShowForm(false);
                              setUpdateForm(false);
                              setFormErrors({});
                            }}
                          >
                            <i className="ri-list-check align-bottom me-1"></i>{" "}
                            List
                          </button>
                        ) : (
                          <Button
                            color="success"
                            className="add-btn me-3"
                            onClick={() => {
                              setShowForm(!showForm);
                              setUpdateForm(false);
                              setFormErrors({});
                              setValues(initialState);
                            }}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button>
                        )}

                        {!showForm && (
                          <div className="search-box me-3">
                            <input
                              className="form-control search"
                              placeholder="Search..."
                              onChange={(e) => setQuery(e.target.value)}
                            />
                            <i className="ri-search-line search-icon "></i>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                {/* ADD FORM  */}
                <div
                  style={{
                    display: showForm && !updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col xxl={12}>
                        <Card className="">
                          {/* <PreviewCardHeader title="Billing Product Form" /> */}
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                <Col lg={6}>
                                  <div className="form-floating mb-3">
                                    <select
                                      className={
                                        validClassparticipantCategoryId
                                      }
                                      required
                                      name="participantCategoryId"
                                      value={participantCategoryId}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Participant Category
                                      </option>
                                      {participantCategory.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.categoryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Participant Category{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.participantCategoryId}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={6}>

                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClasscategoryId}
                                      required
                                      name="categoryId"
                                      value={categoryId}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Category
                                      </option>
                                      {category.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.categoryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Category name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.categoryId}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Row>
                                  <Col lg={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClasscontactPersonName}
                                      placeholder="Enter password"
                                      required
                                      name="contactPersonName"
                                      value={contactPersonName}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Contact Person Name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.contactPersonName}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={4}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClasscontactNo}
                                      placeholder="Enter contactNo"
                                      required
                                      name="contactNo"
                                      value={contactNo}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Contact Number{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.contactNo}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={4}>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassEM}
                                      placeholder="Enter email "
                                      required
                                      name="email"
                                      value={email}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Email{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.email}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  </Row>
                                  <Row>
                                  <Col lg={6}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassPA}
                                      placeholder="Enter password"
                                      required
                                      name="password"
                                      value={password}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Password{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.password}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={6}>

                                  

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCN}
                                      placeholder="Enter Company Name"
                                      required
                                      name="companyName"
                                      value={companyName}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Company Name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.companyName}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  </Row>
                                  <Row>
                                  <Col lg={6}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="textarea"
                                      className={validClassDes}
                                      placeholder="Enter Description"
                                      required
                                      name="description"
                                      value={description}
                                      style={{height: "100px"}}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Description{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.description}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={6}>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassRem}
                                      placeholder="Enter Remarks"
                                      required
                                      name="remarks"
                                      value={remarks}
                                      style={{height: "100px"}}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Remarks{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.remarks}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  </Row>

                                  <Row>
                                  <Col lg={3}>
                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClassCountryID}
                                      required
                                      name="CountryID"
                                      value={CountryID}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Country
                                      </option>
                                      {country.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.CountryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Country{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.CountryID}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={3}>
                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClassStateID}
                                      required
                                      name="StateID"
                                      value={StateID}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select State
                                      </option>
                                      {state.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.StateName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      State{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.StateID}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={3}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCity}
                                      placeholder="Enter City"
                                      required
                                      name="City"
                                      value={City}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      City{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.City}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  <Col lg={3}>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassPin}
                                      placeholder="Enter Address"
                                      required
                                      name="pincode"
                                      value={pincode}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      PinCode{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.pincode}
                                      </p>
                                    )}
                                  </div>
                                  </Col>
                                  </Row>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassAdd}
                                      placeholder="Enter Address"
                                      required
                                      name="address"
                                      value={address}
                                      style={{height: "100px"}}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Address{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.address}
                                      </p>
                                    )}
                                  </div>

                                  

                                  <div className="form-check mb-2">
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="IsActive"
                                      value={IsActive}
                                      onChange={handleCheck}
                                    />
                                    <Label className="form-check-label">
                                      Is Active
                                    </Label>
                                  </div>

                                  <Col lg={12}>
                                    <div className="hstack gap-2 justify-content-end">
                                      <button
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        id="add-btn"
                                        onClick={handleClick}
                                      >
                                        Submit
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger m-1"
                                        onClick={handleSubmitCancel}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                          </CardBody>{" "}
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                {/* UPDATE FORM  */}
                <div
                  style={{
                    display: showForm && updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col xxl={12}>
                        <Card className="">
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                <div className="form-floating mb-3">
                                    <select
                                      className={
                                        validClassparticipantCategoryId
                                      }
                                      required
                                      name="participantCategoryId"
                                      value={participantCategoryId}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Participant Category
                                      </option>
                                      {participantCategory.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.categoryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Participant Category{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.participantCategoryId}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClasscategoryId}
                                      required
                                      name="categoryId"
                                      value={categoryId}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Category
                                      </option>
                                      {category.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.categoryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Category name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.categoryId}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassEM}
                                      placeholder="Enter email "
                                      required
                                      name="email"
                                      value={email}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Email{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.email}
                                      </p>
                                    )}
                                  </div>
                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassPA}
                                      placeholder="Enter password"
                                      required
                                      name="password"
                                      value={password}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Password{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.password}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClasscontactPersonName}
                                      placeholder="Enter password"
                                      required
                                      name="contactPersonName"
                                      value={contactPersonName}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Contact Person Name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.contactPersonName}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClasscontactNo}
                                      placeholder="Enter contactNo"
                                      required
                                      name="contactNo"
                                      value={contactNo}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Contact Number{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.contactNo}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCN}
                                      placeholder="Enter Company Name"
                                      required
                                      name="companyName"
                                      value={companyName}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Company Name{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.companyName}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="textarea"
                                      className={validClassDes}
                                      placeholder="Enter Description"
                                      required
                                      name="description"
                                      value={description}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Description{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassRem}
                                      placeholder="Enter Remarks"
                                      required
                                      name="remarks"
                                      value={remarks}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Remarks{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.remarks}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClassCountryID}
                                      required
                                      name="CountryID"
                                      value={CountryID}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select Country
                                      </option>
                                      {country.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.CountryName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      Country{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.CountryID}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <select
                                      className={validClassStateID}
                                      required
                                      name="StateID"
                                      value={StateID}
                                      onChange={handleChange}
                                    >
                                      <option value="" disabled>
                                        Select State
                                      </option>
                                      {state.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.StateName}
                                        </option>
                                      ))}
                                    </select>
                                    <Label>
                                      State{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.StateID}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassCity}
                                      placeholder="Enter City"
                                      required
                                      name="City"
                                      value={City}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      City{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.City}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassAdd}
                                      placeholder="Enter Address"
                                      required
                                      name="address"
                                      value={address}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      Address{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.address}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-floating mb-3">
                                    <Input
                                      type="text"
                                      className={validClassPin}
                                      placeholder="Enter Address"
                                      required
                                      name="pincode"
                                      value={pincode}
                                      onChange={handleChange}
                                    />
                                    <Label>
                                      PinCode{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    {isSubmit && (
                                      <p className="text-danger">
                                        {formErrors.pincode}
                                      </p>
                                    )}
                                  </div>

                                  <div className="form-check mb-2">
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="IsActive"
                                      value={IsActive}
                                      onChange={handleCheck}
                                    />
                                    <Label className="form-check-label">
                                      Is Active
                                    </Label>
                                  </div>

                                  <Col lg={12}>
                                    <div className="text-end">
                                      <button
                                        type="submit"
                                        className=" btn btn-success m-1"
                                        id="add-btn"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger m-1"
                                        onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setFormErrors({});
                }}

                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Col>
                                </Row>
                              </Form>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                {/* list */}
                <div
                  style={{
                    display: showForm || updateForm ? "none" : "block",
                  }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        <DataTable
                          columns={col}
                          data={blogs}
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

      {/*Remove Modal*/}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
          // setValues([]);
         setFormErrors({});
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(!modal_delete);
          }}
        >
          <span style={{ marginRight: "210px" }}>Remove Gallery Master</span>
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
                className="btn btn-outline-danger"
                onClick={() => setmodal_delete(false)}
              >
                Close
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default StartUpDetailsMaster;
