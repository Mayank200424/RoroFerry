// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Navbar from './components/navbar/Navbar';
// import Home from './pages/home/Home';
// import About from './pages/about/About';
// import Footer from './components/footer/Footer';
// import Ticket from './pages/ticket/Ticket';
// import NotFound from './pages/notfound/NotFound';
// import Contact from './pages/contact/Contact';
// import Login from './pages/login/Login';
// import Register from './pages/register/Register';
// import Terms from './pages/Terms/TermsOfService';
// import FeedbackReview from './pages/feedback/FeedbackReview';
// import FerrySelection from './pages/ticket/FerrySelection';
// import PassengerDetails from './pages/ticket/PassengerDetails'
// import Faq from './pages/faq/Faq';
// import ForgotPassword from './pages/forgetpassword/ForgetPassword';
// import OtpPage from './pages/forgetpassword/OtpPage';


// function App() {
//   return (
//     <Router>
//       <MainLayout />
//     </Router>
//   );
// }

// function MainLayout() {
//   const location = useLocation();
//   const hideLayout = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname === "/otp"; // Hide for login & register pages

//   return (
//     <main className="w-full flex flex-col bg-neutral-50 min-h-screen">
//       {/* Conditionally render Navbar */}
//       {!hideLayout && <Navbar />}

//       {/* Routing */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/ticket" element={<Ticket />} />
//         <Route path="*" element={<NotFound />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/otp" element={<OtpPage />} />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/review" element={<FeedbackReview />} />
//         <Route path="/ferry-selection/:id" element={<FerrySelection />} />
//         <Route path="/passenger-details" element={<PassengerDetails />} />
//         <Route path="/faq" element={<Faq />} />

//       </Routes>

//       {/* Conditionally render Footer */}
//       {!hideLayout && <Footer />}
//     </main>
//   );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Navbar from "./components/navbar/Navbar";
// import Footer from "./components/footer/Footer";
// import Home from "./pages/home/Home";
// import About from "./pages/about/About";
// import Ticket from "./pages/ticket/Ticket";
// import NotFound from "./pages/notfound/NotFound";
// import Contact from "./pages/contact/Contact";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
// import Terms from "./pages/Terms/TermsOfService";
// import ReviewPage from "./pages/review/ReviewPage";
// import FerrySelection from "./pages/ticket/FerrySelection";
// import PassengerDetails from "./pages/ticket/PassengerDetails";
// import Faq from "./pages/faq/Faq";
// import ForgotPassword from "./pages/forgetpassword/ForgetPassword";
// import OtpPage from "./pages/forgetpassword/OtpPage";
// import Profile from "./pages/profile/Profile";
// import Payment from "./pages/ticket/Payment";

// // Admin Pages
// import AdminLogin from "./Admin/pages/LoginPage";
// import Dashboard from "./Admin/pages/Dashboard";
// import UsersPage from "./Admin/pages/UsersPage";
// import FeedbackManage from "./Admin/pages/FeedbackManage";
// import AgentsManagement from "./Admin/pages/AgentsManagement";
// import ShipManagement from "./Admin/pages/Ferry/ShipManagement";
// import VehicleTypes from "./Admin/pages/VehicleTypes";
// import Sidebar from "./Admin/components/Sidebar";  // ✅ Import Sidebar
// import "./index.css";
// import AddFerryForm from "./Admin/pages/Ferry/AddForm";
// import ScheduleManagement from "./Admin/pages/Schedule/ScheduleManagement";
// import AddSchedule from "./Admin/pages/Schedule/AddSchedule";


// function App() {
//   return (
//     <Router>
//       <MainLayout />
//     </Router>
//   );
// }

// function MainLayout() {
//   const location = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if the current page is an Admin Page
//   const isAdminPage = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";

//   // Hide Navbar/Footer for login/register/forgot password pages
//   const hideLayout =
//     location.pathname === "/login" ||
//     location.pathname === "/register" ||
//     location.pathname === "/forgot-password" ||
//     location.pathname === "/otp";

//   useEffect(() => {
//     if (location.pathname === "/admin/login") {
//       setIsAuthenticated(false);
//     }
//   }, [location.pathname]);

//   return (
//     <div className="w-full flex min-h-screen bg-neutral-50">
//       {/* Render Sidebar only for Admin Pages (except login) */}
//       {isAdminPage && <Sidebar />}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {!isAdminPage && !hideLayout && <Navbar />}

