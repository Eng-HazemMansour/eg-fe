"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const Signin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post("http://localhost:3018/auth/signin", values);
        Cookies.set("token", data.token, { expires: 7 });
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        alert("Error signing in");
      }
    },
  });

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setUserProfile(null);
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
            <Button variant="contained" color="secondary" onClick={handleLogout} className="mb-2">
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
          <h1 className="text-2xl font-bold mb-4">Sign in</h1>

          <form onSubmit={formik.handleSubmit} className="w-96 p-6 bg-gray-100 shadow-md rounded">
            <TextField fullWidth margin="normal" label="Email" {...formik.getFieldProps("email")} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
            <TextField fullWidth margin="normal" label="Password" type="password" {...formik.getFieldProps("password")} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
            <Button fullWidth type="submit" variant="contained" color="primary">
              Sign In
            </Button>
          </form>
        </>
      )}
    </Container>
  );
};

export default Signin;
