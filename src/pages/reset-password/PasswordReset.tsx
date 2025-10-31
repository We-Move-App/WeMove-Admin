import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordReset.module.css";
import loginBg from "@/assets/login-bg.png";
import axiosInstance from "@/api/axiosInstance";

type Step = "email" | "otp" | "password";

interface PasswordResetProps {
  onBack: () => void;
}

export default function PasswordReset({ onBack }: PasswordResetProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Mocked handlers
  // const handleEmailSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setSuccess("Password reset code sent to your email!");
  //     setStep("otp");
  //     setResendTimer(60);
  //   }, 1000);
  // };

  // API Integration

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/auth/send-email-otp", {
        email,
      });

      if (response.data?.success) {
        setSuccess("Password reset code sent to your email!");
        setStep("otp");
        setResendTimer(60);
      } else {
        setError(response.data?.message || "Failed to send reset code.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const otpCode = otp.join("");
      const response = await axiosInstance.post("/auth/verify-email-otp", {
        email,
        otp: otpCode,
      });

      if (response.data?.success) {
        setSuccess("Code verified! Please set your new password.");
        setStep("password");
      } else {
        setError(response.data?.message || "Invalid verification code.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/auth/password-reset/resend", {
        email,
      });

      if (response.data?.success) {
        setSuccess("New code sent to your email!");
        setResendTimer(60);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(response.data?.message || "Failed to resend code.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        // code: otp.join(""),
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      if (response.data?.success) {
        setSuccess("Password updated successfully! Redirecting...");
        setTimeout(() => onBack(), 1500);
      } else {
        setError(response.data?.message || "Failed to update password.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // const handleResendOtp = () => {
  //   if (resendTimer > 0) return;
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setSuccess("New code sent to your email!");
  //     setResendTimer(60);
  //     setTimeout(() => setSuccess(""), 2000);
  //   }, 1000);
  // };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) newOtp[i] = pasteData[i];
    setOtp(newOtp);
  };

  // const handleOtpSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setStep("password");
  // };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return "weak";
    if (
      password.length < 10 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    )
      return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // const handlePasswordSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSuccess("Password updated successfully! Redirecting...");
  //   setTimeout(() => onBack(), 1500);
  // };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.card}>
        {step === "email" && (
          <>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a code to reset your
              password.
            </p>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handleEmailSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Sending Code..." : "Send Reset Code"}
              </button>
              <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
              >
                Back to Login
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className={styles.title}>Enter Verification Code</h1>
            <p className={styles.subtitle}>
              We've sent a 4-digit code to <strong>{email}</strong>.
            </p>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handleOtpSubmit}>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={styles.otpInput}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={loading}
                  />
                ))}
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setStep("email")}
              >
                Change Email
              </button>

              <div className={styles.resendText}>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className={styles.resendButton}
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className={styles.title}>Set New Password</h1>
            <p className={styles.subtitle}>
              Choose a strong password to secure your account.
            </p>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handlePasswordSubmit}>
              {/* New Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div
                        className={`${styles.strengthFill} ${
                          styles[
                            `strength${
                              passwordStrength.charAt(0).toUpperCase() +
                              passwordStrength.slice(1)
                            }`
                          ]
                        }`}
                      />
                    </div>
                    <span>Password strength: {passwordStrength}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