//         <Routes>
//           {/* User Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/ticket" element={<Ticket />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/otp" element={<OtpPage />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/terms" element={<Terms />} />
//           {/* <Route path="/review" element={<FeedbackReview />} /> */}
//           <Route path="/ferry-selection/:id" element={<FerrySelection />} />
//           <Route path="/passenger-details" element={<PassengerDetails />} />
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/faq" element={<Faq />} />
//           <Route path="/review" element={<ReviewPage />} />

//           {/* Admin Routes */}
//           <Route path="/admin/login" element={<AdminLogin/>} />

//           <Route path="/admin/dashboard" element={<Dashboard/>} />

//           <Route path="/admin/users" element={<UsersPage/>} />

//           <Route path="/admin/feedback" element = { <FeedbackManage />} />

//           <Route path="/admin/schedule" element={<ScheduleManagement /> } />

//           <Route path="/admin/agent" element={<AgentsManagement />} />

//           <Route path="/admin/ship" element={<ShipManagement/> } />

//           <Route path="/admin/vehicle" element={<VehicleTypes/> } />

//           <Route path="/admin/add-ferry" element={<AddFerryForm/> } />

//           <Route path="/admin/add-schedule" element={<AddSchedule/> }/>

//           <Route path="*" element={<NotFound />} />
//         </Routes>

//         {!isAdminPage && !hideLayout && <Footer />}
//       </div>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Ticket from "./pages/ticket/Ticket";
import NotFound from "./pages/notfound/NotFound";
import Contact from "./pages/contact/Contact";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Terms from "./pages/Terms/TermsOfService";
import ReviewPage from "./pages/review/ReviewPage";
import FerrySelection from "./pages/ticket/FerrySelection";
import BookingForm from "./pages/ticket/PassengerDetails";
import Faq from "./pages/faq/Faq";
import ForgotPassword from "./pages/forgetpassword/ForgetPassword";
import OtpPage from "./pages/forgetpassword/OtpPage";
import Profile from "./pages/profile/Profile";
import Success from "./pages/payment/success";
import Cancle from "./pages/payment/cancle";


// Admin Pages
import AdminLogin from "./Admin/pages/LoginPage";
import Sidebar from "./Admin/components/Sidebar";
import Dashboard from "./Admin/pages/Dashboard";
import UsersPage from "./Admin/pages/UsersPage";
import ShipManagement from "./Admin/pages/Ferry/ShipManagement";
import ScheduleManagement from "./Admin/pages/Schedule/ScheduleManagement";
import FeedbackManage from "./Admin/pages/FeedbackManage";
import ContactManagement from "./Admin/pages/ContactManagement";
import AddFerryForm from "./Admin/pages/Ferry/AddForm";
import AddSchedule from "./Admin/pages/Schedule/AddSchedule";
import AllBookings from "./Admin/pages/Booking";
import "./index.css";

const App = () => {
  const userId = localStorage.getItem("userId");
  return (

    <Router>
      <Toaster/>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(!!token);  // ✅ Check token on page load
  }, [location.pathname]);

  // Hide Sidebar for "/admin/login"
  const isAdminPage = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";

  // Hide Navbar/Footer for specific pages
  const hideLayout = ["/login", "/register", "/forgot-password", "/otp", "/admin/login"].includes(location.pathname);

  return (
    <div className="w-full flex min-h-screen bg-neutral-50">
      {/* Show Sidebar only for Admin Pages (except login) */}
      {isAdminPage && isAuthenticated && <Sidebar />}  {/* ✅ Show Sidebar only if logged in */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Show Navbar only if not an admin page and not hidden */}
        {!isAdminPage && !hideLayout && <Navbar />}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {isAuthenticated ? (
            <>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/ship" element={<ShipManagement />} />
              <Route path="/admin/schedule" element={<ScheduleManagement />} />
              <Route path="/admin/booking" element={<AllBookings />} />
              <Route path="/admin/feedback" element={<FeedbackManage />} />
              <Route path="/admin/contact" element={<ContactManagement />} />
              <Route path="/admin/add-ferry" element={<AddFerryForm />} />
              <Route path="/admin/add-schedule" element={<AddSchedule />} />
              
            </>
          ) : (
            <Route path="*" element={<Navigate to="/admin/login" />} />  // ✅ Redirect if not authenticated
          )}

          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/ferry-selection/:id" element={<FerrySelection />} />
          <Route path="/passenger-details" element={<BookingForm />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/payment-success" element={<Success />} />
          <Route path="/payment/cancle" element={<Cancle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Show Footer only if not an admin page and not hidden */}
        {!isAdminPage && !hideLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;