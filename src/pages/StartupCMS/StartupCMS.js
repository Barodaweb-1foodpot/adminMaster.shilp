import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Input,
  Label,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  createContent,
  listContent,
  getContent,
  removeContent,
  updateContent,
  uploadImage,
  getContentByStartUp
} from "../../functions/StartupCMS/StartupCMS.js";
import JoditEditor from "jodit-react";
import { toast, ToastContainer } from "react-toastify"
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo/ShilpLogo.png"

const initialState = {
  Title: "",
  Content: "",
  IsActive: true,
};

const StartupCMS = ({ placeholder }) => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [_id, set_Id] = useState("");

  const [remove_id, setRemove_id] = useState("");
  const [ContentForm, setContentForm] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [qr_popup, setQr_popup] = useState(false);

  const [values, setValues] = useState(initialState);
  const { Title, Content, IsActive } = values;

  // DISPLAY
  const [showForm, setShowForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);

  const [joditImage, setJoditImage] = useState("");

  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );
  const [content, setContent] = useState("");

  //search and pagination state
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
    // fetchUsers(1); // fetch page 1 of users
  }, []);

  useEffect(() => {
    fetchContent();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchContent = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/startup-cms/list-content-by-params`,
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
          setContentForm(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setContentForm([]);
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

  const UploadImage = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = e.target.files[0];
      const formdata = new FormData();

      formdata.append("myFile", imageurl);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/auth/create/createimageurl`,
          formdata
        )
        .then((res) => {
          setJoditImage(`${process.env.REACT_APP_API_URL}/${res.url}`);
        });
    }
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file
            .then((file) => {
              body.append("uploadImg", file);
              uploadImage(body)
                .then((res) => {
                  console.log("res", res.url);
                  resolve({
                    default: `${process.env.REACT_APP_API_URL}/uploads/cmscontentImages/${res.url}`,
                  });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => reject(err));
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  useEffect(() => {
    loadContentForm();
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const loadContentForm = () => {
    listContent().then((res) => setContentForm(res));
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handleAddCancel = (e) => {
    e.preventDefault();
    setShowForm(false);
    setIsSubmit(false);
    setUpdateForm(false);
    setValues(initialState);
    setJoditImage("");
  };
  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setShowForm(false);
    setUpdateForm(false);
    setIsSubmit(false);
    setValues(initialState);
    setJoditImage("");
  };

  const handleUpdate = (e) => {
    // debugger;
    e.preventDefault();
    console.log("Content UPDATE", values);
    // setFormErrors(validate(TeamRole));
    const errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      updateContent(_id, values)
        .then((res) => {
          console.log(res.ContentUpload);
          setUpdateForm(false);
          setValues(initialState);
          // loadContentForm();
          fetchContent();
          setJoditImage("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    values.ContentUpload = content
    console.log(values);
    console.log(content)
    const errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      createContent(values)
        .then((res) => {
          if (res.isOk) {
            console.log(res);
            setValues(initialState);
            setShowForm(false);
            loadContentForm();
            fetchContent();
            setJoditImage("");
          } else {
            if (res.field === 1) {
              setErrCF(true);
              setFormErrors({ ContentFor: res.message });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("Team Role", remove_id);
    removeContent(remove_id)
      .then((res) => {
        console.log("deleted", res);
        setmodal_delete(!modal_delete);
        loadContentForm();
        fetchContent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [errCF, setErrCF] = useState(false);
  const [errCT, setErrCT] = useState(false);
  const [errURL, setErrURL] = useState(false);

  const validClassCF =
    errCF && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassCT =
    errCT && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassURL =
    errURL && isSubmit ? "form-control is-invalid" : "form-control";

  const validate = (values) => {
    const errors = {};
    if (!values.Title) {
      errors.Title = "Title is required";
      setErrCF(true);
    }
    if (values.Title) {
      setErrCF(false);
    }

    if (!values.Content) {
      errors.Content = "Content is required";
      setErrCT(true);
    }
    return errors;
  };

  const handleTog_edit = (_id) => {
    setUpdateForm(true);
    setIsSubmit(false);
    getContent(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          Title: res.Title,
          Content: res.Content,
          IsActive: res.IsActive,
        });
        set_Id(_id);
        console.log(res.IsActive);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const columns = [
    {
      name: "Content For",
      selector: (row) => row?.startup || row?.Title,
      sortable: true,
      sortField: "Title",
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
    },
  ];

  const [showQR, setShowQR] = useState(false);

  // const id = localStorage.getItem('AdminUser');
  const apiUrl = `https://startupfestgujarat.com/cms/${_id}`;

  const handleGenerateQRCode = (e) => {
    e.preventDefault();
    setShowQR(true);
    setQr_popup(true);
  };

  const downloadPDF = async () => {
    const qrCodeElement = document.getElementById("qr-code-element");

    const canvas = await html2canvas(qrCodeElement, {
      width: qrCodeElement.offsetWidth,
      height: qrCodeElement.offsetWidth, // Force height to match width for square rendering
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(logo, "PNG", 10, 10, 30, 30)

    pdf.setFontSize(16);
    pdf.text(Title ? Title : "", 105, 45, { align: "center" });

    const qrSize = 300;
    pdf.addImage(imgData, "PNG", (210 - qrSize) / 2, 60, qrSize, qrSize);
    // pdf.addImage(imgData, "PNG", 55, 30, 100, 100); 

    pdf.save("QRCode.pdf");
  };

  document.title = "Startup CMS | Startup Fest Gujarat";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Startup CMS"
            title="Startup CMS"
            pageTitle="Startup CMS"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        CMS
                      </h2>
                    </Col>
                    <Col lg={4} md={6} sm={6}>
                      <div
                        style={{
                          display: showForm || updateForm ? "none" : "",
                        }}
                      >
                        <div className="text-end mt-2">
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
                    <Col className="col-sm-auto" lg={4} md={12} sm={12}>
                      <div className="d-flex justify-content-sm-end">
                        {/* <div> */}
                        {/* <div
                          style={{
                            display: showForm || updateForm ? "none" : "",
                          }}
                        >
                          <div className="ms-2">
                            <Button
                              color="success"
                              className="add-btn me-1"
                              onClick={() => {
                                setShowForm(!showForm);
                                setValues(initialState);
                              }}
                            >
                              <i className="ri-add-line align-bottom me-1"></i>
                              Add
                            </Button>
                          </div>
                        </div> */}

                        {/* </Col>
                            </Row>
                          </div> */}

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
                                    // setFileId(Math.random() * 100000);
                                  }}
                                >
                                  <i class="ri-list-check align-bottom me-1"></i>{" "}
                                  List
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        {/* </div> */}

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

                {/* ADD TEXT EDITOR */}
                {/* <Row> */}
                {/* {showForm && ( */}
                <div
                  style={{
                    display: showForm && !updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col lg={12}>
                        <Card className="">
                          <CardBody>
                            <div className="live-preview">
                              <Form onSubmit={handleSubmit}>
                                <Row>
                                  {/* Ttile */}
                                  <Col md={6}>
                                    <div className="form-floating mb-3 ml-3">
                                      <Input
                                        key={"Title_" + _id}
                                        type="text"
                                        className={validClassCF}
                                        placeholder="Enter Team Title"
                                        name="Title"
                                        value={Title}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                          setValues({
                                            ...values,
                                            [e.target.name]: e.target.value,
                                          });
                                        }}
                                      />
                                      <Label>
                                        Title
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.Title}
                                        </p>
                                      )}
                                    </div>
                                  </Col>
                                  {/* URL */}




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
                                    <label>Image URL</label>
                                    <p>{joditImage}</p>
                                  </Col>
                                  <Row>
                                    <Col lg={12} className="mt-2" >
                                      <Label>
                                        Content Editor{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {/* <Form method="post"> */}
                                      {/* <CKEditor
                                          key={"Content" + _id}
                                          editor={ClassicEditor}
                                          data={Content}
                                          config={{
                                            extraPlugins: [uploadPlugin],
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            // handleChange();
                                            setValues({
                                              ...values,
                                              Content: data,
                                            });
                                            console.log(Content);
                                          }}
                                        /> */}
                                      <JoditEditor
                                        ref={editor}
                                        value={Content}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={(newContent) =>
                                          setContent(newContent)
                                        } // preferred to use only this option to update the content for performance reasons
                                        onChange={() => {
                                          setValues({
                                            ...values,
                                            Content:
                                              editor.current.value,
                                          });
                                        }}
                                      />

                                      {/* </Form> */}
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.Content}
                                        </p>
                                      )}

                                    </Col>
                                  </Row>
                                  <Col lg={6}>
                                    <div className="form-check mb-3">
                                      <Input
                                        key={"IsActive_" + _id}
                                        type="checkbox"
                                        name="IsActive"
                                        value={IsActive}
                                        // onChange={handleCheckContent}
                                        onChange={(e) => {
                                          setValues({
                                            ...values,
                                            IsActive: e.target.checked,
                                          });
                                        }}
                                        checked={IsActive}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Is Active
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.IsActive}
                                        </p>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={6}>
                                    <div className="text-end">
                                      <button
                                        onClick={handleSubmit}
                                        className="btn btn-success  m-1"
                                      >
                                        Submit
                                      </button>
                                      <button
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
                          </CardBody>
                        </Card>
                      </Col>
                    </React.Fragment>
                  </CardBody>
                </div>

                <div
                  style={{
                    display: !showForm && updateForm ? "block" : "none",
                  }}
                >
                  <CardBody>
                    <React.Fragment>
                      <Col lg={12}>
                        <Card>
                          <CardBody>
                            <div className="live-preview">
                              <Form>
                                <Row>
                                  <Col md={6}>
                                    <div className="form-floating mb-3">
                                      <Input
                                        key={"Title_" + _id}
                                        type="text"
                                        className={validClassCF}
                                        placeholder="Enter Team Title"
                                        name="Title"
                                        // disabled
                                        value={Title}
                                        onChange={(e) => {
                                          setValues({
                                            ...values,
                                            // [e.target.name]: e.target.value,
                                            Title: e.target.value,
                                          });
                                        }}
                                      />
                                      <Label>
                                        Title{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.Title}
                                        </p>
                                      )}
                                    </div>
                                  </Col>

                                  <Row>
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
                                      <label>Image URL</label>
                                      <p>{joditImage}</p>
                                    </Col>

                                    <Col lg={12} className="mt-2" >
                                      <Label>
                                        Content Editor{" "}
                                        <span className="text-danger">*</span>
                                      </Label>
                                      {/* <Form method="post"> */}
                                      {/* <CKEditor
                                          key={"Content" + _id}
                                          editor={ClassicEditor}
                                          data={Content}
                                          config={{
                                            extraPlugins: [uploadPlugin],
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValues({
                                              ...values,
                                              Content: data,
                                            });
                                          }}
                                        /> */}
                                      <JoditEditor
                                        ref={editor}
                                        value={Content}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={(newContent) =>
                                          setContent(newContent)
                                        } // preferred to use only this option to update the content for performance reasons
                                        onChange={() => {
                                          setValues({
                                            ...values,
                                            Content:
                                              editor.current.value,
                                          });
                                        }}
                                      />

                                      {/* </Form> */}
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.Content}
                                        </p>
                                      )}
                                    </Col>
                                  </Row>
                                  <Col lg={12}>
                                    <div className="form-check mb-3">
                                      <Input
                                        key={"active_" + _id}
                                        type="checkbox"
                                        name="IsActive"
                                        value={IsActive}
                                        onChange={(e) => {
                                          setValues({
                                            ...values,
                                            IsActive: e.target.checked,
                                          });
                                        }}
                                        checked={IsActive}
                                      />
                                      <Label
                                        className="form-check-label"
                                        htmlFor="activeCheckBox"
                                      >
                                        Is Active
                                      </Label>
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.IsActive}
                                        </p>
                                      )}
                                    </div>
                                  </Col>
                                  <Col lg={12}>
                                    <div className=" text-end">
                                      <button
                                        type="submit"
                                        className="btn btn-success  m-1"
                                        onClick={handleUpdate}
                                      >
                                        Update
                                      </button>
                                      <Link to={`https://startupfestgujarat.com/cms/${_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-md m-1 bg-primary text-light"
                                      >
                                        Review
                                      </Link>

                                      <button
                                        className="btn btn-outline-primary m-1"
                                        onClick={handleGenerateQRCode}
                                      >
                                        Generate QR Code
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn btn-outline-danger m-1"
                                        onClick={handleUpdateCancel}

                                      // onClick={() => setupdateform(false)}
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

                    {/* )} */}
                  </CardBody>
                </div>

                {/* NEW LIST */}
                <div
                  style={{ display: showForm || updateForm ? "none" : "block" }}
                >
                  <CardBody>
                    <div>
                      <div className="table-responsive table-card mt-1 mb-1 text-right">
                        <DataTable
                          columns={columns}
                          data={ContentForm}
                          progressPending={loading}
                          sortServer
                          // onRowClicked={(row,e)=>{
                          //   debugger
                          // }}
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
          Remove Content
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

      <Modal
        isOpen={qr_popup}
        toggle={() => {
          setQr_popup(!qr_popup);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setQr_popup(false);
          }}
        >
          Scan QR
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="mt-2 text-center">
              {showQR && (
                <div id="qr-code-element">
                  <QRCodeSVG value={apiUrl} />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setQr_popup(false)}
              >
                Close
              </button>
              {showQR && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>
              )}
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default StartupCMS;
