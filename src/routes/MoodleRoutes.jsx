import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Student from "../pages/student/Student";
import AddStudents from "../pages/student/AddStudents";
import Lecturer from "../pages/lecturer/Lecturer";
import Courses from "../pages/courses/Courses";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

function MoodleRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/students"
          element={
            <Layout>
              <Student />
            </Layout>
          }
        />
        <Route
          path="/addstudent"
          element={
            <Layout>
              <AddStudents />
            </Layout>
          }
        />

        <Route
          path="/lecturers"
          element={
            <Layout>
              <Lecturer />
            </Layout>
          }
        />

        <Route
          path="/courses"
          element={
            <Layout>
              <Courses />
            </Layout>
          }
        />

        <Route
          path="/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />

        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default MoodleRoutes;
