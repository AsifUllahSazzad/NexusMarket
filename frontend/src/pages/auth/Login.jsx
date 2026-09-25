import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router";

const Login = ({ onNavigate }) => {
  const [accountType, setAccountType] = useState("buyer");
  const [email, setEmail] = useState("tanvir@nexus.market");
  const [password, setPassword] = useState(
    "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedInSuccess, setSignedInSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  /*
login -> frontend validation
*/

 const handleSubmit = async (e) => {
  e.preventDefault();

  setErrors({});
  setIsSubmitting(true);

  console.log("Remember me:", rememberMe);

  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    console.log("Login response:", response.data);

    if (response.data.success) {
      setSignedInSuccess(true);

      setTimeout(() => {
        onNavigate("home");
      }, 1000);
    }

  } catch (error) {
    const status = error.response?.status;
    const backendErrors = error.response?.data?.errors;

    console.log("Status:", status);
    console.log("Errors:", backendErrors);

    // Send backend errors to React state
    setErrors(backendErrors || {});

    // 404 → account not found
    if (status === 404) {
      console.log("User not found");
    }

    // 401 → wrong password
    if (status === 401) {
      console.log("Incorrect password");
    }

    // 422 → validation error
    if (status === 422) {
      console.log("Validation error");
    }

    // 500 → server error
    if (status >= 500) {
      console.log("Server error");
    }

    // No response → server/network problem
    if (!error.response) {
      console.log("Cannot connect to server");
    }

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-lg relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="material-symbols-outlined text-2xl">
              lock_open
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-outline mt-1 max-w-xs mx-auto">
            Access your verified escrow orders, merchant dashboard, and curated
            marketplace wishlist.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/50 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAccountType("buyer")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${accountType === "buyer" ? "bg-surface-container-lowest text-primary shadow-xs" : "text-outline hover:text-on-surface"}`}
          >
            Buyer / Consumer
          </button>
          <button
            type="button"
            onClick={() => setAccountType("merchant")}
            className={`py-2 rounded-lg transition-all cursor-pointer ${accountType === "merchant" ? "bg-surface-container-lowest text-primary shadow-xs" : "text-outline hover:text-on-surface"}`}
          >
            Store Merchant & Maker
          </button>
        </div>

        {signedInSuccess ? (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface">
              Signed In Successfully
            </h3>
            <p className="text-xs text-outline">
              Redirecting to your account dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                {accountType === "buyer" ? "Email" : "Merchant Business Email"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tanvir@nexus.market"
                  className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-base">
                  alternate_email
                </span>
              </div>
              {errors.email && (
                <p className="mt-1 pl-1 text-[11px] text-red-500 text-center">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-on-surface">Password</label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Password reset link sent to your registered address.",
                    )
                  }
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="w-full h-10 pl-9 pr-10 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-base">
                  lock
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-outline hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 pl-1 text-[11px] text-center text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-outline-variant accent-primary cursor-pointer"
                />
                <span className="text-on-surface font-medium">
                  Keep me signed in
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    refresh
                  </span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In to{" "}
                    {accountType === "buyer"
                      ? "Buyer Account"
                      : "Merchant Portal"}
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

            {/* Social Authentication */}
            <div className="pt-4 border-t border-outline-variant/40 space-y-2.5">
              <span className="text-[11px] text-center block text-outline">
                Or continue seamlessly with
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Signing in with verified Google Workspace account...",
                    )
                  }
                  className="h-9 px-3 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 rounded-xl flex items-center justify-center gap-2 font-medium text-on-surface transition-colors cursor-pointer"
                >
                  <span className="font-bold text-red-500">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert("Signing in with bKash One-Tap Token...")
                  }
                  className="h-9 px-3 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 rounded-xl flex items-center justify-center gap-2 font-medium text-pink-600 transition-colors cursor-pointer"
                >
                  <span className="font-bold">bK</span>
                  <span>bKash ID</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Switch to Sign Up */}
        <div className="mt-6 text-center pt-4 border-t border-outline-variant/30 text-xs text-outline">
          New to NexusMarket?{" "}
          <NavLink
            to={"/register"}
            onClick={() => onNavigate("signup")}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Create an Account / Sell with Us
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Login;
