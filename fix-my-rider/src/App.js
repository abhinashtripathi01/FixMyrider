import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./views/HomePage";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import AlertComponent from "./components/AlertComponent";

import MainStates from "./context/mainStates";
import FindMechanic from "./views/FindMechanic";
import SinglePage from "./views/SinglePage";
import RegisterMechanic from "./views/RegisterMechanic";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import withAdminAuth from "./hoc/withAdminAuth";
import withSellerAuth from "./hoc/withSellerAuth";
import AdminDashboard from "./views/Admin/AdminDashboard";
import MechanicRequestsPage from "./views/Admin/MechanicRequests";
import ManageMechanicPage from "./views/Admin/ManageMechanic";
import SellerDashboard from "./views/Seller/SellerDashboard";
import OrderList from "./views/Seller/OrderList";
import MechanicProfile from "./views/Seller/MechanicProfile";
import MyOrderPage from "./views/MyOrderPage";
import ChatPage from "./components/Chat/ChatPage";
import ReportedUsers from "./views/Admin/ReportedUsers";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import AboutUsPage from "./views/AboutUsPage";

function App() {
  const ProtectedDashboardLayout = withAdminAuth(DashboardLayout);
  const ProtectedSellerDashboardLayout = withSellerAuth(DashboardLayout);
  return (
    <>
      <MainStates>
        <Header />
        <AlertComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/find-mechanic" element={<FindMechanic />} />
          <Route path="/mechanic/:slug" element={<SinglePage />} />
          <Route path="/register-mechanic" element={<RegisterMechanic />} />
          <Route path="/my-orders" element={<MyOrderPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<ProtectedDashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} index />
            <Route
              path="mechanic-requests"
              element={<MechanicRequestsPage />}
            />
            <Route path="manage-mechanic" element={<ManageMechanicPage />} />
            <Route path="reported-users" element={<ReportedUsers />} />
          </Route>

          <Route path="/seller" element={<ProtectedSellerDashboardLayout />}>
            <Route path="dashboard" element={<SellerDashboard />} index />
            <Route path="order-list" element={<OrderList />} />
            <Route path="manage-mechanic" element={<ManageMechanicPage />} />
            <Route path="mechanic-profile" element={<MechanicProfile />} />
          </Route>
        </Routes>
        <Footer />
      </MainStates>
    </>
  );
}

export default App;
