import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./style/login.css"; 
import axios from "axios"; 

// Update path if needed
import logo from "./style/logo.jpg"; 

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

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [toast, setToast] = useState({ message: "", type: "" }); // toast state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitStatus("loading");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        { email: formData.email, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Save tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSubmitStatus("success");
      setToast({ message: "Login successful! Redirecting...", type: "success" });

      // Redirect based on designation
      const designation = response.data.user.designation?.toLowerCase();
      setTimeout(() => {
        if (designation === "admin") window.location.href = "/admin/dashboard";
        else if (designation === "manager") window.location.href = "/employee/hello";
        else window.location.href = "/dashboard";
      }, 1500);

    } catch (error) {
      console.error(error);
      setSubmitStatus("idle");
      setToast({ message: "Invalid email or password", type: "error" });

      // Remove toast after 2s
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const titleText = "Welcome Back";

  return (
    <div className="split-screen-container">

      {/* --- LEFT SIDE --- */}
      <div className="left-pane">
        <div className="left-pane-overlay" />
        <motion.div 
          className="welcome-text-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="welcome-header" variants={textVariants}>
            Communication<br />Without Limits.
          </motion.h1>
          <motion.p className="welcome-description" variants={textVariants}>
            Empowering the deaf community through advanced AI translation. 
            Sign in to access your dashboard.
          </motion.p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="right-pane">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* --- TOAST MESSAGE --- */}
          <AnimatePresence>
            {toast.message && (
              <motion.div
                key={toast.message}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`toast ${toast.type}`}
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- LOGO HEADER --- */}
          <motion.div 
            className="logo-header"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src={logo} alt="App Logo" className="app-logo" />
            <span className="logo-text">
              Sign2<span style={{ color: "#123D66" }}>Text</span>
            </span>
          </motion.div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 className="login-title">
              {titleText.split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  style={{ display: "inline-block" }}
                  animate={{ 
                    y: [0, -6, 0], 
                    color: ["#0f172a", "#123D66", "#0f172a"] 
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
            <p className="login-subtitle">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Footer Options */}
            <div className="footer-options">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                Remember me
              </label>
              <Link to="/forgot-password" className="link" style={{ color: "#123D66" }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <motion.button 
                type="submit" 
                className="login-button"
                style={{ position: 'relative', overflow: 'hidden', backgroundColor: "#1BB8B4" }}
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(18, 61, 102, 0.2)",
                    "0 10px 15px -3px rgba(18, 61, 102, 0.4)",
                    "0 4px 6px -1px rgba(18, 61, 102, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, backgroundColor: "#164875", transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ position: 'relative', zIndex: 10 }}>
                  {submitStatus === "success" ? "Success! 🚀" : "Sign In"}
                </span>
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    zIndex: 1
                  }}
                />
              </motion.button>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              Don't have an account?{" "}
              <Link to="/signup" className="link" style={{ color: "#123D66" }}>
                Create free account
              </Link>
            </p>
            <br/>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
