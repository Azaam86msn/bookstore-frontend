import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate } from "react-router-dom";

const SITE_KEY = "6Lcoz0krAAAAAC-48UCagHg11H0-R6OKLNqPIl-k"; // Replace with your actual reCAPTCHA v3 site key

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Load reCAPTCHA script
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const onSubmit = async (data) => {
    setMessage("");

    if (!window.grecaptcha) {
      setMessage("CAPTCHA is not loaded properly. Please refresh the page.");
      return;
    }

    try {
      const captchaToken = await window.grecaptcha.execute(SITE_KEY, {
        action: "admin_login",
      });

      const response = await axios.post(
        `${getBaseUrl()}/api/auth/admin`,
        { ...data, captchaToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const auth = response.data;
      if (auth.token) {
        localStorage.setItem("adminToken", auth.token);
        setTimeout(() => {
          localStorage.removeItem("adminToken");
          alert("Token has expired! Please login again.");
          navigate("/");
        }, 3600 * 1000); // 1 hour expiry
        navigate("/dashboard");
      } else {
        setMessage("No token received. Please try again.");
      }
    } catch (error) {
      console.error("Admin login failed:", error);
      setMessage(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Admin Dashboard Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              id="username"
              placeholder="Enter your username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                    value
                  ) ||
                  "Password must include a number, letter, and special character",
              })}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3 text-center">
              {message}
            </p>
          )}

          <div className="w-full">
            <button
              type="submit"
              className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
