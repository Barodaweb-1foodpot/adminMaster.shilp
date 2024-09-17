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

import moment from "moment-timezone";
import { createticketMaster, getticketMaster, removeticketMaster, updateticketMaster } from "../../functions/Master/TicketMaster";
const initialState = {
    participantCategoryId: "",
    eventId: "",
    name: "",
    email: "",
    contactNo: "",
    remarks: "",
    amount: "",
    startDate: moment().format("MM-DD-YYYY"),
    endDate: moment().format("MM-DD-YYYY"),
    IsActive: false,
};

const TicketMaster = () => {
    const [values, setValues] = useState(initialState);
    const { code, savePercentage, startDate, endDate, IsActive } = values;
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [participantCategory, setparticipantCategory] = useState([]);
    const [events, setEvents] = useState([]);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

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
                    `${process.env.REACT_APP_API_URL}/api/auth/list/eventMaster`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                console.log("res event", result);
                setEvents(result);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

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
        getticketMaster(_id)
            .then((res) => {
                console.log(res);
                setValues({
                    ...values,
                    name: res.name,
                    contactNo: res.contactNo,
                    email: res.email,
                    eventId: res.eventId,
                    participantCategoryId: res.participantCategoryId,
                    amount: res.amount,
                    remarks: res.remarks,
                    startDate: moment(res.startDate).format("YYYY-MM-DD"),
                    endDate: moment(res.endDate).format("YYYY-MM-DD"),
                    IsActive: res.IsActive,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCheck = (e) => {
        setValues({ ...values, IsActive: e.target.checked });
    };

    const handleClick = (e) => {
        e.preventDefault();
        setFormErrors({});
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);

        if (Object.keys(errors).length === 0) {
            createticketMaster(values)
                .then((res) => {
                    setmodal_list(!modal_list);
                    setValues(initialState);
                    setIsSubmit(false);
                    setFormErrors({});
                    fetchCategories();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const [errAmount, setErrAmount] = useState(false);
    const [errName, setErrName] = useState(false);
    const [errEmail, setErrEmail] = useState(false);
    const [errContact, setErrContact] = useState(false);
    const [errStartDate, setErrStartDate] = useState(false);
    const [errEndDate, setErrEndDate] = useState(false);
    const [errparticipantCategoryId, setErrparticipantCategoryId] = useState(false);
    const [errcategoryId, setErrcategoryId] = useState(false);

    const validate = (values) => {
        const errors = {};

        if (values.participantCategoryId === "") {
            errors.participantCategoryId = "Participant Category is required";
            setErrparticipantCategoryId(true);
        } if (values.participantCategoryId !== "") {
            setErrparticipantCategoryId(false);
        }
        if (values.eventId === "") {
            errors.eventId = "Event selection is required";
            setErrcategoryId(true);
        } if (values.eventId !== "") {
            setErrcategoryId(false);
        }

        if (values.amount == "") {
            errors.amount = "Amount is required!";
            setErrAmount(true);
        }
        if (values.amount !== "") {
            setErrAmount(false);
        }
        if (values.name == "") {
            errors.name = "Ticket Title is required!";
            setErrName(true);
        }
        if (values.name !== "") {
            setErrName(false);
        }

        if (values.startDate == "") {
            errors.startDate = "Date is Required!";
            setErrStartDate(true);
        }
        if (values.startDate !== "") {
            setErrStartDate(false);
        }

        if (values.endDate == "") {
            errors.endDate = "Date is Required!";
            setErrEndDate(true);
        }
        if (values.endDate !== "") {
            setErrEndDate(false);
        }


        return errors;
    };

    const validClassAmount =
        errAmount && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassName =
        errName && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassEmail =
        errName && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassContact =
        errName && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassCategoryid =
        errcategoryId && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassparticipantCategoryId =
        errparticipantCategoryId && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassStartDate =
        errStartDate && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassEndDate =
        errEndDate && isSubmit ? "form-control is-invalid" : "form-control";

    const handleDelete = (e) => {
        e.preventDefault();
        removeticketMaster(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchCategories();
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
            updateticketMaster(_id, values)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    fetchCategories();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

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
                `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/ticketMaster`,
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
                    setData(res.data);
                    setTotalRows(res.count);
                } else if (response.length === 0) {
                    setData([]);
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
            name: "Participant Category",
            selector: (row) => row.participantCategory,
            sortable: true,
            sortField: "code",
            minWidth: "150px",
        },
        {
            name: "Event",
            selector: (row) => row.eventName,
            sortable: true,
            sortField: "eventName",
            minWidth: "150px",
        },
        {
            name: "Ticket",
            selector: (row) => row.name,
            sortable: true,
            sortField: "name",
            minWidth: "150px",
        },
        {
            name: "Start Date",
            selector: (row) => {
                const dateObject = new Date(row.startDate);

                return (
                    <React.Fragment>
                        {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
                    </React.Fragment>
                );
            },
            sortable: true,
            sortField: "startDate",
            minWidth: "150px",
        },
        {
            name: "End Date",
            selector: (row) => {
                const dateObject = new Date(row.endDate);

                return (
                    <React.Fragment>
                        {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
                    </React.Fragment>
                );
            },
            sortable: true,
            sortField: "endDate",
            minWidth: "150px",
        },
        {
            name: "Created Date & Time",
            selector: (row) => {
                // const dateObject = new Date(row.createdAt);

                return (
                    <React.Fragment>
                        {moment
                            .utc(row.createdAt)
                            .tz("America/Los_Angeles")
                            .format("MM-DD-YY hh:mm a")}
                    </React.Fragment>
                );
            },
            sortable: true,
            sortField: "createdAt",
            minWidth: "150px",
        },

        // {
        //     name: "Status",
        //     selector: (row) => {
        //         return <p>{row.IsActive ? "Active" : "InActive"}</p>;
        //     },
        //     sortable: false,
        //     sortField: "Status",
        // },
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

    document.title = "Ticket Master | Startup Fest Gujarat";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Parameters"
                        title="Ticket Master"
                        pageTitle="Parameters"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row className="g-4 mb-1">
                                        <Col className="col-sm" sm={6} lg={4} md={6}>
                                            <h2 className="card-title mb-0 fs-4 mt-2">
                                                Ticket Master
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
                                                data={data}
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
                    Add Ticket
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <select
                                className={validClassparticipantCategoryId}
                                required
                                name="participantCategoryId"
                                value={values.participantCategoryId}
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
                                className={validClassCategoryid}
                                required
                                name="eventId"
                                value={values.eventId}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Select Event
                                </option>
                                {events.map((e) => (
                                    <option key={e._id} value={e._id}>
                                        {e.name}
                                    </option>
                                ))}
                            </select>
                            <Label>
                                Event<span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.eventId}</p>
                            )}
                        </div>

                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassName}
                                placeholder="name "
                                required
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            <Label>
                                Ticket Title<span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.name}</p>
                            )}
                        </div>

                        <Row>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="number"
                                        className="form-control"
                                        placeholder="contactNo "
                                        required
                                        name="contactNo"
                                        value={values.contactNo}
                                        onChange={handleChange}
                                    />
                                    <Label>
                                        Contact No
                                    </Label>
                                </div>

                            </Col>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="email"
                                        required
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    <Label>
                                        Email
                                    </Label>
                                </div></Col>
                        </Row>

                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassAmount}
                                placeholder="Amount "
                                required
                                name="amount"
                                value={values.amount}
                                onChange={handleChange}
                            />
                            <Label>
                                Amount(₹)<span className="text-danger">*</span>{" "}
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.amount}</p>
                            )}
                        </div>

                        <Row>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"
                                        className={validClassStartDate}
                                        placeholder="startDate "
                                        required
                                        name="startDate"
                                        value={startDate}
                                        onChange={handleChange}
                                        min={moment().format("YYYY-MM-DD")}
                                    />
                                    <Label>
                                        Start Date
                                    </Label>
                                    {isSubmit && (
                                        <p className="text-danger">{formErrors.startDate}</p>
                                    )}
                                </div></Col>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"
                                        className={validClassEndDate}
                                        placeholder="endDate "
                                        required
                                        name="endDate"
                                        value={endDate}
                                        onChange={handleChange}
                                        min={startDate}
                                    />
                                    <Label>
                                        End Date
                                    </Label>
                                    {isSubmit && (
                                        <p className="text-danger">{formErrors.endDate}</p>
                                    )}
                                </div></Col>
                        </Row>

                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="form-control"
                                placeholder="remarks"
                                required
                                name="remarks"
                                value={values.remarks}
                                onChange={handleChange}
                                style={{ height: "100px" }}
                            />
                            <Label>
                                Remarks
                            </Label>
                        </div>

                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                value={IsActive}
                                onChange={handleCheck}
                                checked={values.IsActive}
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
                    Edit Ticket
                </ModalHeader>
                <form>
                    <ModalBody>

                        <div className="form-floating mb-3">
                            <select
                                className={validClassparticipantCategoryId}
                                required
                                name="participantCategoryId"
                                value={values.participantCategoryId}
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
                                className={validClassCategoryid}
                                required
                                name="eventId"
                                value={values.eventId}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Select Event
                                </option>
                                {events.map((e) => (
                                    <option key={e._id} value={e._id}>
                                        {e.name}
                                    </option>
                                ))}
                            </select>
                            <Label>
                                Event<span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.eventId}</p>
                            )}
                        </div>

                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassName}
                                placeholder="name "
                                required
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            <Label>
                                Ticket Title<span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.name}</p>
                            )}
                        </div>

                        <Row>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="number"
                                        className="form-control"
                                        placeholder="contactNo "
                                        required
                                        name="contactNo"
                                        value={values.contactNo}
                                        onChange={handleChange}
                                    />
                                    <Label>
                                        Contact No
                                    </Label>
                                </div>

                            </Col>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="email"
                                        required
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    <Label>
                                        Email
                                    </Label>
                                </div></Col>
                        </Row>

                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassAmount}
                                placeholder="Amount "
                                required
                                name="amount"
                                value={values.amount}
                                onChange={handleChange}
                            />
                            <Label>
                                Amount(₹)<span className="text-danger">*</span>{" "}
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.amount}</p>
                            )}
                        </div>

                        <Row>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"
                                        className={validClassStartDate}
                                        placeholder="startDate "
                                        required
                                        name="startDate"
                                        value={startDate}
                                        onChange={handleChange}
                                        min={moment().format("YYYY-MM-DD")}
                                    />
                                    <Label>
                                        Start Date
                                    </Label>
                                    {isSubmit && (
                                        <p className="text-danger">{formErrors.startDate}</p>
                                    )}
                                </div></Col>
                            <Col lg={6} >
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"
                                        className={validClassEndDate}
                                        placeholder="endDate "
                                        required
                                        name="endDate"
                                        value={endDate}
                                        onChange={handleChange}
                                        min={startDate}
                                    />
                                    <Label>
                                        End Date
                                    </Label>
                                    {isSubmit && (
                                        <p className="text-danger">{formErrors.endDate}</p>
                                    )}
                                </div></Col>
                        </Row>



                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="form-control"
                                placeholder="remarks"
                                required
                                name="remarks"
                                value={values.remarks}
                                onChange={handleChange}
                                style={{ height: "100px" }}

                            />
                            <Label>
                                Remarks
                            </Label>
                        </div>

                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                value={IsActive}
                                checked={values.IsActive}
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
                                    setValues(initialState);
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
                    Remove Ticket
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

export default TicketMaster;
