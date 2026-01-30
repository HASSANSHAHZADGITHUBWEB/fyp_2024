import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/login.css";
import logo from "./style/logo.jpg"; // same logo as ForgotPassword

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 }
  }
};

const textVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!res.ok) throw new Error("Failed to reset password");

      setStatus("success");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="split-screen-container">
      {/* --- LEFT SIDE: IMAGE --- */}
      <div className="left-pane">
        <div className="left-pane-overlay" />
        <motion.div 
          className="welcome-text-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="welcome-header" variants={textVariants}>
            Reset<br />Password
          </motion.h1>
          <motion.p className="welcome-description" variants={textVariants}>
            Enter a new password to secure your account. You will be able to login with it shortly.
          </motion.p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="right-pane">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* LOGO HEADER */}
          <div className="logo-header">
            <img src={logo} alt="App Logo" className="app-logo" />
            <span className="logo-text">
              Sign2<span style={{ color: "#123D66" }}>Text</span>
            </span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">
              Enter your new password to update your account.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-box"
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "2rem"
                }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  style={{ display: "inline-block", marginBottom: "0.5rem" }}
                >
                  <CheckCircle size={48} color="#16a34a" />
                </motion.div>
                <h3 style={{ margin: "0.5rem 0", color: "#166534", fontSize: "1.1rem" }}>Password Updated!</h3>
                <p style={{ margin: 0, color: "#15803d", fontSize: "0.9rem" }}>
                  Redirecting to login...
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label className="input-label">New Password</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p style={{ color: "red", marginTop: "0.5rem" }}>
                    Failed to reset password. Please try again.
                  </p>
                )}

                <div style={{ marginTop: '2rem' }}>
                  <motion.button 
                    type="submit" 
                    className="login-button"
                    style={{ position: 'relative', overflow: 'hidden', backgroundColor: "#123D66" }}
                    whileHover={{ scale: 1.02, backgroundColor: "#164875" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={status === "loading"}
                  >
                    <span style={{ position: 'relative', zIndex: 10 }}>
                      {status === "loading" ? "Updating..." : "Update Password"}
                    </span>
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link 
              to="/login" 
              className="link" 
              style={{ 
                color: "#64748b", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.5rem",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
