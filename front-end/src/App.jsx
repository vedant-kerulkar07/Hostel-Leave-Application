// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupForm from "@/components/SignupForm";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LeaveHistoryTimeline from "./pages/LeaveHistoryTimeline";
import LeaveHistoryTable from "./pages/LeaveHistoryTable";
import NotificationsPage from "./pages/NotificationsPage";
import Profile from "./pages/Profile";
import AdminLayout from "@/layouts/AdminLayout";
import OnlyAdminAllowed from "@/components/OnlyAdminAllowed";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "@/components/Login";
import LeaveRequests from "./pages/LeaveRequests";
import LeaveDetails from "./pages/LeaveDetails"
import AdminNotify from "./pages/AdminNotify";
import AdminProfile from "./pages/AdminProfile";
// import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import AdminApprovedLeavesTable from "./components/AdminApprovedLeavesTable";
import Settings from "./pages/Settings";
import AdminAnalytics from "./components/AdminAnalytics";
import StudentAnalytics from "./components/StudentAnalytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* User Dashboard Pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="applyleave" element={<ApplyLeave />} />
          <Route path="timeline" element={<LeaveHistoryTimeline />} />
          <Route path="leavehistory" element={<LeaveHistoryTable />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<Profile />} />
          {/* <Route path="profile" element={<ProfileSettingsPage />} /> */}
        </Route>
      </Route>

      {/* Admin Pages (protected) */}
      <Route element={<OnlyAdminAllowed />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="leaverequests" element={<LeaveRequests />} />
          <Route path="leave/:id" element={<LeaveDetails />} />
          <Route path="adminnotify" element={<AdminNotify />} />
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="adminleaves" element={<AdminApprovedLeavesTable />} />
          <Route path="settings" element={<Settings />} />
          <Route path="adminanalytics" element={<AdminAnalytics />} />
          <Route path="student/:studentId" element={<StudentAnalytics />} />
        </Route>
      </Route>
    </Routes>
  );
}
