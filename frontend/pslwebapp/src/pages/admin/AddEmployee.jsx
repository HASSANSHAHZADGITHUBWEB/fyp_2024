import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react"; 
import api from "../../api/axios";

// --- SHARED STYLES (Same as AddSubscriber) ---
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },
  card: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
    padding: "40px",
    borderTop: "4px solid #3699ff", 
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    marginTop: 0,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#3699ff",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
    marginTop: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box", 
    height: "42px",
    background: "#fff"
  },
  // Error Styles
  inputError: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    border: "1px solid #f64e60", // Red Border
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box", 
    height: "42px",
    background: "#fff5f8"
  },
  errorText: {
    color: "#f64e60",
    fontSize: "12px",
    marginTop: "5px",
    display: "block"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  btnCancel: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "white",
    color: "#555",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btnSave: {
    padding: "10px 24px",
    borderRadius: "4px",
    border: "none",
    background: "#3699ff",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(54, 153, 255, 0.3)",
  }
};

const AddEmployee = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  // 1. STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnic: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. FETCH DATA
  useEffect(() => {
    api.get("designations/").then((res) => setDesignations(res.data));

    if (editId) {
      setLoading(true);
      api.get(`employees/${editId}/`).then((res) => {
        setFormData({
          name: res.data.name,
          email: res.data.email,
          cnic: res.data.cnic ? String(res.data.cnic) : "",
          designation: res.data.designation || "",
          password: "",
        });
        setLoading(false);
      });
    }
  }, [editId]);

  // 3. VALIDATION LOGIC
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // CNIC Validation: Must be 13 digits
    if (!formData.cnic || !/^\d{13}$/.test(formData.cnic)) {
        newErrors.cnic = "CNIC must be exactly 13 digits (no dashes)";
        isValid = false;
    }

    // Designation Validation
    if (!formData.designation) {
        newErrors.designation = "Please select a designation";
        isValid = false;
    }

    // Password Validation
    if (editId) {
        // Edit Mode: Only validate if user typed something
        if (formData.password && formData.password.length < 8) {
            newErrors.password = "New password must be at least 8 characters";
            isValid = false;
        }
    } else {
        // Create Mode: Mandatory
        if (!formData.password || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  // 4. HANDLERS
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run Validation Check
    if (!validateForm()) {
        alert("Please fix the errors in the form.");
        return;
    }

    try {
      if (editId) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password; 
        await api.put(`employees/${editId}/`, dataToSend);
        alert("Employee Updated Successfully! 🎉");
      } else {
        await api.post("employees/", formData);
        alert("New Employee Created! 🚀");
      }
      navigate("/admin/employees"); 
    } catch (err) {
      console.error(err);
      alert("Error saving employee. Please check your inputs.");
    }
  };

  const handleChange = (e) => {
    // Clear error when user types
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/employees")} style={styles.backButton}>
          <ArrowLeft size={20} /> Back to List
        </button>
      </div>

      <div style={styles.card}>
        {loading ? (
            <p style={{textAlign: 'center', color: '#666', padding: '40px'}}>Loading profile data...</p>
        ) : (
            <form onSubmit={handleSubmit}>
            
            <h1 style={styles.title}>{editId ? "Edit Employee" : "Add New Employee"}</h1>
            <p style={styles.subtitle}>
                {editId ? "Update user information and permissions." : "Create a new user account for your team."}
            </p>

            {/* SECTION 1: PERSONAL DETAILS */}
            <div style={styles.sectionTitle}>Personal Details</div>
            
            <div style={styles.grid}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ali Khan"
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ali@example.com"
                        style={styles.input}
                        required
                    />
                </div>
            </div>

            {/* SECTION 2: ROLE & IDENTIFICATION */}
            <div style={styles.sectionTitle}>Role & Identification</div>

            <div style={styles.grid}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>CNIC Number *</label>
                    <input 
                        type="text" 
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="3740512345671"
                        // Apply Error Style if Error exists
                        style={errors.cnic ? styles.inputError : styles.input}
                        required
                    />
                    {errors.cnic && <span style={styles.errorText}>{errors.cnic}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Designation *</label>
                    <select
                        name="designation"
                        className="form-input" 
                        value={formData.designation}
                        onChange={handleChange}
                        style={errors.designation ? styles.inputError : styles.input}
                        required
                    >
                        <option value="">Select Role...</option>
                        {designations.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    {errors.designation && <span style={styles.errorText}>{errors.designation}</span>}
                </div>
            </div>

            {/* SECTION 3: SECURITY */}
            <div style={styles.sectionTitle}>Account Security</div>

            <div style={styles.formGroup}>
                <label style={styles.label}>
                    {editId ? "Set New Password (Optional)" : "Password *"}
                </label>
                <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={editId ? "Leave blank to keep current password" : "Enter a secure password"}
                    style={errors.password ? styles.inputError : styles.input}
                    required={!editId}
                />
                {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {/* ACTION BUTTONS */}
            <div style={styles.buttonGroup}>
                <button type="button" onClick={() => navigate("/admin/employees")} style={styles.btnCancel}>
                    <X size={16} /> Cancel
                </button>
                <button type="submit" style={styles.btnSave}>
                    <Save size={16} /> {editId ? "Save Changes" : "Create Account"}
                </button>
            </div>

            </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;