import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Users from "./pages/Users/Users";
import Location from "./pages/Location/Location";
import Suppliers from "./pages/Suppliers/Suppliers";
import TransferAssets from "./pages/TransferPage/TransferAssets";
import ITAssets from "./pages/Assets/ITAssets/ITAssets";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import Category from "./pages/Category/Category";
import Manufacturer from "./pages/Manufacturer/Manufacturer";
import UserDashboard from "./pages/userPages/UserDashboard";
import AssetsTransferRequest from "./pages/userPages/AssetsTransferRequest";
import AssignedAssets from "./pages/userPages/AssignedAssets";
import MaintenanceRequest from "./pages/MaintenanceRequest/MaintenanceRequest";
import UnauthorizedPage from "./pages/UnAuthorizedPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route
              path="/itassets"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ITAssets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/location"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Location />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transferassets"
              element={
                <ProtectedRoute requiredRole="admin">
                  <TransferAssets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenancerequest"
              element={
                <ProtectedRoute requiredRole="admin">
                  <MaintenanceRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Category />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manufacturer"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Manufacturer />
                </ProtectedRoute>
              }
            />
            {/**user pages */}
            <Route
              path="/userdashboard"
              element={
                <ProtectedRoute requiredRole={"User"}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assetstransferrequest"
              element={
                <ProtectedRoute requiredRole={"User"}>
                  <AssetsTransferRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AssignedAssets"
              element={
                <ProtectedRoute requiredRole={"User"}>
                  <AssignedAssets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenancerequest"
              element={
                <ProtectedRoute requiredRole={"User"}>
                  <MaintenanceRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <ProtectedRoute>
                  <UnauthorizedPage />{" "}
                </ProtectedRoute>
              }
            />

            {/*
          
            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} /> */}

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}
