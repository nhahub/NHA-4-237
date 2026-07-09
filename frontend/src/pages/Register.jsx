import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          name,
          email,
          password,
        }
      );

      if (response.data.success) {

        alert("Registration Successful");

        navigate("/login");

      } else {

        alert(response.data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Registration Failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="w-full max-w-md">

        <Card>

          <h1 className="text-4xl font-bold text-center mb-2">

            Create Account 🚀

          </h1>

          <p className="text-center text-slate-500 mb-8">

            Start your AI learning journey

          </p>

          <div className="space-y-4">

            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <Input
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

          </div>

          <Button
            className="mt-6"
            onClick={register}
          >
            Register
          </Button>

          <p className="text-center mt-6 text-slate-600">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 font-semibold ml-2"
            >
              Login
            </Link>

          </p>

        </Card>

      </div>

    </div>

  );

}

export default Register;