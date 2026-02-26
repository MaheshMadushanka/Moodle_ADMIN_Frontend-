import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Student from "../pages/student/Student";
import AddStudents from "../pages/student/AddStudents";
import Lecturer from "../pages/lecturer/Lecturer";
import Roles from "../pages/roles/Roles";
import Courses from "../pages/courses/Courses";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

function MoodleRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout>
                <Student />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/addstudent"
          element={
            <ProtectedRoute>
              <Layout>
                <AddStudents />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lecturers"
          element={
            <ProtectedRoute>
              <Layout>
                <Lecturer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <Layout>
                <Roles />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Layout>
                <Courses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default MoodleRoutes;