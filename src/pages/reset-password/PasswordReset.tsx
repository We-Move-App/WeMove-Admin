import { useState, useRef, useEffect } from "react";
import styles from "./PasswordReset.module.css";
import loginBg from "@/assets/login-bg.png";

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

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Mocked handlers
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password reset code sent to your email!");
      setStep("otp");
      setResendTimer(60);
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("New code sent to your email!");
      setResendTimer(60);
      setTimeout(() => setSuccess(""), 2000);
    }, 1000);
  };

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

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("password");
  };

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Password updated successfully! Redirecting...");
    setTimeout(() => onBack(), 1500);
  };

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
              <div className={styles.formGroup}>
                <label className={styles.label}>New Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
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

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
