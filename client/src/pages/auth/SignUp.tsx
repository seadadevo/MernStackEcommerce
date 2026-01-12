import api from "@/api/axios";
import axios from "axios";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SIGNUP_FIELDS } from "@/constants";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState,  type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/user/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if(res.data.success){
        toast.success(res.data.message);
        navigate("/verify");
      }
    } catch (error) {
      console.error("Error during sign up:", error); 
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Sign up failed. Please try again.");
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const renderInputs = SIGNUP_FIELDS.map((field) => (
    <FormInput
      key={field.id} 
      label={field.label}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  required
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
      />
  ));
  return (
    <div className="min-h-screen  flex items-center justify-center ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                {renderInputs}
              </div>
              <div className="grid gap-2">
                <FormInput
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="enter your email"
                value={formData.email}
                required
                onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="create a password"
                    required
                    onChange={handleChange}
                  />
                  {showPassword ? (
                    <EyeOff
                      className="absolute w-5 h-5 right-2 top-2 text-gray-700"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute w-5 h-5 right-2 top-2 text-gray-700"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full bg-pink-600 hover:bg-pink-600/90" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin"/></> : 'Sign Up' }
          </Button>
          <p className="text-left text-sm w-full mt-[-5px] text-gray-700 ">
            already have an account?
            <Link
              to={"/login"}
              className="hover:underline cursor-pointer text-pink-800"
            >
              {" "}
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
