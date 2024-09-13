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
    createEventMaster,
    getEventMaster,
    removeEventMaster,
    updateEventMaster,
} from "../../functions/Master/EventMaster";

import StageOfStartup from "./StageOfStartup";
import { Name } from "ajv";
import Country from "../LocationSetUp/Country/Country";
import City from "../LocationSetUp/City/City";

const initialState = {
  Name  : "",
  logo: "",
  contactNo: "",
  email: "",
  startDate: "",
  endDate: "",
  timming: "",
  description: "",
  remarks: "",
  StateID: "",
  CountryID: "",
  City: "",
  address: "",
  pincode: "",
  IsActive: false,
};

const EventMaster = () => {
  const isdCodes = [
    { country: "Afghanistan", code: "+93" },
    { country: "Albania", code: "+355" },
    { country: "Algeria", code: "+213" },
    { country: "Andorra", code: "+376" },
    { country: "Angola", code: "+244" },
    { country: "Antigua and Barbuda", code: "+1" },
    { country: "Argentina", code: "+54" },
    { country: "Armenia", code: "+374" },
    { country: "Australia", code: "+61" },
    { country: "Austria", code: "+43" },
    { country: "Azerbaijan", code: "+994" },
    { country: "Bahamas", code: "+1" },
    { country: "Bahrain", code: "+973" },
    { country: "Bangladesh", code: "+880" },
    { country: "Barbados", code: "+1" },
    { country: "Belarus", code: "+375" },
    { country: "Belgium", code: "+32" },
    { country: "Belize", code: "+501" },
    { country: "Benin", code: "+229" },
    { country: "Bermuda", code: "+1" },
    { country: "Bhutan", code: "+975" },
    { country: "Bolivia", code: "+591" },
    { country: "Bosnia and Herzegovina", code: "+387" },
    { country: "Botswana", code: "+267" },
    { country: "Brazil", code: "+55" },
    { country: "Brunei", code: "+673" },
    { country: "Bulgaria", code: "+359" },
    { country: "Burkina Faso", code: "+226" },
    { country: "Burundi", code: "+257" },
    { country: "Cabo Verde", code: "+238" },
    { country: "Cambodia", code: "+855" },
    { country: "Cameroon", code: "+237" },
    { country: "Canada", code: "+1" },
    { country: "Cayman Islands", code: "+1" },
    { country: "Central African Republic", code: "+236" },
    { country: "Chad", code: "+235" },
    { country: "Chile", code: "+56" },
    { country: "China", code: "+86" },
    { country: "Colombia", code: "+57" },
    { country: "Comoros", code: "+269" },
    { country: "Congo", code: "+242" },
    { country: "Congo, Democratic Republic of the", code: "+243" },
    { country: "Cook Islands", code: "+682" },
    { country: "Costa Rica", code: "+506" },
    { country: "Croatia", code: "+385" },
    { country: "Cuba", code: "+53" },
    { country: "Curaçao", code: "+599" },
    { country: "Cyprus", code: "+357" },
    { country: "Czech Republic", code: "+420" },
    { country: "Denmark", code: "+45" },
    { country: "Djibouti", code: "+253" },
    { country: "Dominica", code: "+1" },
    { country: "Dominican Republic", code: "+1" },
    { country: "Ecuador", code: "+593" },
    { country: "Egypt", code: "+20" },
    { country: "El Salvador", code: "+503" },
    { country: "Equatorial Guinea", code: "+240" },
    { country: "Eritrea", code: "+291" },
    { country: "Estonia", code: "+372" },
    { country: "Eswatini", code: "+268" },
    { country: "Ethiopia", code: "+251" },
    { country: "Falkland Islands", code: "+500" },
    { country: "Faroe Islands", code: "+298" },
    { country: "Fiji", code: "+679" },
    { country: "Finland", code: "+358" },
    { country: "France", code: "+33" },
    { country: "French Guiana", code: "+594" },
    { country: "French Polynesia", code: "+689" },
    { country: "French Southern Territories", code: "+262" },
    { country: "Gabon", code: "+241" },
    { country: "Gambia", code: "+220" },
    { country: "Georgia", code: "+995" },
    { country: "Germany", code: "+49" },
    { country: "Ghana", code: "+233" },
    { country: "Gibraltar", code: "+350" },
    { country: "Greece", code: "+30" },
    { country: "Greenland", code: "+299" },
    { country: "Grenada", code: "+1" },
    { country: "Guadeloupe", code: "+590" },
    { country: "Guam", code: "+1" },
    { country: "Guatemala", code: "+502" },
    { country: "Guernsey", code: "+44" },
    { country: "Guinea", code: "+224" },
    { country: "Guinea-Bissau", code: "+245" },
    { country: "Guyana", code: "+592" },
    { country: "Haiti", code: "+509" },
    { country: "Honduras", code: "+504" },
    { country: "Hong Kong", code: "+852" },
    { country: "Hungary", code: "+36" },
    { country: "Iceland", code: "+354" },
    { country: "India", code: "+91" },
    { country: "Indonesia", code: "+62" },
    { country: "Iran", code: "+98" },
    { country: "Iraq", code: "+964" },
    { country: "Ireland", code: "+353" },
    { country: "Isle of Man", code: "+44" },
    { country: "Israel", code: "+972" },
    { country: "Italy", code: "+39" },
    { country: "Ivory Coast", code: "+225" },
    { country: "Jamaica", code: "+1" },
    { country: "Japan", code: "+81" },
    { country: "Jordan", code: "+962" },
    { country: "Kazakhstan", code: "+7" },
    { country: "Kenya", code: "+254" },
    { country: "Kiribati", code: "+686" },
    { country: "Kuwait", code: "+965" },
    { country: "Kyrgyzstan", code: "+996" },
    { country: "Laos", code: "+856" },
    { country: "Latvia", code: "+371" },
    { country: "Lebanon", code: "+961" },
    { country: "Lesotho", code: "+266" },
    { country: "Liberia", code: "+231" },
    { country: "Libya", code: "+218" },
    { country: "Liechtenstein", code: "+423" },
    { country: "Lithuania", code: "+370" },
    { country: "Luxembourg", code: "+352" },
    { country: "Macau", code: "+853" },
    { country: "Madagascar", code: "+261" },
    { country: "Malawi", code: "+265" },
    { country: "Malaysia", code: "+60" },
    { country: "Maldives", code: "+960" },
    { country: "Mali", code: "+223" },
    { country: "Malta", code: "+356" },
    { country: "Marshall Islands", code: "+692" },
    { country: "Martinique", code: "+596" },
    { country: "Mauritania", code: "+222" },
    { country: "Mauritius", code: "+230" },
    { country: "Mayotte", code: "+262" },
    { country: "Mexico", code: "+52" },
    { country: "Micronesia", code: "+691" },
    { country: "Moldova", code: "+373" },
    { country: "Monaco", code: "+377" },
    { country: "Mongolia", code: "+976" },
    { country: "Montenegro", code: "+382" },
    { country: "Montserrat", code: "+1" },
    { country: "Morocco", code: "+212" },
    { country: "Mozambique", code: "+258" },
    { country: "Myanmar", code: "+95" },
    { country: "Namibia", code: "+264" },
    { country: "Nauru", code: "+674" },
    { country: "Nepal", code: "+977" },
    { country: "Netherlands", code: "+31" },
    { country: "New Caledonia", code: "+687" },
    { country: "New Zealand", code: "+64" },
    { country: "Nicaragua", code: "+505" },
    { country: "Niger", code: "+227" },
    { country: "Nigeria", code: "+234" },
    { country: "Niue", code: "+683" },
    { country: "Norfolk Island", code: "+672" },
    { country: "North Korea", code: "+850" },
    { country: "North Macedonia", code: "+389" },
    { country: "Northern Mariana Islands", code: "+1" },
    { country: "Norway", code: "+47" },
    { country: "Oman", code: "+968" },
    { country: "Pakistan", code: "+92" },
    { country: "Palau", code: "+680" },
    { country: "Palestine", code: "+970" },
    { country: "Panama", code: "+507" },
    { country: "Papua New Guinea", code: "+675" },
    { country: "Paraguay", code: "+595" },
    { country: "Peru", code: "+51" },
    { country: "Philippines", code: "+63" },
    { country: "Poland", code: "+48" },
    { country: "Portugal", code: "+351" },
    { country: "Puerto Rico", code: "+1" },
    { country: "Qatar", code: "+974" },
    { country: "Romania", code: "+40" },
    { country: "Russia", code: "+7" },
    { country: "Rwanda", code: "+250" },
    { country: "Saint Kitts and Nevis", code: "+1" },
    { country: "Saint Lucia", code: "+1" },
    { country: "Saint Vincent and the Grenadines", code: "+1" },
    { country: "Samoa", code: "+685" },
    { country: "San Marino", code: "+378" },
    { country: "Sao Tome and Principe", code: "+239" },
    { country: "Saudi Arabia", code: "+966" },
    { country: "Senegal", code: "+221" },
    { country: "Serbia", code: "+381" },
    { country: "Seychelles", code: "+248" },
    { country: "Sierra Leone", code: "+232" },
    { country: "Singapore", code: "+65" },
    { country: "Sint Maarten", code: "+1" },
    { country: "Slovakia", code: "+421" },
    { country: "Slovenia", code: "+386" },
    { country: "Solomon Islands", code: "+677" },
    { country: "Somalia", code: "+252" },
    { country: "South Africa", code: "+27" },
    { country: "South Korea", code: "+82" },
    { country: "South Sudan", code: "+211" },
    { country: "Spain", code: "+34" },
    { country: "Sri Lanka", code: "+94" },
    { country: "Sudan", code: "+249" },
    { country: "Suriname", code: "+597" },
    { country: "Sweden", code: "+46" },
    { country: "Switzerland", code: "+41" },
    { country: "Syria", code: "+963" },
    { country: "Taiwan", code: "+886" },
    { country: "Tajikistan", code: "+992" },
    { country: "Tanzania", code: "+255" },
    { country: "Thailand", code: "+66" },
    { country: "Timor-Leste", code: "+670" },
    { country: "Togo", code: "+228" },
    { country: "Tokelau", code: "+690" },
    { country: "Tonga", code: "+676" },
    { country: "Trinidad and Tobago", code: "+1" },
    { country: "Tunisia", code: "+216" },
    { country: "Turkey", code: "+90" },
    { country: "Turkmenistan", code: "+993" },
    { country: "Turks and Caicos Islands", code: "+1" },
    { country: "Tuvalu", code: "+688" },
    { country: "Uganda", code: "+256" },
    { country: "Ukraine", code: "+380" },
    { country: "United Arab Emirates", code: "+971" },
    { country: "United Kingdom", code: "+44" },
    { country: "United States", code: "+1" },
    { country: "Uruguay", code: "+598" },
    { country: "Uzbekistan", code: "+998" },
    { country: "Vanuatu", code: "+678" },
    { country: "Vatican City", code: "+39" },
    { country: "Venezuela", code: "+58" },
    { country: "Vietnam", code: "+84" },
    { country: "Yemen", code: "+967" },
    { country: "Zambia", code: "+260" },
    { country: "Zimbabwe", code: "+263" },
  ];
  const [values, setValues] = useState(initialState);
  const {
    Name,
    logo,
    contactNo,
    email,
    startDate,
    endDate,
    timming,
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

  const [stage , setStage] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/get/list/StageOfStartup`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);
        setStage(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateCancel = (e) => {
    e.preventDefault();
    setIsSubmit(false);
    setShowForm(false);
    setUpdateForm(false);
    setPhotoAdd("");
    setPhotoAdd1("");
    setPhotoAdd2("");
    setCheckImagePhoto(false);
    setCheckImagePhoto1(false);
    setCheckImagePhoto2(false);

    setValues(initialState);
  };

  const PhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);

      setPhotoAdd(imageurl);
      setValues({ ...values, logo: e.target.files[0] });
      setCheckImagePhoto(true);
    }
  };

  const PhotoUpload1 = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);

      setPhotoAdd1(imageurl);
      setValues({ ...values, brochure: e.target.files[0] });
      setCheckImagePhoto1(true);
    }
  };

  const PhotoUpload2 = (e) => {
    if (e.target.files.length > 0) {
      const image = new Image();

      let imageurl = URL.createObjectURL(e.target.files[0]);

      setPhotoAdd2(imageurl);
      setValues({ ...values, productImages: e.target.files[0] });
      setCheckImagePhoto2(true);
    }
  };

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
    setFormErrors({});
    setPhotoAdd("");
    setPhotoAdd1("");
    setPhotoAdd2("");
    setCheckImagePhoto(false);
    setCheckImagePhoto1(false);
    setCheckImagePhoto2(false);
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
    getEventMaster(_id)
      .then((res) => {
        console.log("res", res);
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
        setValues({
          ...values,
          Name: res.name,
            logo: res.logo,
            contactNo: res.contactNo,
            email: res.email,
            startDate: formatDate(res.startDate),
          endDate: formatDate(res.endDate), 
            timming: res.timing,
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

  const handleCheckPaid = (e) => {
    setValues({ ...values, IsPaid: e.target.checked });
  };

  const handleSubmitCancel = (e) => {
    e.preventDefault();

    setIsSubmit(false);
    setShowForm(false);
    setUpdateForm(false);
    setValues(initialState);
    setFormErrors({});
    setPhotoAdd("");
    setPhotoAdd1("");
    setPhotoAdd2("");
    setCheckImagePhoto(false);
    setCheckImagePhoto1(false);
    setCheckImagePhoto2(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsSubmit(true);

    let errors = validate(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("name" , values.Name);
        formData.append("logo", values.logo);
        formData.append("contactNo", values.contactNo);
        formData.append("email", values.email);
        formData.append("startDate", values.startDate);
        formData.append("endDate", values.endDate);
        formData.append("timing", values.timming);
        formData.append("description", values.description);
        formData.append("remarks", values.remarks);
        formData.append("StateID", values.StateID);
        formData.append("CountryID", values.CountryID);
        formData.append("City", values.City);
        formData.append("address", values.address);
        formData.append("pincode", values.pincode);
        formData.append("IsActive", values.IsActive);

      createEventMaster(formData)
        .then((res) => {
          console.log("res", res);
          if (res.isOk) {
            setmodal_list(!modal_list);
            setValues(initialState);
            setCheckImagePhoto(false);
            setCheckImagePhoto1(false);
            setCheckImagePhoto2(false);
            setIsSubmit(false);
            setFormErrors({});
            setShowForm(false);
            setPhotoAdd("");
            setPhotoAdd1("");
            setPhotoAdd2("");
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
    removeEventMaster(remove_id)
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
  //     updateEventMaster(_id, values)
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

    console.log("Valuesss",values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      const formData = new FormData();
      formData.append("name" , values.Name);
        formData.append("logo", values.logo);
        formData.append("contactNo", values.contactNo);
        formData.append("email", values.email);
        formData.append("startDate", values.startDate);
        formData.append("endDate", values.endDate);
        formData.append("timing", values.timming);
        formData.append("description", values.description);
        formData.append("remarks", values.remarks);
        formData.append("StateID", values.StateID);
        formData.append("CountryID", values.CountryID);
        formData.append("City", values.City);
        formData.append("address", values.address);
        formData.append("pincode", values.pincode);
        formData.append("IsActive", values.IsActive);
      
      updateEventMaster(_id, formData)
        .then((res) => {
          setUpdateForm(false);
          setShowForm(false);
          setValues(initialState);
          setCheckImagePhoto(false);
          setCheckImagePhoto1(false);
          setCheckImagePhoto2(false);
          setPhotoAdd("");
          setPhotoAdd1("");
          setPhotoAdd2("");
          fetchUsers();
          toast.success("StartUp Details Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("There is some error Please try again!");
        });
    }
  };

  const [errName , setErrName] = useState(false);
    const [errlogo , setErrlogo] = useState(false);
    const [errcontactNo , setErrcontactNo] = useState(false);
    const [erremail , setErremail] = useState(false);
    const [errstartDate , setErrstartDate] = useState(false);
    const [errendDate , setErrendDate] = useState(false);
    const [errtimming , setErrtimming] = useState(false);
    const [errdescription , setErrdescription] = useState(false);
    const [errremarks , setErrremarks] = useState(false);
    const [errStateID , setErrStateID] = useState(false);
    const [errCountryID , setErrCountryID] = useState(false);
    const [errCity , setErrCity] = useState(false);
    const [erraddress , setErraddress] = useState(false);
    const [errpincode , setErrpincode] = useState(false);
    const [errIsActive , setErrIsActive] = useState(false);



  const validate = (values) => {
    const errors = {};
    if (!values.Name) {
      errors.Name = "Name is required";
      setErrName(true);
    }
    if (!values.logo) {
      errors.logo = "Logo is required";
      setErrlogo(true);
    }
    if (!values.contactNo) {
      errors.contactNo = "Contact No is required";
      setErrcontactNo(true);
    }
    if (!values.email) {
      errors.email = "Email is required";
      setErremail(true);
    }
    if (!values.startDate) {
      errors.startDate = "Start Date is required";
      setErrstartDate(true);
    }
    if (!values.endDate) {
      errors.endDate = "End Date is required";
      setErrendDate(true);
    }
    if (!values.timming) {
      errors.timming = "Timming is required";
      setErrtimming(true);
    }
    if (!values.description) {
      errors.description = "Description is required";
      setErrdescription(true);
    }
    if (!values.remarks) {
      errors.remarks = "Remarks is required";
      setErrremarks(true);
    }
    if (!values.StateID) {
      errors.StateID = "State is required";
      setErrStateID(true);
    }
    if (!values.CountryID) {
      errors.CountryID = "Country is required";
      setErrCountryID(true);
    }
    if (!values.City) {
      errors.City = "City is required";
      setErrCity(true);
    }
    if (!values.address) {
      errors.address = "Address is required";
      setErraddress(true);
    }
    if (!values.pincode) {
      errors.pincode = "Pincode is required";
      setErrpincode(true);
    }
    

    return errors;
  };

  const validClassName =
    errName && isSubmit
      ? "form-control is-invalid"
      : "form-control";
    const validlogo =
    errlogo && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validcontactNo =
    errcontactNo && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validemail =
    erremail && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validstartDate =
    errstartDate && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validendDate =
    errendDate && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validtimming =
    errtimming && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validdescription =    
    errdescription && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validremarks =
    errremarks && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validStateID =
    errStateID && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validCountryID =
    errCountryID && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validCity =
    errCity && isSubmit 
        ? "form-control is-invalid"
        : "form-control";
    const validaddress =
    erraddress && isSubmit
        ? "form-control is-invalid"
        : "form-control";
    const validpincode =
    errpincode && isSubmit
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
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/eventMaster`,
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
  const [photoAdd1, setPhotoAdd1] = useState();
  const [checkImagePhoto1, setCheckImagePhoto1] = useState(false);
  const [photoAdd2, setPhotoAdd2] = useState();
  const [checkImagePhoto2, setCheckImagePhoto2] = useState(false);

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      sortField: "firstName",
      minWidth: "150px",
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNo,
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

  document.title = "Event Master | Naidip Foundation";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Event Master"
            title="Event Master"
            pageTitle="Event Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Event Master
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
                              setPhotoAdd("");
                              setPhotoAdd1("");
                              setPhotoAdd2("");
                              setCheckImagePhoto(false);
                              setCheckImagePhoto1(false);
                              setCheckImagePhoto2(false);
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
                                <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={
                                            validClassName
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="Name"
                                          value={Name}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Name{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.Name}
                                          </p>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={
                                            validcontactNo
                                          }
                                          placeholder="Enter password"
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
                                          className={
                                            validemail
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="email"
                                          value={email}
                                          onChange={handleChange}
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
                                 
                                 
                                  <Row>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="date"
                                          className={
                                            validstartDate
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="startDate"
                                          value={startDate}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Start Date{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.startDate}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="date"
                                          className={validendDate}
                                          placeholder="Enter contactNo"
                                          required
                                          name="endDate"
                                          value={endDate}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          End Date{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.endDate}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={validtimming}
                                          placeholder="Enter email "
                                          required
                                          name="timming"
                                          value={timming}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Timming{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.timming}
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
                                          className={validdescription}
                                          placeholder="Enter Description"
                                          required
                                          name="description"
                                          value={description}
                                          style={{ height: "100px" }}
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
                                          className={validremarks}
                                          placeholder="Enter Remarks"
                                          required
                                          name="remarks"
                                          value={remarks}
                                          style={{ height: "100px" }}
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
                                          className={validCountryID}
                                          required
                                          name="CountryID"
                                          value={CountryID}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select Country
                                          </option>
                                          {country.map((cat) => (
                                            <option
                                              key={cat._id}
                                              value={cat._id}
                                            >
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
                                          className={validStateID}
                                          required
                                          name="StateID"
                                          value={StateID}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select State
                                          </option>
                                          {state.map((cat) => (
                                            <option
                                              key={cat._id}
                                              value={cat._id}
                                            >
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
                                          className={validCity}
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
                                          className={validpincode}
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
                                  <Row>
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validaddress}
                                        placeholder="Enter Address"
                                        required
                                        name="address"
                                        value={address}
                                        style={{ height: "100px" }}
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
                                  </Row>

                                  <Row>
                                    <Col lg={4}>
                                      <label>
                                        Add Logo{" "}
                                        <span className="text-danger">*</span>
                                      </label>

                                      <input
                                        type="file"
                                        name="logo"
                                        className={validlogo}
                                        accept=".jpg, .jpeg, .png"
                                        onChange={PhotoUpload}
                                      />
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.logo}
                                        </p>
                                      )}
                                      {checkImagePhoto ? (
                                        <img
                                          //   src={image ?? myImage}
                                          className="m-2"
                                          src={photoAdd}
                                          alt="Profile"
                                          width="300"
                                          height="200"
                                        />
                                      ) : null}
                                    </Col>

                                  </Row>
                                  <Row>
                                  <div className="form-check mb-2">
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="IsActive"
                                      value={IsActive}
                                      checked={IsActive}
                                      onChange={handleCheck}
                                    />
                                    <Label className="form-check-label">
                                      Is Active
                                    </Label>
                                  </div>

                                  </Row>

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
                                <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={
                                            validClassName
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="Name"
                                          value={Name}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Name{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.Name}
                                          </p>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={
                                            validcontactNo
                                          }
                                          placeholder="Enter password"
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
                                          className={
                                            validemail
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="email"
                                          value={email}
                                          onChange={handleChange}
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
                                 
                                 
                                  <Row>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="date"
                                          className={
                                            validstartDate
                                          }
                                          placeholder="Enter password"
                                          required
                                          name="startDate"
                                          value={startDate}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Start Date{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.startDate}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="date"
                                          className={validendDate}
                                          placeholder="Enter contactNo"
                                          required
                                          name="endDate"
                                          value={endDate}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          End Date{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.endDate}
                                          </p>
                                        )}
                                      </div>
                                    </Col>
                                    <Col lg={4}>
                                      <div className="form-floating mb-3">
                                        <Input
                                          type="text"
                                          className={validtimming}
                                          placeholder="Enter email "
                                          required
                                          name="timming"
                                          value={timming}
                                          onChange={handleChange}
                                        />
                                        <Label>
                                          Timming{" "}
                                          <span className="text-danger">*</span>
                                        </Label>
                                        {isSubmit && (
                                          <p className="text-danger">
                                            {formErrors.timming}
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
                                          className={validdescription}
                                          placeholder="Enter Description"
                                          required
                                          name="description"
                                          value={description}
                                          style={{ height: "100px" }}
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
                                          className={validremarks}
                                          placeholder="Enter Remarks"
                                          required
                                          name="remarks"
                                          value={remarks}
                                          style={{ height: "100px" }}
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
                                          className={validCountryID}
                                          required
                                          name="CountryID"
                                          value={CountryID}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select Country
                                          </option>
                                          {country.map((cat) => (
                                            <option
                                              key={cat._id}
                                              value={cat._id}
                                            >
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
                                          className={validStateID}
                                          required
                                          name="StateID"
                                          value={StateID}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select State
                                          </option>
                                          {state.map((cat) => (
                                            <option
                                              key={cat._id}
                                              value={cat._id}
                                            >
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
                                          className={validCity}
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
                                          className={validpincode}
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
                                  <Row>
                                    <div className="form-floating mb-3">
                                      <Input
                                        type="text"
                                        className={validaddress}
                                        placeholder="Enter Address"
                                        required
                                        name="address"
                                        value={address}
                                        style={{ height: "100px" }}
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
                                  </Row>

                                  <Row>
                                    <Col lg={4}>
                                      <label>
                                        Add Logo{" "}
                                        <span className="text-danger">*</span>
                                      </label>

                                      <input
                                        type="file"
                                        name="logo"
                                        className={validlogo}
                                        accept=".jpg, .jpeg, .png"
                                        onChange={PhotoUpload}
                                      />
                                      {isSubmit && (
                                        <p className="text-danger">
                                          {formErrors.logo}
                                        </p>
                                      )}
                                      {values.logo || photoAdd ? (
                                        <img
                                          // key={photoAdd}
                                          className="m-2"
                                          src={
                                            checkImagePhoto
                                              ? photoAdd
                                              : `${process.env.REACT_APP_API_URL}/${values.logo}`
                                          }
                                          width="300"
                                          height="200"
                                        />
                                      ) : null}
                                    </Col>

                                   
                                  </Row>

                                  <div className="form-check mb-2">
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="IsActive"
                                      value={IsActive}
                                      onChange={handleCheck}
                                      checked={IsActive}
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

export default EventMaster;
