"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import PasswordProgress from "@/components/ui/PasswordProgress";
import SuccessReset from "@/components/Auth/SuccessReset";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Head from "next/head";
import { AxiosError } from "axios";
import { BASE_URL } from "@/constant/constant";
import axios from "axios";
import ByndLogo from "../../../../public/images/ByndLogo.svg";


export default function PasswordChange() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    symbol: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const errors = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);

    const strength = Object.values(errors).filter(Boolean).length;
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      setIsPasswordFocused(true);
    }
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;
      const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        username,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/reset/password`, {
        password: formData.password,
      });

      if (response.status === 204) {
        setIsSuccess(true);
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 422) {
        setError("Invalid or expired reset link. Please request a new one.");
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Failed to reset password. Please try again");
      }
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bynd</title>
        <meta name="description" content="Bynd fin-tech" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>
      <div className="flex min-h-screen w-full">

        <div className="w-full bg-layer-3 p-4 flex flex-col justify-start items-center min-h-screen gap-8">
          <Image src={ByndLogo} alt="ByndLogo" width={90} height={90} className="self-center" />
          {isSuccess ? (
            <SuccessReset />
          ) : (
            <div className="max-w-[600px] w-full mx-auto flex flex-col gap-4 flex items-center justify-center bg-layer-1 rounded-lg p-5 shadow-custom-blue">
              <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-[24px] font-normal text-text-primary">
                Reset Password
              </h1>
              <p className="text-base font-normal leading-6 text-[#344054]">
                Choose a new password for your account
              </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <div className="relative m-0">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="New Password"
                    className="w-full h-[54px] px-3.5 py-2.5 bg-layer-1 border-[1.5px] border-[#eaf0fc] rounded-md text-sm leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:outline-none pr-11"
                    onFocus={() => setIsPasswordFocused(true)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative m-0">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm Password"
                    className="w-full h-[54px] px-3.5 py-2.5 bg-layer-1 border-[1.5px] border-[#eaf0fc] rounded-md text-sm leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:outline-none pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="h-[54px] bg-[#0047cb] text-white border-none rounded-md font-semibold text-base cursor-pointer transition-colors duration-200 hover:bg-[#003bb3] active:translate-y-[1px]"
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="h-[54px] bg-[#fff] text-black border border-[#E4E7EC] rounded-md font-semibold text-base cursor-pointer  active:translate-y-[1px]"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>

                {isPasswordFocused && (
                  <>
                    <PasswordProgress strength={passwordStrength} />
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        {passwordErrors.length ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                        <span>8 Characters minimum</span>
                      </p>
                      <p className="flex items-center gap-2">
                        {passwordErrors.number ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                        <span>A number</span>
                      </p>
                      <p className="flex items-center gap-2">
                        {passwordErrors.symbol ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                        <span>A symbol</span>
                      </p>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}