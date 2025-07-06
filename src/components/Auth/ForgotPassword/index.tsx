"use client"

import { FormEvent, useState } from "react";
import EmailVerify from "@/components/Auth/EmailVerify";
import { useRouter } from "next/navigation";
import { X } from 'lucide-react'
import Head from "next/head";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/constant/constant";
import Image from "next/image";
import ByndLogo from "../../../../public/images/ByndLogo.svg";

export default function ForgotPassword() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot/password`, {
        email: email.trim(),
      });

      if (response.data.error === "emailNotExists" || response.status === 422) {
        setError(
          "We couldn't find an account with that email address. Please check your email or sign up for a new account.",
        );
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 422) {
        setError(
          "We couldn't find an account with that email address. Please check your email or sign up for a new account.",
        );
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Failed to send reset instructions. Please try again");
      }
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bynd - Forgot Password</title>
        <meta name="description" content="Reset your Bynd account password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

        <div className="w-full bg-[#FAFCFF] p-4 flex flex-col justify-start items-start min-h-screen gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#cbd5e0] scrollbar-track-[#f7fafc]">
        <Image src={ByndLogo} alt="Background" width={90} height={90} className="self-center" />
          <div className="mx-auto max-w-[600px] w-full p-5 bg-white shadow-custom-blue rounded-lg">
            {isSuccess ? (
              <EmailVerify />
            ) : (
              <div className="flex flex-col gap-4">
                <header className="flex flex-col gap-2 items-center justify-center mb-6">
                  <h1 className="text-[30px] font-bold text-[#101828] leading-[38px] m-0">
                    Forgot Password
                  </h1>
                  <p className="text-base leading-6 text-[#344054] text-center font-normal m-0">
                    Enter the email you used to create your account so we can
                    send you instructions on how to reset your password.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="relative m-0">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                      autoComplete="email"
                      disabled={isLoading}
                      className="w-full h-[54px] px-[14px] py-[10px] bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 ease-in-out placeholder-[#667085] focus:border-[#0047cb] focus:ring-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="h-[54px] w-full bg-[#0047cb] text-white border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#003bb3] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : "Send Reset Instructions"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      disabled={isLoading}
                      className="h-[54px] w-full bg-white text-[#344054] border border-[#e4e7ec] rounded-lg font-medium text-base cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#f9fafb] hover:border-[#d0d5dd] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back to Login
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-[#fff1f1] border border-[#fecdcd] rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">
                        <X className="h-5 w-5 text-[#d92d20]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#d92d20] font-medium text-sm m-0 mb-1">
                          Error
                        </p>
                        <p className="text-[#667085] text-sm leading-5 m-0">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
    </>
  );
}
