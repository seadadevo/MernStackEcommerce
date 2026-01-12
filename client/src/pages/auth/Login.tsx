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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState,  type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => {
      return {
        ...prev,
      [name]: value
      }
    })
  }

  const submitHandler = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      setLoading(true);
      const res = await api.post('/user/login', formData)
      if(res.data.success){
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem('accessToken' , res.data.accessToken)
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during Login:", error); 
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login up failed. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false)
    }
  }
  


  return (
    <div className="min-h-screen  flex items-center justify-center ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to website</CardTitle>
          <CardDescription>
            Enter your Email and password to Login
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-3">
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
            {loading ? <><Loader2 className="animate-spin"/></> : 'Login' }
          </Button>
          <p className="text-left text-sm w-full mt-[-5px] text-gray-700 ">
            don't have an account?
            <Link
              to={"/sign-up"}
              className="hover:underline cursor-pointer text-pink-800"
            >
              {" "}
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login