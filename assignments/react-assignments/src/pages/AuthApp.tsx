import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://api.freeapi.app/api/v1/users";

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AuthApp() {
  const [view, setView] = useState<"login" | "register" | "profile">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<TokenData | null>(null);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setSuccess("Login successful!");
      setTokens(data.data);
      fetchCurrentUser(data.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful! Please login.");
      setView("login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async (tokens: TokenData) => {
    try {
      const res = await fetch(`${API_BASE}/current-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.data);
        setView("profile");
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const handleLogout = async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      setUser(null);
      setTokens(null);
      setView("login");
      setSuccess("Logged out successfully");
    } catch {
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
        >
          ← Back to Projects
        </Link>
      </nav>

      <div className="max-w-md mx-auto">
        {view === "profile" && user ? (
          <div className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-[#2d2d2d] mb-6">
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#6b6b6b]">Username</p>
                <p className="text-lg font-medium text-[#2d2d2d]">
                  {user.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6b6b6b]">Email</p>
                <p className="text-lg font-medium text-[#2d2d2d]">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6b6b6b]">Role</p>
                <p className="text-lg font-medium text-[#2d2d2d]">
                  {user.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full mt-4 bg-[#2d2d2d] text-[#faf8f5] py-3 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setView("login");
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${view === "login" ? "bg-[#2d2d2d] text-[#faf8f5]" : "bg-transparent border border-[#2d2d2d] text-[#2d2d2d]"}`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setView("register");
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${view === "register" ? "bg-[#2d2d2d] text-[#faf8f5]" : "bg-transparent border border-[#2d2d2d] text-[#2d2d2d]"}`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-[#2d2d2d] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-[#2d2d2d] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d2d2d] text-[#faf8f5] py-3 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-[#2d2d2d] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-[#2d2d2d] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-[#2d2d2d] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d2d2d] text-[#faf8f5] py-3 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
