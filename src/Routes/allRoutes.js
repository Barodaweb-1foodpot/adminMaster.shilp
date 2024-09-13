import React from "react";
import { Navigate } from "react-router-dom";

import Country from "../pages/LocationSetUp/Country/Country";
import City from "../pages/LocationSetUp/City/City";
import State from "../pages/LocationSetUp/State/State";
import CompanyLocation from "../pages/LocationSetUp/CompanyLocation";
import Login from "../pages/Authentication/Login";
import CategoryMaster from "../pages/Category/CategoryMaster";
import Blogs from "../pages/Blogs/Blogs";
import UserProfile from "../pages/Authentication/user-profile";
import Banner from "../pages/CMS/Banner";
import CompanyDetails from "../pages/Setup/CompanyDetails";
import AdminUser from "../pages/Auth/AdminUser";
import CMSContentForm from "../pages/CMS/CmsMaster";
import NewsletterSubs from "../pages/Inquiry/NewsLetterSubs";
import NotificationSetup from "../pages/Notifications/NotificationSetup";
import Applications from "../pages/Applications/Applictions";
import Approved from "../pages/Applications/Approved";
import ParticipantCategoryMaster from "../pages/Category/ParticipantCategoryMaster";
import Investor from "../pages/Master/Investor";
import StartUp from "../pages/Master/Startup";
import TicketMaster from "../pages/Master/TicketMaster";
import StageOfStartup from "../pages/Master/StageOfStartup";
import FaqMaster from "../pages/FAQMaster/FaqMaster";
const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/profile", component: <UserProfile /> },
  {path: "/stage-of-startup", component: <StageOfStartup />},
  {path: "/startup", component: <StartUp />},
  {path: "/investor", component: <Investor />},
  { path: "/country", component: <Country /> },
  { path: "/city", component: <City /> },
  { path: "/state", component: <State /> },
  { path: "/location", component: <CompanyLocation /> },
  { path: "/admin-user", component: <AdminUser /> },
  { path: "/company-details", component: <CompanyDetails /> },

  { path: "/applicants", component: <Applications /> },
  { path: "/approved", component: <Approved /> },

  { path: "/category", component: <CategoryMaster /> },
  { path: "/participant-category", component: <ParticipantCategoryMaster /> },
  { path: "/ticket-master", component: <TicketMaster /> },


  // { path: "/blogs", component: <Blogs /> },
  // { path: "/banner", component: <Banner /> },
  { path: "/cms-master", component: <CMSContentForm /> },
  { path: "/newsletter-master", component: <NewsletterSubs /> },
  { path: "/notification-setup", component: <NotificationSetup /> },
  { path: "/faq-master", component: <FaqMaster /> },


  {
    path: "/",
    exact: true,
    component: <Navigate to="/category" />,
  },
  { path: "*", component: <Navigate to="/category" /> },
];

const publicRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
