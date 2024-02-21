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
import { listUsers } from "../../functions/Auth/Users";
import {
  createuserNotifcation,
  getNotification,
  removeUserNotification,
  updateUserNotification,
} from "../../functions/userNotification/userNotification";

const initialState = {
  UserId: "",
  Type: "",
  Description: "",
  isActive: false,
};

const Notification = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [notifications, setnotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [values, setValues] = useState(initialState);
  const {
    UserId,
    Type,
    Description,

    isActive,
  } = values;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    listUsers().then((res) => setUsers(res));
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

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
    console.log("id", _id);
    getNotification(_id)
      .then((res) => {
        console.log("res in get", res);
        setValues({
          ...values,
          UserId: res.UserId,
          Type: res.Type,
          Description: res.Description,
          isActive: res.isActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, isActive: e.target.checked });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});

    setIsSubmit(true);
    createuserNotifcation(values)
      .then((res) => {
        console.log("res", res);
        setmodal_list(!modal_list);
        setValues(initialState);
        setIsSubmit(false);
        setFormErrors({});
        fetchUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeUserNotification(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateUserNotification(_id, values)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [errNT, setErrNT] = useState(false);
  const [errDS, setErrDS] = useState(false);
  const [errUID, setErrUID] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.Type === "") {
      errors.Type = "Notification Type is required!";
      setErrNT(true);
    }
    if (values.Type !== "") {
      setErrNT(false);
    }

    if (values.Description === "") {
      errors.Description = "Description is required!";
      setErrDS(true);
    }
    if (values.Description !== "") {
      setErrDS(false);
    }

    if (values.UserId === "") {
      errors.UserId = "User is required!";
      setErrUID(true);
    }
    if (values.UserId !== "") {
      setErrUID(false);
    }

    return errors;
  };

  const validClassNT =
    errNT && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDS =
    errDS && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassUID =
    errUID && isSubmit ? "form-control is-invalid" : "form-control";

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
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/listNotificationParams`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          isActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setnotifications(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setnotifications([]);
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
      name: "User Name",
      selector: (row) => row.UserData,
      sortable: true,
      sortField: "UserData",
      minWidth: "150px",
    },
    {
      name: "Notification Type",
      selector: (row) => row.Type,
      sortable: true,
      sortField: "Type",
      minWidth: "150px",
    },
    {
      name: "Description",
      selector: (row) => row.Description,
      sortable: true,
      sortField: "Description",
      minWidth: "150px",
    },

    {
      name: "Status",
      selector: (row) => {
        return <p>{row.isActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "isActive",
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

  document.title = "User Notification | RC Henning Coffee Company";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Notifications"
            title="User Notification"
            pageTitle="Notifications"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        User Notification
                      </h2>
                    </Col>

                    <Col sm={6} lg={4} md={6}>
                      <div className="text-end mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="filter"
                          value={filter}
                          defaultChecked={true}
                          onChange={handleFilter}
                        />
                        <Label className="form-check-label ms-2">Active</Label>
                      </div>
                    </Col>
                    <Col className="col-sm-auto" sm={12} lg={4} md={12}>
                      <div className="d-flex justify-content-sm-end">
                        <div className="ms-2">
                          <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button>
                        </div>
                        <div className="search-box ms-2">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search..."
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={notifications}
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
          Add Notification
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating  mb-3">
              <select
                name="UserId"
                className={validClassUID}
                onChange={handleChange}
                value={UserId}
                data-choices
                data-choices-sorting="true"
              >
                <option>Select User</option>
                {users.map((c) => {
                  return (
                    <React.Fragment key={c._id}>
                      <option value={c._id}>{c.firstName}</option>
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                Users <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.UserId}</p>}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassNT}
                placeholder="Enter last Name"
                required
                name="Type"
                value={Type}
                onChange={handleChange}
              />
              <Label>
                Notification type <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Type}</p>}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="textarea"
                className={validClassDS}
                style={{ height: "100px" }}
                placeholder="Enter Description "
                id="Description"
                name="Description"
                value={Description}
                onChange={handleChange}
              />
              <Label className="form-label">
                Description
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.Description}</p>
              )}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                value={isActive}
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
                onClick={handleClick}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_list(false);
                  setValues(initialState);
                  setIsSubmit(false);
                }}
              >
                Cancel
              </button>
            </div>
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
            <div className="form-floating  mb-3">
              <select
                name="Category"
                className={validClassUID}
                onChange={handleChange}
                value={UserId}
                data-choices
                data-choices-sorting="true"
              >
                <option>Select User</option>
                {users.map((c) => {
                  return (
                    <React.Fragment key={c._id}>
                      {/* {c.IsActive && ( */}
                      <option value={c._id}>{c.firstName}</option>
                      {/* )} */}
                    </React.Fragment>
                  );
                })}
              </select>
              <Label>
                Users <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.UserId}</p>}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassNT}
                placeholder="Enter last Name"
                required
                name="Type"
                value={Type}
                onChange={handleChange}
              />
              <Label>
                Notification type <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Type}</p>}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="textarea"
                className={validClassDS}
                style={{ height: "100px" }}
                placeholder="Enter Description "
                id="Description"
                name="Description"
                value={Description}
                onChange={handleChange}
              />
              <Label className="form-label">
                Description
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.Description}</p>
              )}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                value={isActive}
                checked={isActive}
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

      {/* Remove Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(false);
          }}
        >
          Remove Admin
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
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Notification;
