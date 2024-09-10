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
  createInvestor,
  removeInvestor,
  listInvestor,
  updateInvestor,
  getInvestor,
} from "../../functions/Master/Investor";

const Investor = () => {
  const [participantCategoryId, setParticipantCategoryId] = useState("");
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [StateID, setStateID] = useState("");
  const [CountryID, setCountryID] = useState("");
  const [City, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [IsActive, setIsActive] = useState(false);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);

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

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const fetchStates = async (CountryIDD) => {
    try {
      console.log(CountryIDD);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/location/statesByCountry/${CountryIDD}`,
        {
          method: "POST",
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
        setOptions(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    // setmodal_edit(!modal_edit);
    setIsSubmit(false);
    setUpdateForm(true);

    setIsSubmit(false);
    set_Id(_id);
    getInvestor(_id)
      .then((res) => {
        console.log("res", res);
        setParticipantCategoryId(res.participantCategoryId);
        setName(res.name);
        setContactNo(res.contactNo);
        setEmail(res.email);
        setCompanyName(res.companyName);
        setDescription(res.description);
        setRemarks(res.remarks);
        setStateID(res.StateID);
        setCountryID(res.CountryID);
        setCity(res.City);
        setAddress(res.address);
        setPincode(res.pincode);
        setIsActive(res.IsActive);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    let errors = validate(
      participantCategoryId,
      name,
      contactNo,
      email,
      companyName,
      description,
      remarks,
      StateID,
      CountryID,
      City,
      address,
      pincode
    );
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      const formdata = new FormData();

      const data = {
        participantCategoryId,
        name,
        contactNo,
        email,
        companyName,
        description,
        remarks,
        StateID,
        CountryID,
        City,
        address,
        pincode,
        IsActive,
      };

      console.log("append", data);
      createInvestor(data)
        .then((res) => {
          console.log(res);
          // setmodal_list(!modal_list);
          setShowForm(false);
          // setValues(initialState);
          setIsActive(false);
          setParticipantCategoryId("");
          setFormErrors({});
          setName("");
          setContactNo("");
          setEmail("");
          setCompanyName("");
          setDescription("");
          setRemarks("");
          setStateID("");
          setCountryID("");
          setCity("");
          setAddress("");
          setPincode("");
          setCheckImagePhoto(false);
          setPhotoAdd("");
          setFormErrors({});
          fetchCategories();
          setErrparticipantCategoryId(false);
          setErrName(false);
          setErrContactNo(false);
          setErrEmail(false);
          setErrCompanyName(false);
          setErrDescription(false);
          setErrRemarks(false);
          setErrStateID(false);
          setErrCountryID(false);
          setErrCity(false);
          setErrAddress(false);
          setErrPincode(false);
          toast.success("Investor Added Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeInvestor(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchCategories();
        toast.success("Investor Removed Successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(
      participantCategoryId,
      name,
      contactNo,
      email,
      companyName,
      description,
      remarks,
      StateID,
      CountryID,
      City,
      address,
      pincode
    );
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      console.log("formdata");
      const formdata = new FormData();
      const data = {
        participantCategoryId,
        name,
        contactNo,
        email,
        companyName,
        description,
        remarks,
        StateID,
        CountryID,
        City,
        address,
        pincode,
        IsActive,
      };

      updateInvestor(_id, data)
        .then((res) => {
          // setmodal_edit(!modal_edit);
          setPhotoAdd("");
          setUpdateForm(false);
          setShowForm(false);

          setCheckImagePhoto(false);
          // setValues(initialState);
          setIsActive(false);
          setParticipantCategoryId("");
          setFormErrors({});
          setName("");
          setContactNo("");
          setEmail("");
          setCompanyName("");
          setDescription("");
          setRemarks("");
          setStateID("");
          setCountryID("");
          setCity("");
          setAddress("");
          setPincode("");
          setErrparticipantCategoryId(false);
          setErrName(false);
          setErrContactNo(false);
          setErrEmail(false);
          setErrCompanyName(false);
          setErrDescription(false);
          setErrRemarks(false);
          setErrStateID(false);
          setErrCountryID(false);
          setErrCity(false);
          setErrAddress(false);
          setErrPincode(false);
          fetchCategories();
          toast.success("Investor Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    }
  };

  const [errparticipantCategoryId, setErrparticipantCategoryId] =
    useState(false);
  const [errName, setErrName] = useState(false);
  const [errContactNo, setErrContactNo] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errCompanyName, setErrCompanyName] = useState(false);
  const [errDescription, setErrDescription] = useState(false);
  const [errRemarks, setErrRemarks] = useState(false);
  const [errStateID, setErrStateID] = useState(false);
  const [errCountryID, setErrCountryID] = useState(false);
  const [errCity, setErrCity] = useState(false);
  const [errAddress, setErrAddress] = useState(false);
  const [errPincode, setErrPincode] = useState(false);

  const validate = (
    participantCategoryId,
    name,
    contactNo,
    email,
    companyName,
    description,
    remarks,
    StateID,
    CountryID,
    City,
    address,
    pincode
  ) => {
    const errors = {};

    if (participantCategoryId === "") {
      errors.participantCategoryId = "Participant Category is required";
      setErrparticipantCategoryId(true);
    }
    if (name === "") {
      errors.name = "Name is required";
      setErrName(true);
    }
    if (contactNo === "") {
      errors.contactNo = "Contact Number is required";
      setErrContactNo(true);
    }
    if (email === "") {
      errors.email = "Email is required";
      setErrEmail(true);
    }
    if (companyName === "") {
      errors.companyName = "Company Name is required";
      setErrCompanyName(true);
    }
    if (description === "") {
      errors.description = "Description is required";
      setErrDescription(true);
    }
    if (remarks === "") {
      errors.remarks = "Remarks is required";
      setErrRemarks(true);
    }
    if (StateID === "") {
      errors.StateID = "State is required";
      setErrStateID(true);
    }
    if (CountryID === "") {
      errors.CountryID = "Country is required";
      setErrCountryID(true);
    }
    if (City === "") {
      errors.City = "City is required";
      setErrCity(true);
    }
    if (address === "") {
      errors.address = "Address is required";
      setErrAddress(true);
    }
    if (pincode === "") {
      errors.pincode = "Pincode is required";
      setErrPincode(true);
    }
    return errors;
  };

  const validClassParticipent = errparticipantCategoryId
    ? "form-control is-invalid"
    : "form-control";
  const validClassName = errName ? "form-control is-invalid" : "form-control";
  const validClassContact = errContactNo
    ? "form-control is-invalid"
    : "form-control";
  const validClassEmail = errEmail ? "form-control is-invalid" : "form-control";
  const validClassCompany = errCompanyName
    ? "form-control is-invalid"
    : "form-control";
  const validClassDescription = errDescription
    ? "form-control is-invalid"
    : "form-control";
  const validClassRemarks = errRemarks
    ? "form-control is-invalid"
    : "form-control";
  const validClassState = errStateID
    ? "form-control is-invalid"
    : "form-control";
  const validClassCountry = errCountryID
    ? "form-control is-invalid"
    : "form-control";
  const validClassCity = errCity ? "form-control is-invalid" : "form-control";
  const validClassAddress = errAddress
    ? "form-control is-invalid"
    : "form-control";
  const validClassPincode = errPincode
    ? "form-control is-invalid"
    : "form-control";

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
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/investor`,
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

  const handleAddCancel = (e) => {
    e.preventDefault();

    setIsSubmit(false);
    setShowForm(false);
    setUpdateForm(false);
    setPhotoAdd("");
    setCheckImagePhoto(false);
    // setValues(initialState);
    setParticipantCategoryId("");
    setFormErrors({});
    setName("");
    setContactNo("");
    setEmail("");
    setCompanyName("");
    setDescription("");
    setRemarks("");
    setStateID("");
    setCountryID("");
    setCity("");
    setAddress("");
    setPincode("");
    setIsActive(false);
    setErrparticipantCategoryId(false);
    setErrName(false);
    setErrContactNo(false);
    setErrEmail(false);
    setErrCompanyName(false);
    setErrDescription(false);
    setErrRemarks(false);
    setErrStateID(false);
    setErrCountryID(false);
    setErrCity(false);
    setErrAddress(false);
    setErrPincode(false);

  };

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setShowForm(false);
    setUpdateForm(false);
    setPhotoAdd("");
    setCheckImagePhoto(false);

    // setValues(initialState);
    setParticipantCategoryId("");
    setFormErrors({});
    setName("");
    setContactNo("");
    setEmail("");
    setCompanyName("");
    setDescription("");
    setRemarks("");
    setStateID("");
    setCountryID("");
    setCity("");
    setAddress("");
    setPincode("");
    setErrparticipantCategoryId(false);
    setErrName(false);
    setErrContactNo(false);
    setErrEmail(false);
    setErrCompanyName(false);
    setErrDescription(false);
    setErrRemarks(false);
    setErrStateID(false);
    setErrCountryID(false);
    setErrCity(false);
    setErrAddress(false);
    setErrPincode(false);
    setIsActive(false);
  };

  const col = [
    {
      name: "Company Name",
      cell: (row) => {
        const titleId = row.companyName;
        const option = options.find((option) => option._id === titleId);
        return row.companyName;
      },
      sortable: true,
      sortField: "Title",
      minWidth: "150px",
    },
    {
      name: "Name",
      cell: (row) => {
        const titleId = row.name;
        const option = options.find((option) => option._id === titleId);
        return row.name;
      },
      sortable: true,
      sortField: "Title",
      minWidth: "150px",
    },
    {
      name: "Email",
      cell: (row) => {
        const titleId = row.email;
        const option = options.find((option) => option._id === titleId);
        return row.email;
      },
      sortable: true,
      sortField: "Title",
      minWidth: "150px",
    },
    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "Status",
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

  console.log(
    "bwudhbwhdbwhxbhu",
    `${process.env.REACT_APP_API_URL_Millenium}/${File}`
  );

  document.title = " Investor Master | Shilp StartUp Foundation";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Investor Master"
            title="Investor Master"
            pageTitle="Investor Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Investor Master
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
                              setParticipantCategoryId("");
                              setFormErrors({});
                              setName("");
                              setContactNo("");
                              setEmail("");
                              setCompanyName("");
                              setDescription("");
                              setRemarks("");
                              setStateID("");
                              setCountryID("");
                              setCity("");
                              setAddress("");
                              setPincode("");
                              setErrparticipantCategoryId(false);
                              setErrName(false);
                              setErrContactNo(false);
                              setErrEmail(false);
                              setErrCompanyName(false);
                              setErrDescription(false);
                              setErrRemarks(false);
                              setErrStateID(false);
                              setErrCountryID(false);
                              setErrCity(false);
                              setErrAddress(false);
                              setErrPincode(false);
                              setIsActive(false);
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
                              setParticipantCategoryId("");
                              setFormErrors({});
                              setName("");
                              setContactNo("");
                              setEmail("");
                              setCompanyName("");
                              setDescription("");
                              setRemarks("");
                              setStateID("");
                              setCountryID("");
                              setCity("");
                              setAddress("");
                              setPincode("");
                              setErrparticipantCategoryId(false);
                              setErrName(false);
                              setErrContactNo(false);
                              setErrEmail(false);
                              setErrCompanyName(false);
                              setErrDescription(false);
                              setErrRemarks(false);
                              setErrStateID(false);
                              setErrCountryID(false);
                              setErrCity(false);
                              setErrAddress(false);
                              setErrPincode(false);
                              setIsActive(false);
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
                                  <Row>
                                    <Col lg={6}>
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassParticipent}
                                          required
                                          name="participantCategoryId"
                                          value={participantCategoryId}
                                          onChange={(e) => {
                                            setParticipantCategoryId(
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {options.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.categoryName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select Participant Category{" "}
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
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="companyName"
                                          className={validClassCompany}
                                          placeholder="Enter Company Name"
                                          value={companyName}
                                          required
                                          onChange={(e) => {
                                            setCompanyName(e.target.value);
                                          }}
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

                                  <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"BannerImage_" + _id}
                                          type="text"
                                          name="name"
                                          className={validClassName}
                                          placeholder="Enter text"
                                          value={name}
                                          required
                                          onChange={(e) => {
                                            setName(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Name{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.name}
                                          </p>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="contactNo"
                                          className={validClassContact}
                                          placeholder="Enter Contact Number"
                                          value={contactNo}
                                          required
                                          onChange={(e) => {
                                            setContactNo(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="email"
                                          className={validClassEmail}
                                          placeholder="Enter Email Address"
                                          value={email}
                                          required
                                          onChange={(e) => {
                                            setEmail(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Email Address{" "}
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
                                          key={"contactNo" + _id}
                                          type="texareat"
                                          name="description"
                                          className={validClassDescription}
                                          placeholder="Enter Description"
                                          value={description}
                                          style={{height: "100px"}}
                                          required
                                          onChange={(e) => {
                                            setDescription(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="textarea"
                                          name="remarks"
                                          className={validClassRemarks}
                                          placeholder="Enter Remarks"
                                          value={remarks}
                                          style={{height: "100px"}}
                                          required
                                          onChange={(e) => {
                                            setRemarks(e.target.value);
                                          }}
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
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassCountry}
                                          required
                                          name="CountryID"
                                          value={CountryID}
                                          onChange={(e) => {
                                            setCountryID(e.target.value);
                                            fetchStates(e.target.value);
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {country.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.CountryName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select Country{" "}
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
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassState}
                                          required
                                          name="StateID"
                                          value={StateID}
                                          onChange={(e) => {
                                            setStateID(e.target.value);
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {state.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.StateName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select State{" "}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="City"
                                          className={validClassCity}
                                          placeholder="Enter City"
                                          value={City}
                                          required
                                          onChange={(e) => {
                                            setCity(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="pincode"
                                          className={validClassPincode}
                                          placeholder="Enter Address"
                                          value={pincode}
                                          required
                                          onChange={(e) => {
                                            setPincode(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Pin Code{" "}
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
                                  <Row>
                                    <Col lg={12}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="address"
                                          className={validClassAddress}
                                          placeholder="Enter Address"
                                          value={address}
                                          style={{height: "100px"}}
                                          required
                                          onChange={(e) => {
                                            setAddress(e.target.value);
                                          }}
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
                                    </Col>
                                    
                                  </Row>
                                  <Row></Row>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          key={"IsActive_" + _id}
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          // onChange={handleCheck}
                                          onChange={(e) => {
                                            setIsActive(e.target.checked);
                                          }}
                                          checked={IsActive}
                                        />
                                        <Label
                                          className="form-check-label"
                                          htmlFor="activeCheckBox"
                                        >
                                          Is Active
                                        </Label>
                                      </div>
                                    </Col>
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
                                        onClick={handleAddCancel}
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
                                  <Row>
                                    <Col lg={6}>
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassParticipent}
                                          required
                                          name="participantCategoryId"
                                          value={participantCategoryId}
                                          onChange={(e) => {
                                            setParticipantCategoryId(
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {options.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.categoryName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select Participant Category{" "}
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
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="companyName"
                                          className={validClassCompany}
                                          placeholder="Enter Company Name"
                                          value={companyName}
                                          required
                                          onChange={(e) => {
                                            setCompanyName(e.target.value);
                                          }}
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
                                  <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"BannerImage_" + _id}
                                          type="text"
                                          name="name"
                                          className={validClassName}
                                          placeholder="Enter text"
                                          value={name}
                                          required
                                          onChange={(e) => {
                                            setName(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Name{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.name}
                                          </p>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="contactNo"
                                          className={validClassContact}
                                          placeholder="Enter Contact Number"
                                          value={contactNo}
                                          required
                                          onChange={(e) => {
                                            setContactNo(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="email"
                                          className={validClassEmail}
                                          placeholder="Enter Email Address"
                                          value={email}
                                          required
                                          onChange={(e) => {
                                            setEmail(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Email Address{" "}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="description"
                                          style={{height: "100px"}}
                                          className={validClassDescription}
                                          placeholder="Enter Description"
                                          value={description}
                                          required
                                          onChange={(e) => {
                                            setDescription(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="remarks"
                                          style={{height: "100px"}}
                                          className={validClassRemarks}
                                          placeholder="Enter Remarks"
                                          value={remarks}
                                          required
                                          onChange={(e) => {
                                            setRemarks(e.target.value);
                                          }}
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
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassCountry}
                                          required
                                          name="CountryID"
                                          value={CountryID}
                                          onChange={(e) => {
                                            setCountryID(e.target.value);
                                            fetchStates(e.target.value);
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {country.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.CountryName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select Country{" "}
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
                                      {" "}
                                      <div className="form-floating mb-3">
                                        <select
                                          key={"participantCategoryId" + _id}
                                          className={validClassState}
                                          required
                                          name="StateID"
                                          value={StateID}
                                          onChange={(e) => {
                                            setStateID(e.target.value);
                                          }}
                                        >
                                          <option value="">Select From</option>
                                          {state.map((user) => (
                                            <option
                                              key={user._id}
                                              value={user._id}
                                            >
                                              {user.StateName}
                                            </option>
                                          ))}
                                        </select>
                                        <Label>
                                          Select State{" "}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="City"
                                          className={validClassCity}
                                          placeholder="Enter City"
                                          value={City}
                                          required
                                          onChange={(e) => {
                                            setCity(e.target.value);
                                          }}
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
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="pincode"
                                          className={validClassPincode}
                                          placeholder="Enter Address"
                                          value={pincode}
                                          required
                                          onChange={(e) => {
                                            setPincode(e.target.value);
                                          }}
                                        />
                                        <Label>
                                          Pin Code{" "}
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
                                  <Row>
                                    <Col lg={12}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          key={"contactNo" + _id}
                                          type="text"
                                          name="address"
                                          className={validClassAddress}
                                          placeholder="Enter Address"
                                          value={address}
                                          style={{height: "100px"}}
                                          required
                                          onChange={(e) => {
                                            setAddress(e.target.value);
                                          }}
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
                                    </Col>
                                    
                                  </Row>

                                  <div className="mt-5">
                                    <Col lg={6}>
                                      <div className="form-check mb-2">
                                        <Input
                                          key={"IsActive_" + _id}
                                          type="checkbox"
                                          name="IsActive"
                                          value={IsActive}
                                          // onChange={handleCheck}
                                          onChange={(e) => {
                                            setIsActive(e.target.checked);
                                          }}
                                          checked={IsActive}
                                        />
                                        <Label
                                          className="form-check-label"
                                          htmlFor="activeCheckBox"
                                        >
                                          Is Active
                                        </Label>
                                      </div>
                                    </Col>
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
                                        onClick={handleUpdateCancel}
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
          setParticipantCategoryId("");
          setFormErrors({});
          setName("");
          setContactNo("");
          setEmail("");
          setCompanyName("");
          setDescription("");
          setRemarks("");
          setStateID("");
          setCountryID("");
          setCity("");
          setAddress("");
          setPincode("");
          setErrparticipantCategoryId(false);
          setErrName(false);
          setErrContactNo(false);
          setErrEmail(false);
          setErrCompanyName(false);
          setErrDescription(false);
          setErrRemarks(false);
          setErrStateID(false);
          setErrCountryID(false);
          setErrCity(false);
          setErrAddress(false);
          setErrPincode(false);
          setIsActive(false);
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

export default Investor;
