import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App'; // ✅ Make sure this path is correct
import CustomToast from "../components/CustomToast";


const Login = ({ setToken, setUserEmail, setUserRole, setUserFirstName, setUserLastName, setUserPhone }) => {  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState("Login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


const onSubmitHandler = async (event) => {
  event.preventDefault();

  const payload =
    currentState === "Sign Up"
      ? { firstName, lastName, email, password, phone }
      : { email, password };

  if (!payload.email || !payload.password) {
    toast(<CustomToast type="error" message="Email and password are required." />);
    return;
  }

  try {
   const endpoint =
  currentState === "Sign Up"
    ? `${backendUrl}/api/musician-login/register`
    : `${backendUrl}/api/musician-login/login`;

console.log("🔄 Submitting login/register form");
console.log("➡️ Endpoint:", endpoint);
console.log("📦 Payload:", payload);

const response = await axios.post(endpoint, payload, {
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // don't include cookies
});

console.log("✅ Response received:", response.data);

if (!response.data.success) {
  throw new Error(response.data.message || "Authentication failed");
}

    const {
      token,
      email: resEmail,
      role,
      firstName: resFirstName,
      lastName: resLastName,
      phone: resPhone,
      userId,
    } = response.data;

    // Lift to parent state
    setToken(token);
    setUserEmail(resEmail);
    setUserRole(role);
    setUserFirstName(resFirstName);
    setUserLastName(resLastName);
    setUserPhone(resPhone);

    // Persist
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", resEmail);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userFirstName", resFirstName);
    localStorage.setItem("userLastName", resLastName);
    localStorage.setItem("userPhone", resPhone);
    localStorage.setItem("userId", userId);
    localStorage.setItem("user", JSON.stringify({ _id: userId, email: resEmail }));

    navigate("/");
  } catch (err) {
    console.error("❌ Auth error:", err);
     console.error("❌ Auth error:", {
    message: err?.message,
    code: err?.code,
    status: err?.response?.status,
    data: err?.response?.data,
  });
    toast(<CustomToast type="error" message={err?.message || "Authentication failed"} />);
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Sign Up" && (
        <>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required className="w-full px-3 py-2 border border-gray-800" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required className="w-full px-3 py-2 border border-gray-800" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required className="w-full px-3 py-2 border border-gray-800" />
        </>
      )}

      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full px-3 py-2 border border-gray-800" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full px-3 py-2 border border-gray-800" />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className=" cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")} className=" cursor-pointer">Create account</p>
        ) : (
          <p onClick={() => setCurrentState("Login")} className=" cursor-pointer">Login Here</p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};



export default Login;

