import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/authApi";
import loginBg from "@/assets/login-bg.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser({ username: email, password });
      console.log("Login Success:", result);
      const { accessToken, refreshToken } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl h-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Log In Here</h2>
        <p className="text-md text-gray-600 text-center mb-2">
          Welcome back to We Move All! Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white transition ${
              loading ? "bg-green-700" : "bg-green-700 hover:bg-green-900"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* <p className="text-center text-sm text-gray-600 mt-4">
          Forgot password?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Reset it here
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
