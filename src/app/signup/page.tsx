"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const Signup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const initialValues = { email: "", name: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    name: Yup.string().min(3, "Must be at least 3 characters").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Za-z]/, "Must contain at least one letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Must contain at least one special character")
      .required("Required"),
  });

  const handleSignup = async (values: typeof initialValues) => {
    try {
      const { data } = await axios.post("http://localhost:3018/auth/signup", values);
      Cookies.set("token", data.token, { expires: 7 }); // Save token in cookies for 7 days
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
      alert("Error signing up");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
  };

  const handleGetProfile = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return alert("No token found. Please sign in.");

      const { data } = await axios.post("http://localhost:3018/auth/profile", { token });

      setUserProfile(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch profile");
    }
  };

  return (
    <Container maxWidth="xs" className="flex flex-col items-center justify-center min-h-screen">
      {isLoggedIn ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to the application.</h1>

          <div className="mb-4">
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Button variant="contained" color="primary" onClick={handleGetProfile}>
            Get Profile
          </Button>

          {userProfile && (
            <div className="mt-4 p-4 bg-black rounded shadow-md">
              <Typography variant="h6">Profile Info</Typography>
              <Typography>Email: {userProfile.email}</Typography>
            </div>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Sign up</h1>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSignup}>
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form className="w-96 p-6 bg-gray-100 shadow-md rounded">
                <TextField fullWidth margin="normal" label="Email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} />
                <TextField fullWidth margin="normal" label="Name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={touched.name && Boolean(errors.name)} helperText={touched.name && errors.name} />
                <TextField fullWidth margin="normal" label="Password" type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password && Boolean(errors.password)} helperText={touched.password && errors.password} />
                <Button fullWidth type="submit" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Container>
  );
};

export default Signup;
