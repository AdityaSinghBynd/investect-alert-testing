import { FormEventHandler, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AUTH_URL } from "@/constant/constant";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Head from "next/head";
import PasswordProgress from "@/components/ui/PasswordProgress";
import ByndLogo from "../../../../public/images/ByndLogo.svg";
import { useRouter } from "next/navigation";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    symbol: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password: string) => {
    const errors = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);

    const strength = Object.values(errors).filter(Boolean).length;
    setPasswordStrength(strength);

    const allValidationsPassed = Object.values(errors).every(Boolean);
    if (allValidationsPassed) {
      setTimeout(() => {
        setShowValidation(false);
      }, 500);
    } else {
      setShowValidation(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      setShowValidation(true);
      if (formData.confirmPassword) {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }
    if (name === "confirmPassword") {
      setShowPasswordMatch(true);
      setPasswordsMatch(value === formData.password);
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

  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      if (formData.password === formData.confirmPassword) {
        const response = await fetch(`${AUTH_URL}/auth/email/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        // const data = await response.json();

        if (response.status === 204) {
          router.push("/email-verify");
          // window.location.href = "/email-verify";
        } else if (response.status === 422) {
          alert(
            "Email already exists. Please try with another email or contact us to sort out your account."
          );
        }
      }else {
        alert("Passwords do not match.");

      }
    } catch (error) {
      console.error("An error occurred while registering the user:", error);
      alert("An error occurred during registration. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>Bynd - Create Account</title>
        <meta name="description" content="Create your Bynd account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

      <div className="w-full min-h-screen bg-layer-3 p-4 overflow-y-auto flex flex-col gap-8 scrollbar-thin scrollbar-thumb-[#cbd5e0] scrollbar-track-[#f7fafc]">
        <Image
          src={ByndLogo}
          alt="Background"
          width={90}
          height={90}
          className="self-center"
        />
        <div className="flex flex-col max-w-[600px] w-full mx-auto">
          <div className="bg-layer-1 shadow-custom-blue rounded-lg p-8">
            <header className="flex flex-col gap-2 items-center justify-center mb-8">
              <h1 className="text-[30px] font-semibold leading-[38px] text-text-primary tracking-wide m-0">
                Create account
              </h1>
              <p className="text-base font-normal leading-6 text-text-primary m-0">
                Already have an account?
                <Link
                  href="/auth/login"
                  className="text-[#0047cb] font-medium no-underline ml-2 hover:text-[#003bb3] transition-colors"
                >
                  Login
                </Link>
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="w-full h-[54px] px-4 py-3 bg-layer-1 border border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none hover:border-[#0047cb]/50"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                    className="w-full h-[54px] px-4 py-3 bg-layer-1 border border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none hover:border-[#0047cb]/50"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full h-[54px] px-4 py-3 bg-layer-1 border border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none hover:border-[#0047cb]/50"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full h-[54px] px-4 py-3 bg-layer-1 border border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none hover:border-[#0047cb]/50"
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    setShowValidation(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full h-[54px] px-4 py-3 bg-layer-1 border border-[#eaf0fc] rounded-lg text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none hover:border-[#0047cb]/50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="h-[54px] w-full bg-[#0047cb] text-white border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-[#003bb3] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </form>
          </div>

          {showValidation && (
            <div className="mt-6 bg-layer-1 p-6 rounded-lg shadow-custom-blue">
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 m-0">
                  {passwordErrors.length ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  <span className="text-sm text-text-secondary">
                    8 characters minimum
                  </span>
                </p>
                <p className="flex items-center gap-2 m-0">
                  {passwordErrors.number ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  <span className="text-sm text-text-secondary">a number</span>
                </p>
                <p className="flex items-center gap-2 m-0">
                  {passwordErrors.symbol ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  <span className="text-sm text-text-secondary">a symbol</span>
                </p>
              </div>
              <div className="mt-4">
                <PasswordProgress strength={passwordStrength} />
              </div>
            </div>
          )}

          {showPasswordMatch && (
            <div className="mt-4 bg-layer-1 p-6 rounded-lg shadow-custom-blue">
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-2 m-0">
                  {passwordsMatch ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  <span className="text-sm text-text-secondary">
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
