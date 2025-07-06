"use client";

import { FormEventHandler, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import eyeImage from "../../../../public/images/openEyeSVGIcon.svg";
import closedEyeImage from "../../../../public/images/closeEyeSVGIcon.svg";
import crossImage from "../../../../public/images/errorCrossSVGIcon.svg";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ByndLogo from "../../../../public/images/ByndLogo.svg";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isError, setError] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        if (result.error === "Email not verified") {
          router.push("/email-verify");
        } else {
          setError(true);
          console.error("Login failed:", result.error);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(true);
      console.error("Login submission error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Bynd - Login</title>
        <meta name="description" content="Login to your Bynd account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

      <div className="w-full bg-[#FAFCFF] p-4 flex flex-col justify-start items-start min-h-screen gap-8">
        <Image src={ByndLogo} alt="ByndLogo" width={90} height={90} className="self-center" />
        <div className="flex flex-col max-w-[600px] w-full mx-auto bg-white h-full p-5 shadow-custom-blue rounded-lg gap-4">
          <div className="header-section flex flex-col gap-1 items-center justify-center">
            <h1 className="text-[24px] font-normal leading-[38px] text-[#101828]">
              Welcome Back
            </h1>
            <div className="signup-link">
              <p className="text-base font-medium leading-6 text-[#344054]">
                Don&apos;t have an account?
                <Link
                  href="/auth/register"
                  className="text-[#0047cb] no-underline ml-2 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="email-input-section relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                autoComplete="email"
                className="w-full h-[54px] p-3 bg-white border-[1.5px] border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
              />
            </div>

            <div className="password-input-section relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full h-[54px] p-3 pr-11 bg-white border-[1.5px] border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                onFocus={() => setIsPasswordFocused(true)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Image
                  src={showPassword ? eyeImage : closedEyeImage}
                  alt={showPassword ? "Hide password" : "Show password"}
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="forgot-password-section text-right">
                <Link
                  href="/auth/forgot-password"
                  className="inline-block text-[#0047cb] text-sm font-medium no-underline -mt-3 -mb-2 hover:cursor-pointer"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="submit-button-section">
                <button
                  type="submit"
                  className="p-3 w-full bg-[#0047cb] text-white border-none rounded-md font-medium text-md cursor-pointer hover:bg-[#003bb3]"
                >
                  Login
                </button>
              </div>
            </div>

            {isError && (
              <div className="error-message-section flex items-start justify-center gap-3 p-4">
                <div className="error-content flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                <label>
                <Image
                  src={crossImage}
                  alt="Error"
                  width={28}
                  height={28}
                />
                </label>
                <p className="text-[#d92d20] font-medium text-md">
                  Error
                </p>
                </div>
                <div>
                <p className="text-[#667085] text-sm leading-5">
                  The provided email address and password do not match our
                  records. Please double-check your credentials and try
                  again.
                </p>
                </div>
              </div>
              </div>
              )}
          </form>
        </div>
      </div>
    </>
  );
}
