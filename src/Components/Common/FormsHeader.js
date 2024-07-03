import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Input,
  Row,
} from "reactstrap";

const FormsHeader = ({
  formName,
  filter,
  handleFilter,
  setQuery,
  initialState,
  setValues,
  updateForm,
  showForm,
  setShowForm,
  setUpdateForm,
}) => {
  return (
    <React.Fragment>
      <Row className="g-4 mb-1">
        <Col className="col-sm" lg={4} md={6} sm={6}>
          <h2 className="card-title mb-0 fs-4 mt-2">{formName}</h2>
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
              <Label className="form-check-label ms-2">Active</Label>
            </div>
          </div>
        </Col>
        <Col className="col-sm-auto" lg={4} md={12} sm={12}>
          <div className="d-flex justify-content-sm-end">
            {/* add btn */}
            <div
              style={{
                display: showForm || updateForm ? "none" : "",
              }}
            >
              <Row>
                <Col lg={12}>
                  <div className="d-flex justify-content-sm-end">
                    <div>
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
                  </div>
                </Col>
              </Row>
            </div>

            {/* update list btn */}

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
                        setUpdateForm(false);
                        setShowForm(false);
                      }}
                    >
                      <i class="ri-list-check align-bottom me-1"></i> List
                    </button>
                  </div>
                </Col>
              </Row>
            </div>

            {/* search */}
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
    </React.Fragment>
  );
};

export default FormsHeader;
