import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const element = document.getElementById("error-msg");
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    if (input.email !== "eve.holt@reqres.in" && input.password !== "cityslicka")
      element.innerHTML = "Invalid Credentials";
    try {
      const response = await axios.post(`https://reqres.in/api/login`, input);

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        navigate("/allUsers");
      } else {
            element.innerHTML = "Cannot process the request"
      }
    } catch (error) {
      console.error("Login error:", error);
      element.innerHTML = "Invalid Credentials";
    }
  };

  return (
    <div className="flex flex-col items-center  h-screen bg-amber-100">
      <div className="text-center text-purple-800 font-extrabold text-3xl mt-10 mb-20">Welcome To ReqRes API</div>
      <div className="rounded-2xl p-7 bg-amber-200">
        <form
          onSubmit={handlSubmit}
          className="flex flex-col items-center justify-center text-xs md:text-sm gap-2"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-2! md:p-4 text-gray-800">
            Login
          </h3>

          <div className="flex  w-full">
            <input
              type="text"
              placeholder="Email"
              className="border-none outline-none text-gray-600 bg-gray-200 rounded-lg p-2.5 w-full"
              name="email"
              onChange={changeEventHandler}
              value={input.email}
            />
          </div>
          <div className="flex gap-2 w-full">
            <input
              type="password"
              placeholder="Password"
              className="  border-none outline-none text-gray-600 bg-gray-200 rounded-lg p-2.5 w-full"
              name="password"
              onChange={changeEventHandler}
              value={input.password}
            />
          </div>

          <span id="error-msg" className="text-red-600 error-msg pt-2"></span>

          <div className="font-bold underline">
            Demo ID
          </div>
            <div>Email - eve.holt@reqres.in</div>
            <div>Password - cityslicka</div>

          <button className="button mt-4 px-7 py-1.5 text-gray-100 bg-blue-700 text-xl rounded-4xl cursor-pointer" type="submit">
            {" "}
            LogIn{" "}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
