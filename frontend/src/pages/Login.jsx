import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {

        login(
          response.data.user,
          response.data.access_token
        );

        navigate("/dashboard");

      } else {

        alert(response.data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Login Failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="w-full max-w-md">

        <Card>

          <h1 className="text-4xl font-bold text-center mb-2">
            Welcome Back 👋
          </h1>

          <p className="text-center text-slate-500 mb-8">
            Login to continue learning
          </p>

          <div className="space-y-4">

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <Button
            className="mt-6"
            onClick={handleLogin}
          >
            Login
          </Button>

          <p className="text-center mt-6 text-slate-600">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2"
            >
              Register
            </Link>

          </p>

        </Card>

      </div>

    </div>

  );

}

export default Login;