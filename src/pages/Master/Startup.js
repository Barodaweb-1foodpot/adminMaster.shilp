import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import {toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createStartUpDetailsMaster,
  getStartUpDetailsMaster,
  removeStartUpDetailsMaster,
  updateStartUpDetailsMaster,
} from "../../functions/Master/startup";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";

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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [participantCategory, setparticipantCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");
  const [error, setError] = useState(null);

  const [Adminuser, setAdminuser] = useState([]);
  const [CountryIDD, setCountryIDD] = useState("");

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
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getStartUpDetailsMaster(_id)
      .then((res) => {
        setValues({
          ...values,
          participantCategoryId: res.participantCategoryId,
          categoryId: res.categoryId,
          contactPersonName: res.contactPersonName,
          contactNo: res.contactNo,
          email: res.email,
          password: res.password,
          companyName: res.companyName,
          logo: res.logo,
          description: res.description,
          remarks: res.remarks,
          StateID: res.StateID,
          CountryID: res.CountryID,
          City: res.City,
          address: res.address,
          pincode: res.pincode,
          IsActive: res.IsActive,
        });
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

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
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

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateStartUpDetailsMaster(_id, values)
        .then((res) => {
          setmodal_edit(!modal_edit);
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
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setAdminuser(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setAdminuser([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

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
                  onClick={() => handleTog_edit(row._id)}
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
            maintitle="Setup"
            title="StartUp Details Master"
            pageTitle="Setup"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="StartUp Details Master"
                    filter={filter}
                    handleFilter={handleFilter}
                    tog_list={tog_list}
                    setQuery={setQuery}
                  />
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={Adminuser}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add Start Up Details
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <select
                className={validClassparticipantCategoryId}
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
                Participant Category <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.participantCategoryId}</p>
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
                Category name <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.categoryId}</p>
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
                Email <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.email}</p>}
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
                Password <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.password}</p>}
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
                Contact Person Name <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.contactPersonName}</p>}
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
                Contact Number <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.contactNo}</p>}
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
                Company Name <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.companyName}</p>}
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
                Description <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.description}</p>}
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
                Remarks <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.remarks}</p>}
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
                Country <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.CountryID}</p>
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
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.StateID}</p>
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
                City <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.City}</p>}
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
                Address <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.address}</p>}
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
                PinCode <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.pincode}</p>}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <FormsFooter
              handleSubmit={handleClick}
              handleSubmitCancel={handleSubmitCancel}
            />
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit Admin Users
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <select
                className={validClassparticipantCategoryId}
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
                Participant Category <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.participantCategoryId}</p>
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
                Category name <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.categoryId}</p>
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
                Email <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.email}</p>}
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
                Password <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.password}</p>}
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
                Contact Person Name <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.contactPersonName}</p>}
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
                Contact Number <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.contactNo}</p>}
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
                Company Name <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.companyName}</p>}
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
                Description <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.description}</p>}
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
                Remarks <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.remarks}</p>}
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
                Country <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.CountryID}</p>
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
                State <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.StateID}</p>
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
                City <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.City}</p>}
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
                Address <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.address}</p>}
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
                PinCode <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.pincode}</p>}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      <DeleteModal
        show={modal_delete}
        handleDelete={handleDelete}
        toggle={handleDeleteClose}
        setmodal_delete={setmodal_delete}
        name="User"
      />
    </React.Fragment>
  );
};

export default StartUpDetailsMaster;
