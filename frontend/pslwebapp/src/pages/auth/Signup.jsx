import { useState, useEffect } from "react";
import { Mail, User, Lock, Eye, EyeOff, CheckCircle, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/login.css";
import { Link } from "react-router-dom";
import axios from "axios";
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

export default function Signup() {
  const [formData, setFormData] = useState({ 
    fullname: "", 
    cnic: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [toast, setToast] = useState({ message: "", type: "" });

  // Disable right click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if(formData.password.length < 8){
      setToast({ message: "Password must be at least 8 characters", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2500);
      return;
    }

    if(formData.password !== formData.confirmPassword){
      setToast({ message: "Passwords do not match", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2500);
      return;
    }

    setSubmitStatus("loading");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        name: formData.fullname,
        cnic: formData.cnic,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        designation: 1  // default
      }, {
        headers: { "Content-Type": "application/json" }
      });

      setSubmitStatus("success");
      setToast({ message: "Account created successfully!", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);

      // Redirect after success
      setTimeout(() => window.location.href = "/dashboard", 1000);

    } catch (error) {
      console.error(error);
      setSubmitStatus("idle");
      setToast({ message: "Registration failed. Try again.", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2500);
    }
  };

  const titleText = "Create Account";

  return (
    <div className="split-screen-container">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

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
            Join the<br />Revolution.
          </motion.h1>
          <motion.p className="welcome-description" variants={textVariants}>
            Be part of the future of sign language communication. 
            Create your account to get started today.
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
          <div className="logo-header">
            <img src={logo} alt="App Logo" className="app-logo" />
            <span className="logo-text">
              Sign2<span style={{ color: "#123D66" }}>Text</span>
            </span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 className="login-title">
              {titleText.split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  style={{ display: "inline-block" }}
                  animate={{ y: [0, -6, 0], color: ["#0f172a", "#123D66", "#0f172a"] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3, delay: index*0.1, ease:"easeInOut" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
            <p className="login-subtitle">It's free and takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  name="fullname"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CNIC */}
            <div className="form-group">
              <label className="input-label">CNIC</label>
              <div className="input-wrapper">
                <Briefcase className="input-icon" />
                <input
                  name="cnic"
                  type="text"
                  className="form-input"
                  placeholder="12345-1234567-1"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <CheckCircle className="input-icon" />
                <input
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <motion.button 
                type="submit" 
                className="login-button"
                style={{ position: 'relative', overflow: 'hidden', backgroundColor: "#1BB8B4" }}
                whileHover={{ scale: 1.02, backgroundColor: "#164875" }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ position: 'relative', zIndex: 10 }}>
                  {submitStatus === "loading" ? "Creating..." : "Create Account"}
                </span>
              </motion.button>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
               Already have an account? 
               <Link to="/" className="link" style={{ color: "#123D66" }}>
                 Sign In
               </Link>
            </p>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
