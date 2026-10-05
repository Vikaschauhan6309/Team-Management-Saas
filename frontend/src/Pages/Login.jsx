import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // alert("Login Successful");

    axios.post(import.meta.env.VITE_BACKEND_URL+"/api/auth/login", formData,  {withCredentials: true})
    .then((res)=>{
        // console.log(res.data);
        navigate("/dashboard");

    })
    .catch((err)=>{
         
        toast.error("Invalid Credentials");
    })
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                <div className="h-4 w-4 rounded-md bg-slate-950" />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                TeamFlow
              </span>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                <ShieldCheck size={15} className="text-slate-300" />

                <span className="text-xs font-medium text-slate-300">
                  Secure workspace
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                Welcome back.
                <br />
                <span className="text-slate-500">
                  Let's get to work.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
                Manage your teams, track your work and stay connected with
                everyone in your organization.
              </p>

              <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
                <Feature title="Team management" />
                <Feature title="Task tracking" />
                <Feature title="Team collaboration" />
                <Feature title="Role-based access" />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © 2026 TeamFlow. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">

          <div className="w-full max-w-md">

            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
                <div className="h-4 w-4 rounded-md bg-white" />
              </div>

              <span className="text-xl font-bold tracking-tight">
                TeamFlow
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
              >
                Sign In

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                Your account is protected using secure authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
        <Check size={12} strokeWidth={3} className="text-slate-950" />
      </div>

      <span className="text-xs font-medium text-slate-300">
        {title}
      </span>
    </div>
  );
};

export default Login;